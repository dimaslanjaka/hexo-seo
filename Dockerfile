# syntax=docker/dockerfile:1.7-labs





FROM node:12 AS node12
WORKDIR /workspace
RUN apt-get update -y && apt-get install -y build-essential libssl-dev libcurl4-openssl-dev
COPY package.json ./
RUN npm install -g npm && npm install
CMD ["sh", "-c", "npm run build && mkdir -p tmp/logs && npm test > tmp/logs/node-12.test.log 2>&1"]





FROM node:14 AS node14
WORKDIR /workspace
RUN apt-get update -y && apt-get install -y build-essential libssl-dev libcurl4-openssl-dev
COPY package.json ./
RUN npm install -g npm && npm install
CMD ["sh", "-c", "npm run build && mkdir -p tmp/logs && npm test > tmp/logs/node-14.test.log 2>&1"]





FROM node:16 AS node16
WORKDIR /workspace
RUN apt-get update -y && apt-get install -y build-essential libssl-dev libcurl4-openssl-dev
COPY package.json ./
RUN npm install -g npm && npm install
CMD ["sh", "-c", "npm run build && mkdir -p tmp/logs && npm test > tmp/logs/node-16.test.log 2>&1"]




FROM node:18 AS node18
WORKDIR /workspace
RUN apt-get update -y && apt-get install -y build-essential libssl-dev libcurl4-openssl-dev
COPY package.json ./
RUN curl -L -o .yarnrc.yml https://raw.githubusercontent.com/dimaslanjaka/nodejs-package-types/refs/heads/main/.yarnrc-template.yml
RUN corepack enable && corepack prepare yarn@stable --activate
RUN touch yarn.lock && yarn install
CMD ["sh", "-c", "yarn run build && mkdir -p tmp/logs && yarn test > tmp/logs/node-18.test.log 2>&1"]




FROM node:20 AS node20
WORKDIR /workspace
RUN apt-get update -y && apt-get install -y build-essential libssl-dev libcurl4-openssl-dev
COPY package.json ./
RUN curl -L -o .yarnrc.yml https://raw.githubusercontent.com/dimaslanjaka/nodejs-package-types/refs/heads/main/.yarnrc-template.yml
RUN corepack enable && corepack prepare yarn@stable --activate
RUN touch yarn.lock && yarn install
CMD ["sh", "-c", "yarn run build && mkdir -p tmp/logs && yarn test > tmp/logs/node-20.test.log 2>&1"]




FROM node:22 AS node22
WORKDIR /workspace
RUN apt-get update -y && apt-get install -y build-essential libssl-dev libcurl4-openssl-dev
COPY package.json ./
RUN curl -L -o .yarnrc.yml https://raw.githubusercontent.com/dimaslanjaka/nodejs-package-types/refs/heads/main/.yarnrc-template.yml
RUN corepack enable && corepack prepare yarn@stable --activate
RUN touch yarn.lock && yarn install
CMD ["sh", "-c", "yarn run build && mkdir -p tmp/logs && yarn test > tmp/logs/node-22.test.log 2>&1"]
