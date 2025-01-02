FROM gradle:8.12-alpine

WORKDIR /app

RUN apk add --no-cache \
  git \
  bash
COPY build.gradle gradle.properties gradlew gradlew.bat settings.gradle ./
COPY app ./app
COPY gradle ./gradle

# RUN gradle wrapper --validate

RUN gradle dependencies

CMD ["./gradlew", "build"]
