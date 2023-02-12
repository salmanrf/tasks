FROM node:lts-alpine3.16

WORKDIR /home/app

COPY . .

RUN yarn add -D typescript nodemon ts-node

RUN yarn