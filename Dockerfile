FROM node:18 as build-deps

RUN corepack enable
RUN corepack prepare yarn@3.8.1 --activate

WORKDIR /usr/src/app
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install

COPY . ./
RUN yarn build

FROM bitnami/openresty:1.25.3-1
RUN mv /opt/bitnami/openresty/nginx/conf/nginx.conf /opt/bitnami/openresty/nginx/conf/original-nginx.conf
COPY nginx.conf /opt/bitnami/openresty/nginx/conf/
COPY nginx-server-block.conf /opt/bitnami/openresty/nginx/conf/server_blocks/
COPY --from=build-deps /usr/src/app/dist/federated-catalog-viewer-ui /app
