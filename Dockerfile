FROM node:18-alpine as base
RUN npm install -g pnpm
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .

FROM base as DEVELOPMENT
RUN pnpm install --frozen-lockfile
ENTRYPOINT [ "pnpm", "dev" ]

FROM base as PRODUCTION
COPY app/ ./
RUN pnpm install --frozen-lockfile
RUN pnpm check
RUN pnpm build
EXPOSE 3000
ENV NODE_ENV=production
ENTRYPOINT [ "pnpm", "serve" ]
# CMD ["node", "-r", "dotenv/config", "build"]

# FROM node:18-alpine AS builder
# WORKDIR /app
# COPY package*.json .
# RUN npm ci
# COPY . .
# RUN npm run build
# RUN npm prune --production

# FROM node:18-alpine
# WORKDIR /app
# COPY --from=builder /app/build build/
# COPY --from=builder /app/node_modules node_modules/
# COPY package.json .
# EXPOSE 3000
# CMD [ "node", "build" ]