# syntax=docker/dockerfile:1

# ---------- Shared base ----------
FROM node:22-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# ---------- deps: install dependencies ----------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---------- builder: generate client, push schema, seed, build standalone ----------
FROM base AS builder
# Build-time throwaway DB (with schema + seed data) so `use cache` scopes
# can be prerendered during `next build`. Runtime data comes from the volume.
ENV DATABASE_URL="file:/app/prisma/build.db" \
    NEXT_OUTPUT_STANDALONE="true"
COPY --from=deps /app/node_modules ./node_modules
COPY prisma7.config.ts tsconfig.json next-env.d.ts package.json ./
COPY prisma ./prisma
COPY src ./src
COPY public ./public
RUN npx prisma generate \
    && npx prisma db push \
    && npx tsx prisma/seed.ts \
    && npm run build

# ---------- migrator: prisma CLI for schema push / seed (compose service) ----------
FROM base AS migrator
COPY --from=deps /app/node_modules ./node_modules
COPY prisma7.config.ts package.json ./
COPY prisma ./prisma
COPY src/generated ./src/generated
CMD ["npx", "prisma", "db", "push"]

# ---------- runner: minimal standalone production image ----------
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# Mount points for persistent data (bind-mounted in docker-compose.yml)
RUN mkdir -p /app/prisma /app/public/uploads
EXPOSE 3000
# NOTE: runs as root on purpose so bind mounts work on any host UID/GID.
CMD ["node", "server.js"]
