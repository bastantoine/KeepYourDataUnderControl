FROM node:12.19.0-alpine3.10 as ng_builder

# Install node modules first, without copying all files
# This allow to cache the install step
COPY FrontInstagramLike/package.json /tmp/
RUN cd /tmp && npm install

WORKDIR /usr/src/app
RUN cp -a /tmp/node_modules .
COPY FrontInstagramLike/ .
RUN npm run build-prod

FROM nginx:1.19.0-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d
COPY --from=ng_builder /usr/src/app/dist/FrontInstagramLike/ /usr/src/app/
