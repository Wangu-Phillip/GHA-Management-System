# Guesthouse Management Portal

Multi-tenant guesthouse management SaaS: AI occupancy analytics, WhatsApp marketing automation, CSV imports, super-admin oversight.

**Stack:** React 19 + Vite (SPA) · Hono on Cloudflare Workers · Cloudflare D1 (SQLite) via Prisma D1 adapter.

---

## Architecture

```
Browser  ──►  Cloudflare Worker
                │
                ├──  /api/*    →  Hono router (src/server.ts)  →  Prisma + D1
                └──  rest      →  ASSETS binding (dist/client SPA)
```

- Worker entry: [src/worker.ts](src/worker.ts)
- API routes: [src/server.ts](src/server.ts)
- D1 schema: [prisma/schema.prisma](prisma/schema.prisma)
- Migrations: [migrations/](migrations/) (raw SQL, applied by `wrangler d1 migrations apply`)

---

## How To Run This Application Locally In Dev Mode

To run this application locally, you will need to open **two separate terminal windows** (since the backend and frontend run on different development servers).

**First-time setup (run this once):**
```powershell
npm install
npm run prisma:generate
npm run db:migrate:local            # apply schema + seed to local D1
```

**Terminal 1 (Start the Backend Worker):**
This starts the Cloudflare Worker environment locally on port `8787` simulating your D1 database.
```powershell
npm run dev:worker
```

**Terminal 2 (Start the Frontend SPA):**
This starts the React/Vite development server on port `5173`. The Vite config will automatically proxy `/api` requests to your backend worker running on port `8787`.
```powershell
npm run dev
```

Open http://localhost:5173

Test login presets:
- `admin@guesthousesaas.com` / `admin123` (Super Admin)
- `sarah@pinecrest.com` / `pine123` (Tenant Admin)
- `john@pinecrest.com` / `pine123` (Tenant Sales)

---

## First-time Cloudflare deployment

### 1. Auth
```powershell
npx wrangler login
```

### 2. Create the D1 database
```powershell
npm run db:create
```
Copy the returned `database_id` and paste into [wrangler.jsonc](wrangler.jsonc) under `d1_databases[0].database_id`.

### 3. Apply schema + seed to remote D1
```powershell
npm run db:migrate:remote
```

### 4. Set secrets
```powershell
npx wrangler secret put GEMINI_API_KEY
```
(Paste your key when prompted. Omit if you only want the synthetic AI fallback.)

### 5. Deploy
```powershell
npm run deploy
```
Wrangler builds `dist/client` (Vite) and uploads the worker + static assets. URL is printed at the end (e.g. `https://gha-management.<account>.workers.dev`).

---

## Subsequent deploys

```powershell
npm run deploy
```

If schema changes:

```powershell
# 1. Edit prisma/schema.prisma
# 2. Create the next migration SQL by hand or with `prisma migrate diff`:
npx prisma migrate diff `
  --from-schema-datasource prisma/schema.prisma `
  --to-schema-datamodel prisma/schema.prisma `
  --script > migrations/000X_change.sql
# 3. Apply
npm run db:migrate:remote
```

---

## Production hardening checklist (not done yet)

These are mock implementations from the AI-Studio scaffold. Replace before serving real users:

- [ ] Replace plaintext password column with bcrypt/argon2 hashes.
- [ ] Replace `mock-jwt-token-for-…` strings with real signed JWTs (use `jose` on Workers).
- [ ] Enforce `tenantId` from a verified JWT claim, not a substring match on the Bearer token.
- [ ] Store WhatsApp tokens encrypted, or move to per-tenant Worker secrets.
- [ ] Add rate limiting (`@hono/cloudflare-rate-limiter` or Workers Rate Limiting API) on `/api/auth/*` and `/api/marketing/whatsapp-send`.

---

## File map

| Path | Purpose |
|---|---|
| [src/worker.ts](src/worker.ts) | Cloudflare Worker entry — routes `/api/*` to Hono, everything else to ASSETS |
| [src/server.ts](src/server.ts) | Hono router + all API handlers |
| [src/db/prisma.ts](src/db/prisma.ts) | D1 PrismaClient factory + row types |
| [src/services/](src/services/) | AI forecast, WhatsApp delivery, reports/CSV |
| [src/components/](src/components/) | React views (frontend) |
| [migrations/](migrations/) | D1 SQL migrations + seed |
| [wrangler.jsonc](wrangler.jsonc) | Worker + D1 + Assets bindings |
