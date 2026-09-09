# Beds4u

Bed-factory ecommerce monorepo: Next.js/Tailwind/shadcn storefront and Medusa v2 backend/admin, with UK (GBP) currency, delivery and Stripe test-mode payments.

## Structure

- `apps/storefront` — Next.js App Router storefront.
- `apps/backend` — Medusa v2 backend/admin, seed data (`src/scripts/seed.ts`), custom `wishlist` module.
- `compose.yaml` / `compose.dev.yaml` — VPS and local Docker service definitions.
- `deploy/Caddyfile` — reverse proxy/TLS for the VPS.
- `scripts/smoke-commerce.mjs` — end-to-end local-only commerce smoke test.

## Local development

Requires Node 22, pnpm 10 (`corepack enable` or `npx pnpm`), and a local PostgreSQL instance.

1. Copy env files and fill in values:
   - `apps/backend/.env` from `apps/backend/.env.example`
   - `apps/storefront/.env.local` from `apps/storefront/.env.example`
2. Install dependencies: `pnpm install`
3. Run backend migrations and seed the bed catalogue:
   ```
   pnpm --filter @dtc/backend exec medusa db:migrate
   pnpm run backend:seed
   ```
4. Start both apps: `pnpm dev` (or `pnpm backend:dev` / `pnpm storefront:dev` separately).
   - Backend/admin: http://localhost:9000 (admin UI at `/app`)
   - Storefront: http://localhost:8000

Redis is optional locally — leaving `REDIS_URL` unset in `apps/backend/.env` makes Medusa fall back to in-memory event bus, locking and caching.

## Verification

- Typecheck: `pnpm typecheck`
- Backend build: `pnpm --filter @dtc/backend build`
- Storefront build: `pnpm --filter @dtc/storefront build`
- Full commerce flow (catalogue, customer auth, basket, delivery, manual test checkout, order history) against a running local backend + storefront:
  ```
  node scripts/smoke-commerce.mjs
  ```
  This only targets `localhost`/`127.0.0.1`, registers a throwaway test customer and leaves a test order in the local database.
- Compose validation (no deployment): `docker compose -f compose.yaml config` and `docker compose -f compose.dev.yaml config`.

Stripe is not covered by the smoke test; verify it manually in the Medusa admin with Stripe test keys. Wishlist add/remove is also not covered by the smoke test; verify manually as a logged-in customer.

## Dependency updates

Audit and fix with the workspace's own package manager, not npm — `npx pnpm audit`, and `npx pnpm audit --fix` to add targeted `pnpm.overrides` entries in the root `package.json` for vulnerable transitive dependencies without bumping the parent packages that pin them. Pushing to Vercel does not fix vulnerabilities on its own; it just builds and deploys whatever is committed to `pnpm-lock.yaml`. After any override change, reinstall (`pnpm install`) and re-run the verification steps above before committing.
