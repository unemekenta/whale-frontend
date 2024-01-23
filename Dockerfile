FROM node:21-alpine

ENV LANG=C.UTF-8 TZ=Asia/Tokyo

RUN apk update && \
    apk upgrade

WORKDIR /nuxt-frontend

COPY package.json /nuxt-frontend/

RUN yarn install --frozen-lockfile --production && \
    yarn cache clean

COPY . /nuxt-frontend
