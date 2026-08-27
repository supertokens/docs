#!/bin/bash

set -euo pipefail

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
snippets_dir="$script_dir/snippets"
work_dir=$(mktemp -d)
trap 'rm -rf "$work_dir"' EXIT

declare -a snippets=()
if [ -d "$snippets_dir" ]; then
  mapfile -d '' snippets < <(find "$snippets_dir" -type f -name '*.java' -print0 | sort -z)
fi

if [ "${#snippets[@]}" -eq 0 ]; then
  echo "No Java snippets found" >&2
  exit 1
fi

status=0
for snippet in "${snippets[@]}"; do
  project_dir=$(mktemp -d "$work_dir/snippet.XXXXXX")
  source_dir="$project_dir/src/main/java"
  mkdir -p "$source_dir"
  cp "$script_dir/pom.xml" "$project_dir/pom.xml"

  declaration=$(tr '\n' ' ' < "$snippet" \
    | grep -Eo 'public[[:space:]]+((abstract|final|static|strictfp)[[:space:]]+)*(@interface|class|enum|interface)[[:space:]]+[A-Za-z_$][A-Za-z0-9_$]*' \
    | head -n 1 || true)
  if [ -n "$declaration" ]; then
    source_name=$(printf '%s\n' "$declaration" | grep -Eo '[A-Za-z_$][A-Za-z0-9_$]*$')
  else
    source_name="Snippet"
  fi
  cp "$snippet" "$source_dir/$source_name.java"

  echo "Compiling ${snippet#"$snippets_dir"/}"
  compile_log="$project_dir/compile.log"
  if mvn -q -f "$project_dir/pom.xml" compile > "$compile_log" 2>&1; then
    continue
  fi

  # javac reports the required filename if annotations or unusual formatting
  # prevented the fast declaration match above.
  expected_source=$(sed -nE \
    's/.*should be declared in a file named ([A-Za-z_$][A-Za-z0-9_$]*\.java).*/\1/p' \
    "$compile_log" | head -n 1 || true)
  if [ -n "$expected_source" ] && [ "$expected_source" != "$source_name.java" ]; then
    rm "$source_dir/$source_name.java"
    cp "$snippet" "$source_dir/$expected_source"
    if mvn -q -f "$project_dir/pom.xml" compile > "$compile_log" 2>&1; then
      continue
    fi
  fi

  cat "$compile_log" >&2
  status=1
done

if [ "$status" -ne 0 ]; then
  echo "Java code is invalid" >&2
  exit "$status"
fi

echo "Java code is valid"
