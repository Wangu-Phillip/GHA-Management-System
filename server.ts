// Legacy Node entrypoint — superseded by Cloudflare Workers deployment.
//
// Local development now uses two processes (see package.json scripts):
//   - `npm run dev`         Vite dev server for the React frontend
//   - `npm run dev:worker`  `wrangler dev` for the Hono API on local D1
//
// The Hono app lives in src/app.ts and is exported via src/worker.ts.

throw new Error(
  'server.ts is deprecated. Use `npm run dev` (Vite) plus `npm run dev:worker` (wrangler) instead.'
);
