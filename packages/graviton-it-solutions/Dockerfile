FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL

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
COPY packages/admin-panel ./packages/admin-panel
COPY packages/candidate-portal ./packages/candidate-portal
COPY packages/company-portal ./packages/company-portal
COPY packages/graviton-it-solutions ./packages/graviton-it-solutions

# Build shared libraries and graviton solutions
RUN npm run build --workspace=@talent-flow/schema-types && \
    npm run build --workspace=@talent-flow/utilities && \
    npm run build --workspace=@talent-flow/graviton-it-solutions

# Production Stage with Nginx
FROM nginx:alpine AS runner

COPY --from=builder /app/packages/graviton-it-solutions/dist /usr/share/nginx/html
COPY packages/graviton-it-solutions/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
