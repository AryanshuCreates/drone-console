# ---- base ----
FROM node:20-alpine AS base
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# ---- deps-dev: install dev + prod for build ----
FROM base AS deps-dev
RUN apk add --no-cache libc6-compat python3 make g++
COPY package.json package-lock.json* ./
ENV NODE_ENV=development
RUN npm ci --include=dev

# ---- deps: install only production deps for runtime ----
FROM base AS deps
COPY package.json package-lock.json* ./
ENV NODE_ENV=production
RUN npm ci --omit=dev

# ---- builder ----
FROM base AS builder
WORKDIR /app
COPY --from=deps-dev /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=development
RUN npm run build

# ---- runner (production) ----
FROM node:20-alpine AS runner
WORKDIR /app
# create non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# copy prod node_modules and built files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
USER nextjs
CMD ["npm", "run", "start"]
