FROM node:12.19.0-alpine3.10

WORKDIR /usr/src/app
COPY FrontInstagramLike/ .
RUN npm install && npm run build
