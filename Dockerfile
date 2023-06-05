FROM node:18-alpine



RUN npm install -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ENV ATLAS_MONGODB=${ATLAS_MONGODB}

RUN echo ${ATLAS_MONGODB}

RUN pnpm check
RUN pnpm build

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "build"]

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