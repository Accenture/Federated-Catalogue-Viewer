FROM node:18 as build-deps

RUN corepack enable
RUN corepack prepare yarn@stable --activate

WORKDIR /usr/src/app
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install

COPY . ./
RUN yarn build

FROM bitnami/nginx:1.22.1
COPY default.conf /opt/bitnami/nginx/conf/server_blocks/my_server_block.conf
COPY --from=build-deps /usr/src/app/dist/federated-catalog-viewer-ui /app
