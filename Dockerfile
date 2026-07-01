FROM node:22-slim AS deps

WORKDIR /app
ENV NODE_ENV=development

COPY package.json package-lock.json ./
COPY apps/next-demo/package.json apps/next-demo/package.json
COPY packages/a2ui-core/package.json packages/a2ui-core/package.json
COPY packages/a2ui-react/package.json packages/a2ui-react/package.json
RUN npm ci

FROM node:22-slim AS build

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build:next

FROM node:22-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/next-demo ./apps/next-demo
COPY --from=build /app/packages ./packages

EXPOSE 3000
CMD ["npm", "--workspace", "@agennext/a2ui-next-demo", "run", "start"]
