# ---------- Build Stage ----------
FROM node:18-alpine AS builder

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@8.15.9 --activate

WORKDIR /app

# Copy only lock & package files first (better caching)
COPY package.json pnpm-lock.yaml nx.json tsconfig.base.json ./

# Copy workspace files
COPY apps ./apps
COPY libs ./libs

# Install deps
RUN pnpm install --frozen-lockfile

# Build frontend app
RUN pnpm nx build form-builder

# ---------- Runtime Stage ----------
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Add custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=builder /app/dist/apps/form-builder /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
