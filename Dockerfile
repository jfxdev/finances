FROM node:24-alpine AS build
RUN npm install --global pnpm@11.19.0
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile && pnpm build
RUN pnpm --filter @finances/api deploy --legacy --prod /out/api
RUN pnpm --filter @finances/mcp deploy --legacy --prod /out/mcp

FROM node:24-alpine AS runtime
ENV NODE_ENV=production PORT=3000 WEB_ROOT=/app/web MIGRATIONS_DIR=/app/migrations
WORKDIR /app
COPY --from=build --chown=node:node /out/api/node_modules ./node_modules
COPY --from=build --chown=node:node /app/apps/api/dist ./dist
COPY --from=build --chown=node:node /app/apps/api/migrations ./migrations
COPY --from=build --chown=node:node /app/apps/web/dist ./web
COPY --from=build --chown=node:node /app/apps/mcp/dist /app/mcp/dist
COPY --from=build --chown=node:node /out/mcp/node_modules /app/mcp/node_modules
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
