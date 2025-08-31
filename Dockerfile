# بدل 18-alpine بـ 20-alpine
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies (python, make, g++, etc.)
RUN apk add --no-cache python3 make g++ 

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci && npm cache clean --force

COPY src/ ./src/

RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --chown=nestjs:nodejs package*.json ./

USER nestjs

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main"]
