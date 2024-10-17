FROM --platform=$BUILDPLATFORM node:18 AS build-deps

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

FROM bitnami/openresty:1.25.3-2
RUN mv /opt/bitnami/openresty/nginx/conf/nginx.conf /opt/bitnami/openresty/nginx/conf/original-nginx.conf
COPY nginx.conf /opt/bitnami/openresty/nginx/conf/
COPY nginx-server-block.conf /opt/bitnami/openresty/nginx/conf/server_blocks/
COPY --from=build-deps /usr/src/app/dist/federated-catalog-viewer-ui /app
