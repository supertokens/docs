#!/bin/sh

set -eu

snippets_dir="./snippets"
generated_source_dir="./app/src/main/java/com/example/myapplication/generated-snippet"

cleanup() {
    rm -rf "$generated_source_dir"
}

trap cleanup EXIT
mkdir -p "$generated_source_dir"

echo "Starting compilation of Kotlin snippets..."

snippet_number=0
find "$snippets_dir" -name "*.kt" -print | sort | while IFS= read -r file; do
    if grep -Eq '^import (io\.rownd|io\.flutter|com\.facebook\.react|com\.reactnativerowndplugin)(\.|$)' "$file"; then
        echo "Skipping unsupported external SDK snippet: $file"
        continue
    fi

    echo "Validating file: $file"
    snippet_number=$((snippet_number + 1))
    relative_file=${file#"$snippets_dir"/}
    generated_source="$generated_source_dir/$relative_file"
    mkdir -p "$(dirname "$generated_source")"
    {
        echo "package generated.snippet$snippet_number"
        echo
        cat "$file"
    } > "$generated_source"
done

./gradlew :app:compileDebugKotlin --quiet --no-daemon

echo "All supported Kotlin snippets are valid."
