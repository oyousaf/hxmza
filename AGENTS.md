# Beds4u agent guide

## Decisions
- Start fresh; no previous scaffold is required. Build a bed-factory ecommerce application.
- Next.js App Router, React, TypeScript, Tailwind CSS and shadcn/ui storefront; Medusa v2 backend/admin.
- Grey/silver ottoman upholstery and traditional oak visual direction; UK currency and delivery.
- VPS hosts storefront, backend/admin, PostgreSQL, Redis and persistent local product media using Docker Compose. No BaaS.
- Stripe through Medusa supported provider, test mode first. Medusa authentication with server-managed HttpOnly browser cookies.
- Support variants, basket, checkout, customer accounts and order management; allow future bed configuration, postcode delivery and factory lead times.
- Validate locally and prepare deployment only. Do not deploy without a new instruction.

## Working rules
- Read this guide before editing. Inspect mapped files and targeted searches instead of repeated repository scans.
- Keep this guide updated after meaningful changes. Never record secret values.

## Directory map (planned)
- apps/storefront: Next.js storefront, components, server actions and Medusa API integration.
- apps/backend: Medusa configuration, seed data and commerce extensions.
- compose.yaml: VPS service definitions and persistent volumes.
- .env.example: deployment environment variable names.
- README.md: development, verification and VPS setup.

## Commands and status
- Available: Node 22.21.0, npm 11.7.0, Docker CLI 29.6.2.
- Implementation starting. Dependency versions and project commands are being verified.
- Next: verify stable compatible dependencies, scaffold services, implement storefront, validate builds and document deployment.

## Implementation update
- Official medusajs/dtc-starter baseline: Medusa 2.20.1, Next 15.5.21, React 19.0.5, Tailwind 3; pnpm 10.11.1 lockfile.
- Commerce routes imported and Beds4u branding applied. shadcn Button at apps/storefront/src/components/ui/button.tsx.
- Explicit sample seed: apps/backend/src/scripts/seed.ts; automatic apparel seeding disabled.
- Cookie handling: apps/storefront/src/lib/data/cookies.ts; JWT SDK storage disabled.
- Deployment files now exist: compose.yaml, compose.dev.yaml, deploy/Caddyfile, app Dockerfiles and .env.example files.
- Local isolated PostgreSQL cluster at .local/postgres on port 5433; existing PostgreSQL service untouched.
- Storefront TypeScript check, backend build, storefront production build, migrations and bed catalogue seed all pass. Redis is optional locally (unset REDIS_URL falls back to in-memory event bus/locking/caching).
- Full commerce flow verified end-to-end via scripts/smoke-commerce.mjs against local backend (:9000) + storefront (:8000): GBP catalogue (13 products x 3 variants = 39 variants), customer registration/login, basket quantity updates, delivery, manual test checkout, order history, unauthorized account rejection. Stripe is separately verified manually via the storefront checkout (test card 4242..., order captured in admin) — the region has both `pp_stripe_stripe` and `pp_system_default` enabled so the automated smoke test and real Stripe checkout coexist.
- Both compose.yaml and compose.dev.yaml validate with `docker compose ... config` once required VPS env vars are supplied (they fail closed by design when unset, per the `:?` guards).
- README.md added documenting local dev, verification commands and VPS deployment steps.
- Local admin user created for o_yousaf@live.co.uk; Stripe test keys wired into apps/backend/.env (STRIPE_API_KEY) and apps/storefront/.env.local (NEXT_PUBLIC_STRIPE_KEY) — dev-only test values, never committed.

## Storefront redesign (2026 pass)
- Theme: next-themes wired in apps/storefront/src/app/layout.tsx (`attribute="class"`, `defaultTheme="system"`, `enableSystem`) — auto-detects OS theme, manual override via ThemeToggle in Nav persists to localStorage. `@medusajs/ui-preset` already ships a full dark token set gated on `darkMode:"class"`, so most components (Nav, buttons, product cards, borders) theme automatically; Hero got explicit `dark:` variants, Footer is deliberately kept permanently dark in both modes (intentional design choice). Swept all raw `bg-white`/`text-black` literals across checkout/cart/account to token classes (`bg-ui-bg-base`/`text-ui-fg-base`) so those flows don't break in dark mode.
- Typography: Fraunces (display/headings) + Inter (body) loaded via `next/font/google` in layout.tsx, wired into tailwind.config.js `fontFamily`. Previously no font was actually loaded at all (silent system-font fallback).
- Motion: `motion` package (current name for Framer Motion) added, scoped to Hero entrance, ProductPreview card hover-lift/scroll-reveal (`motion-card.tsx`), and the ThemeToggle icon swap — all respect `prefers-reduced-motion`.
- Explicitly did NOT migrate to Tailwind v4: `@medusajs/ui-preset` is not yet compatible with it (open upstream bugs), and nearly every page depends on preset classes — stayed on v3 by design.
- Catalogue expanded from 3 to 13 products across 5 collections (ottoman beds, traditional oak, upholstered sleigh beds, divan beds, metal frame beds) in apps/backend/src/scripts/seed.ts. Seed script rewritten for real idempotency: infra (store/region/shipping/etc.) only created once, collections/products looked up and matched by handle (not array index) so re-running only adds genuinely new items.
- Found and fixed a pre-existing data bug while doing this: Medusa's own framework bootstrap creates a "Medusa Store" + default sales channel before any seed runs, so a second sales channel also named "Default Sales Channel" already existed — the naive idempotency query matched the wrong one and misassigned 10 new products to it. Fixed by looking up the sales channel via the "Beds4u" store's `default_sales_channel_id` instead of by name, and repaired the already-misassigned rows directly in the dev DB.
- Real photography: all 14 images (hero + 13 products) sourced from Unsplash/Pexels (free commercial-use license, no attribution required) and downloaded to apps/backend/static/{handle}.jpg and apps/storefront/public/beds/hero.jpg, replacing the old flat SVG illustrations — matches the project's own architecture decision that product media must be persisted locally, not hotlinked. One weak match: brushed-brass-frame.jpg is an ornate/antique gold headboard (no clean modern brushed-brass stock photo was findable on either free library) — worth a manual swap if the ornate look doesn't fit.
- Copy rewritten in elevated UK English across Hero, homepage/product metadata, Footer, and seed.ts collection descriptions (one literary allusion — Shakespeare on sleep — reserved for the Hero only, per design).
- scripts/smoke-commerce.mjs updated for the new catalogue size (13 products / 39 variants).
- Not yet done: real VPS deployment (not to be done without explicit instruction); the brushed-brass product photo may want a manual re-source; no deeper shadcn migration or page-transition motion was attempted (out of scope for this pass).

## UK-only routing (no visible /gb prefix)
- Beds4u ships to the UK only, so the visible `/gb` URL prefix and the nav's shipping-region switcher were removed. The underlying Medusa v2 storefront route tree (`src/app/[countryCode]/...`) is unchanged — apps/storefront/src/middleware.ts now unconditionally rewrites every incoming request to `/gb${path}` (via `NextResponse.rewrite`, not `redirect`), so Next resolves pages against the existing `[countryCode]` segment internally while the browser only ever sees clean paths (`/store`, `/cart`, `/products/x`, etc.). The `_medusa_cache_id` per-visitor cache-tag cookie is preserved in the same middleware pass.
- `LocalizedClientLink` (apps/storefront/src/modules/common/components/localized-client-link) no longer prepends the country code to hrefs — it just passes `href` straight to `next/link`. Server-side redirects that used to build `/${countryCode}/...` paths (order confirmation in lib/data/cart.ts, signout in lib/data/customer.ts, apps/storefront/src/app/api/payment-return/route.ts) were simplified to plain paths for the same reason.
- Removed apps/storefront/src/modules/layout/components/country-select entirely (the nav "ship to" switcher) along with the now-dead `updateRegion` server action in lib/data/cart.ts — do not confuse this with the *different*, still-in-use `checkout/components/country-select`, which is the country field on address forms and was left untouched.
- `useParams()`/`usePathname()` inside client components (account-nav, payment-button, etc.) still resolve `countryCode` to `"gb"` correctly after the rewrite — Next's client router state reflects the rewritten route, not the literal browser URL — so those were left alone.
- Verified: clean paths (`/`, `/store`, `/products/silver-ottoman`, `/cart`, `/checkout` with a cart cookie, `/account`) all return 200 with no redirect; the old `/gb/store`-style path now 404s since it's no longer a real, separately-reachable route from the browser's perspective.
