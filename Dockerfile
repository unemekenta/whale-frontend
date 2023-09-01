FROM node:18

RUN apt-get update && apt-get install -y
RUN npm install -g yarn
RUN mkdir /nuxt-frontend
WORKDIR /nuxt-frontend
COPY package.json /nuxt-frontend/package.json
COPY package-lock.json /nuxt-frontend/package-lock.json

COPY . /nuxt-frontend

RUN yarn install
