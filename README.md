# Watson Games

A portal for hosting browser games — vendored open-source builds (e.g. Slope) and HTML5 games we modify — with accounts and per-game leaderboards.

- **Stack:** Next.js 16 (App Router) · React · TypeScript · Tailwind 4 · pnpm
- **Hosting:** Cloudflare Workers via `@opennextjs/cloudflare` (static assets + SSR)
- **Auth + data:** Supabase (email magic link / password, Google, Discord; Postgres with RLS)

## Local development

```sh
pnpm install
cp .env.example .env.local        # fill in your Supabase URL + anon key
pnpm dev                          # http://localhost:3000
pnpm preview                      # build + run on workerd, http://localhost:8787 (closest to prod)
pnpm lint && pnpm typecheck
```

`pnpm dev` also works without a real Supabase project (auth just fails closed), so game pages can be developed offline.

## Supabase setup (one time)

1. Create a new Supabase project. Copy the URL and anon key into `.env.local` and into the Cloudflare build variables.
2. `pnpm exec supabase login`, then `pnpm exec supabase link --project-ref <ref>`.
3. `pnpm db:push` — applies `supabase/migrations/*.sql` (profiles, games, scores, `submit_score`, `top_scores`).
4. Dashboard → Authentication → Providers: enable **Email**, **Google**, **Discord** (create the OAuth apps and paste client IDs/secrets).
5. Dashboard → Authentication → URL configuration → Redirect URLs: add
   `http://localhost:3000/auth/callback`, `http://localhost:8787/auth/callback`, and `https://<your-domain>/auth/callback`.
6. Optional: `pnpm db:types` regenerates `src/types/database.ts` from the linked project.

## Cloudflare deploy

Connect the repo in the Cloudflare dashboard (Workers & Pages → Create → Workers → import repo):

- Build command: `pnpm run build:cf`
- Deploy command: `pnpm exec wrangler deploy`
- Build variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`

Or deploy from your machine with `pnpm exec wrangler login && pnpm deploy`.

## Adding a game

1. Put the game's static files in `public/game-files/<slug>/` (must contain an `index.html`).
   - Unity 5.x builds (`Build/*.unityweb`) are served as raw bytes via `public/_headers`. Do **not** add a `Content-Encoding` rule — the old Unity loader decompresses in JS.
   - Newer Unity builds (`.data.gz`, `.wasm.br`, …) will need their own `_headers` rules for `Content-Encoding`; add them when the first such game lands.
2. Add an entry to `src/lib/games.ts` (`entry: "/game-files/<slug>/"`, controls, thumbnail in `public/thumbs/`).
3. If the game should have a leaderboard, insert a matching row in the `games` table (new migration: `pnpm exec supabase migration new add_<slug>`) with `score_order`, `min_score`, `max_score`, `leaderboard_enabled = true`, and set `leaderboard.enabled: true` in `games.ts`.
4. For games you control, include the SDK in the game's `index.html` and report scores:

   ```html
   <script src="/sdk/portal-sdk.js"></script>
   <script>
     WatsonGames.onInit(function (info) { /* info.user, info.leaderboard */ });
     // at game over:
     WatsonGames.reportScore(score, { final: true });
   </script>
   ```

   `/games/_sdk-test` is a hidden test page that exercises the bridge end to end.

## How it fits together

- `src/app/games/[slug]/GameFrame.tsx` — iframe + fullscreen + `postMessage` listener; final scores are submitted with `supabase.rpc('submit_score')`.
- `src/lib/sdk-protocol.ts` ↔ `public/sdk/portal-sdk.js` — the message contract (keep in sync).
- `src/proxy.ts` — refreshes the Supabase session cookie (Next 16 "proxy", formerly middleware). Skips `/game-files/`, `/sdk/`, `/thumbs/`.
- `supabase/migrations/20260829000000_init.sql` — schema. Scores can only be written through `submit_score()` (auth required, bounds check, 3 submissions / 10 s). Anti-cheat is best-effort.

Game bundles live under `/game-files/` rather than `/games/` because Cloudflare serves static directories before the Worker runs, which would shadow the `/games/[slug]` route.
