FROM oven/bun:alpine

RUN apk add --no-cache \
  python3 \
  py3-pip \
  go 

WORKDIR /app

RUN bun install -g prettier
RUN pip install black --break-system-packages

CMD ["sh", "-c", "while true; do echo Waiting for snippets...; sleep 3600; done"]
