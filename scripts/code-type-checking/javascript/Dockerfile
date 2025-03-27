FROM oven/bun:slim 

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install 

COPY . .

RUN bun run test

