FROM php:8.2-cli

WORKDIR /app

COPY validate-php.sh .
COPY snippets/ ./snippets

RUN chmod +x validate-php.sh

RUN ./validate-php.sh
