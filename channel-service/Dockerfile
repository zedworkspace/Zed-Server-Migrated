FROM node:20-alpine as base

WORKDIR /usr/src/app

COPY package*.json ./

EXPOSE 5004


FROM base as development

RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm install

COPY . .

CMD ["npm", "run", "dev"]

# ----- Stage 1: Build -----
FROM base as build

COPY package*.json ./
RUN npm ci --only=development

COPY . .

RUN npm run build

# ----- Stage 2: Production -----
FROM base AS production

RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm ci --only=production

COPY package*.json ./

COPY --from=build /usr/src/app/dist ./dist


CMD ["npm", "start"]

