# Build with Bun
FROM --platform=$BUILDPLATFORM docker.io/oven/bun:latest AS build

ARG RELEASE_BRANCH
ARG RELEASE_DATE
ARG RELEASE_COMMIT

ENV NODE_ENV="production"

WORKDIR /app

COPY package*.json bun.lock ./

RUN bun install

COPY .env.development .
COPY --chmod=775 scripts/ ./

RUN set -a && . ./.env.development && set +a && \
    ./docker-envs.ts .env.production && \
    ./nginx-entrypoint.ts && \
    rm .env.development

ENV VITE_RELEASE_BRANCH=${RELEASE_BRANCH}
ENV VITE_RELEASE_DATE=${RELEASE_DATE}
ENV VITE_RELEASE_COMMIT=${RELEASE_COMMIT}

COPY eslint.config.js index.html tsconfig*.json vite.config.ts ./

COPY . .

RUN bun run build

# Serve with NGINX
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/app.conf /etc/nginx/conf.d
COPY nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build --chmod=777 --link /app/entrypoint.sh /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]