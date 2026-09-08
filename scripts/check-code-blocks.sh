#!/bin/sh

set -eu

if [ -z "${1:-}" ]; then
	echo "Please provide a language argument" >&2
	exit 1
fi

cd ./scripts/code-type-checking/"$1"
docker build -t code-check-"$1" .
