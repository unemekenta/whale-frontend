ARG GITHUB_USERNAME

FROM ghcr.io/${GITHUB_USERNAME}/whale-frontend:latest

ENV LANG=C.UTF-8 TZ=Asia/Tokyo

RUN apk update && \
    apk upgrade

WORKDIR /nuxt-frontend

COPY package.json /nuxt-frontend/package.json
COPY package-lock.json /nuxt-frontend/package-lock.json
COPY yarn.lock /nuxt-frontend/yarn.lock

RUN yarn install --frozen-lockfile

COPY . /nuxt-frontend
