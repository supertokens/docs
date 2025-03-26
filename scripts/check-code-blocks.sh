#!/bin/sh

if [ -z "$1" ]; then
	echo "Please provide a language argument"
	exit 1
fi

cd ./scripts/code-type-checking/"$1" && docker build -t code-check-"$1" .
docker run code-check-"$1"
echo $?
