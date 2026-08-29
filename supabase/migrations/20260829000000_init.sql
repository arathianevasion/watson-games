-- Watson Games: profiles, games, scores, leaderboard functions.

-- profiles -------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 24),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles read all" on public.profiles for select using (true);
create policy "profiles update own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(left(new.raw_user_meta_data->>'display_name', 24), ''),
      nullif(left(new.raw_user_meta_data->>'full_name', 24), ''),
      'player_' || left(new.id::text, 6)
    )
  )
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- games (server-side validation config; mirrors src/lib/games.ts) -------------
create table public.games (
  slug text primary key,
  score_order text not null check (score_order in ('asc', 'desc')),
  min_score numeric not null default 0,
  max_score numeric not null,
  leaderboard_enabled boolean not null default true
);
alter table public.games enable row level security;
create policy "games read all" on public.games for select using (true);

insert into public.games (slug, score_order, min_score, max_score, leaderboard_enabled) values
  ('slope', 'desc', 0, 1000000, false),
  ('_sdk-test', 'desc', 0, 10000, true);

-- scores -----------------------------------------------------------------------
create table public.scores (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  game_slug text not null references public.games(slug),
  score numeric not null,
  created_at timestamptz not null default now()
);
create index scores_game_score_desc on public.scores (game_slug, score desc);
create index scores_game_score_asc on public.scores (game_slug, score asc);
create index scores_user_game on public.scores (user_id, game_slug);
alter table public.scores enable row level security;
create policy "scores read all" on public.scores for select using (true);
-- No insert/update/delete policies: writes go through submit_score() only.

-- submit_score: auth + bounds + rate limit -------------------------------------
create function public.submit_score(p_game_slug text, p_score numeric)
returns bigint language plpgsql security definer set search_path = public as $$
declare
  g public.games%rowtype;
  uid uuid := auth.uid();
  recent int;
  new_id bigint;
begin
  if uid is null then raise exception 'not authenticated'; end if;
  select * into g from public.games where slug = p_game_slug;
  if not found or not g.leaderboard_enabled then raise exception 'leaderboard disabled'; end if;
  if p_score is null or p_score <> p_score or p_score < g.min_score or p_score > g.max_score then
    raise exception 'score out of bounds';
  end if;
  select count(*) into recent from public.scores
    where user_id = uid and game_slug = p_game_slug and created_at > now() - interval '10 seconds';
  if recent >= 3 then raise exception 'rate limited'; end if;
  insert into public.scores (user_id, game_slug, score) values (uid, p_game_slug, p_score)
    returning id into new_id;
  return new_id;
end $$;
revoke all on function public.submit_score(text, numeric) from public;
grant execute on function public.submit_score(text, numeric) to authenticated;

-- top_scores: each user's best, ranked ------------------------------------------
create function public.top_scores(p_game_slug text, p_limit int default 10)
returns table (user_id uuid, display_name text, score numeric, created_at timestamptz)
language sql stable security invoker as $$
  with g as (select score_order from public.games where slug = p_game_slug),
  best as (
    select distinct on (s.user_id) s.user_id, s.score, s.created_at
    from public.scores s, g
    where s.game_slug = p_game_slug
    order by s.user_id,
      case when g.score_order = 'desc' then -s.score else s.score end,
      s.created_at
  )
  select b.user_id, p.display_name, b.score, b.created_at
  from best b join public.profiles p on p.id = b.user_id, g
  order by case when g.score_order = 'desc' then -b.score else b.score end, b.created_at
  limit p_limit
$$;
