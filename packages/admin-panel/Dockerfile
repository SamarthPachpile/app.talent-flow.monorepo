FROM node:22-alpine AS builder

WORKDIR /app

# Copy manifests for caching
COPY package.json package-lock.json tsconfig.json ./
COPY packages/schema-types/package.json ./packages/schema-types/
COPY packages/utilities/package.json ./packages/utilities/
COPY packages/api/package.json ./packages/api/
COPY packages/admin-panel/package.json ./packages/admin-panel/
COPY packages/candidate-portal/package.json ./packages/candidate-portal/
COPY packages/company-portal/package.json ./packages/company-portal/
COPY packages/graviton-it-solutions/package.json ./packages/graviton-it-solutions/

# Install monorepo dependencies
RUN npm ci

# Copy source files
COPY packages/schema-types ./packages/schema-types
COPY packages/utilities ./packages/utilities
COPY packages/api ./packages/api
COPY packages/candidate-portal ./packages/candidate-portal
COPY packages/company-portal ./packages/company-portal
COPY packages/graviton-it-solutions ./packages/graviton-it-solutions
COPY packages/admin-panel ./packages/admin-panel

# Build shared libraries and admin panel
RUN npm run build --workspace=@talent-flow/schema-types && \
    npm run build --workspace=@talent-flow/utilities && \
    npm run build --workspace=@talent-flow/admin-panel

# Runner Stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV NITRO_PORT=3001
ENV NITRO_HOST=0.0.0.0

COPY --from=builder /app/packages/admin-panel/.output ./.output

EXPOSE 3001

CMD ["node", ".output/server/index.mjs"]
