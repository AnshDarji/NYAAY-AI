# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
# Optional: Set env vars for build time if necessary
RUN npm run build

# Serve Stage
FROM nginx:alpine

# Copy custom nginx config if we want to override default, but we'll use docker-compose to handle proxying.
# Alternatively, copy standard single-page app nginx config.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to nginx public directory
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
