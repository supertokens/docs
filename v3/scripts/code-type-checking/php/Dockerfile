FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
  libzip-dev \
  unzip \
  && docker-php-ext-install zip

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /app

COPY validate-php.sh .
COPY snippets/ ./snippets

RUN chmod +x validate-php.sh

RUN ./validate-php.sh
