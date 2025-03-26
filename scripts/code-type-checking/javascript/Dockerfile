FROM node:18-alpine

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install 

COPY . .

RUN bun run test

