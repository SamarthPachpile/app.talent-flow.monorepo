FROM node:22-alpine AS builder

WORKDIR /app

# Copy root manifest and workspace manifests for caching
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

# Copy package source code
COPY packages/schema-types ./packages/schema-types
COPY packages/utilities ./packages/utilities
COPY packages/api ./packages/api

# Build dependencies and API
RUN npm run build --workspace=@talent-flow/schema-types && \
    npm run build --workspace=@talent-flow/utilities && \
    npm run build --workspace=@talent-flow/api

# Runner Stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0

COPY --from=builder /app/package.json /app/package-lock.json /app/tsconfig.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/schema-types ./packages/schema-types
COPY --from=builder /app/packages/utilities ./packages/utilities
COPY --from=builder /app/packages/api ./packages/api

EXPOSE 5000

CMD ["npm", "run", "start", "--workspace=@talent-flow/api"]
