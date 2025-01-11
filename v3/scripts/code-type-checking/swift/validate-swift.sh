#!/bin/bash

tmp_dir="temp-validation"
snippets_dir="./snippets"

mkdir -p $tmp_dir

find $snippets_dir -name "*.swift" | while read file; do
	# validate_swift_file "$file"
	cp -f "$file" $tmp_dir/main.swift
	if swift build; then
		echo "Syntax is valid for $file."
	else
		echo "Syntax check failed for $file. The code is invalid."
		exit 1
	fi

done

if [ $? -ne 0 ]; then
	echo "Validation failed. One or more files contain syntax errors."
	exit 1
else
	echo "All files are valid."
fi
