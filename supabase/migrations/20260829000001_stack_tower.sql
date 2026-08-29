insert into public.games (slug, score_order, min_score, max_score, leaderboard_enabled)
values ('stack-tower', 'desc', 1, 1000, true)
on conflict (slug) do nothing;
