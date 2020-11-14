FROM node:12.19.0-alpine3.10 as ng_builder

WORKDIR /usr/src/app
COPY FrontInstagramLike/ .
RUN npm install && npm run build

FROM nginx:1.19.0-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d
COPY --from=ng_builder /usr/src/app/dist/FrontInstagramLike/ /usr/src/app/
