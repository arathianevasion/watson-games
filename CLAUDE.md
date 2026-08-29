# Watson Games — notes for Claude

See README.md for setup. Non-obvious things:

- Accounts/leaderboards are feature-flagged by `authEnabled` in `src/lib/supabase/env.ts` (true only when both NEXT_PUBLIC_SUPABASE_* vars exist). Currently deployed WITHOUT them. Never call `supabaseEnv()`/`createClient()` without checking the flag.
- UI uses the imported design system: tokens live in `src/app/globals.css`, components in `src/components/ds/` (inline-style, matching the Claude Design source). No Tailwind. Copy rules: sentence case, no emoji, no exclamation marks, mono for numbers, one red (primary) button per view. `Icon` only knows the slugs listed in `src/components/ds/Icon.tsx` — add to the map when you need a new one.
- Games play at `/play/[slug]` (PlayShell); `/games/[slug]` is the detail page.
- Next.js 16: middleware is `src/proxy.ts` (`export function proxy`); `params`/`searchParams` are Promises; use the generated `PageProps<"/route">` / `LayoutProps` types (run `pnpm exec next typegen` if they're missing).
- Game bundles go in `public/game-files/<slug>/`, NOT `public/games/` — a static dir at `/games/<slug>/` shadows the Next `/games/[slug]` route on Cloudflare.
- `public/_headers`: one `*` splat per rule; use `:name` placeholders. Never set `Content-Encoding` for `.unityweb` (Unity 5 loader decompresses in JS).
- Scores are written only via the `submit_score` Postgres function; there is intentionally no insert policy on `scores`.
- `games-src/<slug>/` holds source for games we modify; its built output in `public/game-files/<slug>/` is committed (Cloudflare never builds games). `pnpm build:stack-tower` rebuilds; `games-src` is excluded from root tsconfig/eslint.
- `src/lib/sdk-protocol.ts` and `public/sdk/portal-sdk.js` must stay in sync.
- `src/types/database.ts` is hand-written until `pnpm db:types` can run against a linked project.
- No Docker on this machine, so `supabase start` isn't available; test SQL against the hosted project.
