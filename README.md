# Guesthouse Management Portal

Multi-tenant guesthouse management SaaS: AI occupancy analytics, WhatsApp marketing automation, CSV imports, super-admin oversight.

**Stack:** React 19 + Vite (SPA) · Hono on Cloudflare Workers · Cloudflare D1 (SQLite) via Prisma D1 adapter.

---

## Architecture

```
Browser  ──►  Cloudflare Worker
                │
                ├──  /api/*    →  Hono router (src/app.ts)  →  Prisma + D1
                └──  rest      →  ASSETS binding (dist/client SPA)
```

- Worker entry: [src/worker.ts](src/worker.ts)
- API routes: [src/app.ts](src/app.ts)
- D1 schema: [prisma/schema.prisma](prisma/schema.prisma)
- Migrations: [migrations/](migrations/) (raw SQL, applied by `wrangler d1 migrations apply`)

---

## Local development

```powershell
npm install
npm run prisma:generate
npm run db:migrate:local            # apply schema + seed to local D1
```

Run frontend + worker in two terminals:

```powershell
npm run dev:worker                  # wrangler dev on :8787 (Hono + local D1)
npm run dev                         # vite on :5173, proxies /api → :8787
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
| [src/app.ts](src/app.ts) | Hono router + all API handlers |
| [src/db/prisma.ts](src/db/prisma.ts) | D1 PrismaClient factory + row types |
| [src/services/](src/services/) | AI forecast, WhatsApp delivery, reports/CSV |
| [src/components/](src/components/) | React views (frontend) |
| [migrations/](migrations/) | D1 SQL migrations + seed |
| [wrangler.jsonc](wrangler.jsonc) | Worker + D1 + Assets bindings |
