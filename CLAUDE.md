# Watson Games — notes for Claude

See README.md for setup. Non-obvious things:

- Next.js 16: middleware is `src/proxy.ts` (`export function proxy`); `params`/`searchParams` are Promises; use the generated `PageProps<"/route">` / `LayoutProps` types (run `pnpm exec next typegen` if they're missing).
- Game bundles go in `public/game-files/<slug>/`, NOT `public/games/` — a static dir at `/games/<slug>/` shadows the Next `/games/[slug]` route on Cloudflare.
- `public/_headers`: one `*` splat per rule; use `:name` placeholders. Never set `Content-Encoding` for `.unityweb` (Unity 5 loader decompresses in JS).
- Scores are written only via the `submit_score` Postgres function; there is intentionally no insert policy on `scores`.
- `src/lib/sdk-protocol.ts` and `public/sdk/portal-sdk.js` must stay in sync.
- `src/types/database.ts` is hand-written until `pnpm db:types` can run against a linked project.
- No Docker on this machine, so `supabase start` isn't available; test SQL against the hosted project.
