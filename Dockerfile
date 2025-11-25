# --- Base image ---
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# --- Dependencies layer ---
FROM base AS deps
# For some native modules / OpenSSL / etc.
RUN apk add --no-cache libc6-compat

# Copy only lockfile + package.json for faster caching
COPY package.json ./
# If you use package-lock.json, copy it; comment this out if you use pnpm/yarn
COPY package-lock.json* ./

# Install dependencies
RUN npm ci

# --- Build layer ---
FROM base AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Build the Next.js app
RUN npm run build

# --- Runtime layer ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy necessary build artifacts from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# If you have next.config.mjs / tsconfig.json etc. and need them at runtime, copy too:
# COPY --from=builder /app/next.config.mjs ./next.config.mjs

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]
