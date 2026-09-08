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
# Seed-committed images live in a separate, never-volume-mounted path so they
# survive rebuilds; the persistent volume at ./static is for admin uploads.
# The startup command below copies any new seed images in on every boot
# without ever overwriting a file an admin has already uploaded.
COPY --from=build --chown=node:node /app/apps/backend/static /app/seed-static
ENV NODE_ENV=production
USER node
EXPOSE 9000
CMD ["sh", "-c", "cp -rn /app/seed-static/. /app/apps/backend/.medusa/server/static/ && node /app/apps/backend/node_modules/@medusajs/cli/cli.js db:migrate && node /app/apps/backend/node_modules/@medusajs/cli/cli.js start"]
