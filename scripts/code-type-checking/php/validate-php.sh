#!/bin/bash

set -euo pipefail

mapfile -d '' snippets < <(find ./snippets -type f -name '*.php' -print0 | sort -z)
if [ "${#snippets[@]}" -eq 0 ]; then
  echo "No PHP snippets found" >&2
  exit 1
fi

for file in "${snippets[@]}"; do
  echo "Checking syntax for $file"
  php -l "$file"
done
