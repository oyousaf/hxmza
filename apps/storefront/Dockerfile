FROM node:22-bookworm-slim AS build
RUN corepack enable && corepack prepare pnpm@10.11.1 --activate
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_STRIPE_KEY
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL NEXT_PUBLIC_STRIPE_KEY=$NEXT_PUBLIC_STRIPE_KEY NEXT_PUBLIC_DEFAULT_REGION=gb NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @dtc/storefront build

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production PORT=8000 HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/apps/storefront/.next/standalone ./
COPY --from=build --chown=node:node /app/apps/storefront/.next/static ./apps/storefront/.next/static
COPY --from=build --chown=node:node /app/apps/storefront/public ./apps/storefront/public
USER node
EXPOSE 8000
CMD ["node", "apps/storefront/server.js"]
