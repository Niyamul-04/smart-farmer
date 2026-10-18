# Multi-stage Dockerfile for Abhawa Bondhu (Google Cloud Run / Container Deployment)
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies for both server and client
RUN npm run install:all

# Copy all source files
COPY . .

# Build client React application
RUN npm run build --prefix client

# Build server TypeScript files
RUN npm run build --prefix server

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package.json ./
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Copy compiled backend & built client frontend
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist

# Expose standard Cloud Run port
EXPOSE 8080

CMD ["node", "server/dist/index.js"]
