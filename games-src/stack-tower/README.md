# Stack Cheese (source)

Vendored from https://github.com/saadamirpk/stack-tower-3d (React + react-three-fiber + cannon).
Modified to report the final score to the portal via `/sdk/portal-sdk.js` (see `src/App.js`).

Build and copy into the portal from the repo root:

```sh
pnpm build:stack-tower
```

The built output in `public/game-files/stack-tower/` is committed, so the portal deploy never needs to run this.
