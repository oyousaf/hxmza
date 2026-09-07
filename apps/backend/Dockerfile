FROM node:22-bookworm-slim AS build
RUN corepack enable && corepack prepare pnpm@10.11.1 --activate
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
WORKDIR /app/apps/backend
ARG MEDUSA_PUBLIC_URL
ENV MEDUSA_PUBLIC_URL=$MEDUSA_PUBLIC_URL
ENV MEDUSA_DISABLE_TELEMETRY=true
RUN pnpm build

FROM node:22-bookworm-slim
RUN corepack enable && corepack prepare pnpm@10.11.1 --activate
WORKDIR /app
COPY --from=build --chown=node:node /app /app
WORKDIR /app/apps/backend/.medusa/server
RUN mkdir -p static && chown node:node static
COPY --from=build --chown=node:node /app/apps/backend/static ./static
ENV NODE_ENV=production
USER node
EXPOSE 9000
CMD ["sh", "-c", "node /app/apps/backend/node_modules/@medusajs/cli/cli.js db:migrate && node /app/apps/backend/node_modules/@medusajs/cli/cli.js start"]
