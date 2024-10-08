#!/bin/bash

docker build -t supertokens/php-env-type-checking .
docker run supertokens/php-env-type-checking
