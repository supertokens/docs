#!/bin/bash

samples_dir="./snippets"

cd $samples_dir

composer install

validate_php_file() {
	file=$1
	echo "Checking syntax for $file..."
	php -l $file
	if [ $? -ne 0 ]; then
		echo "Syntax check failed for $file. The PHP code is invalid."
		return 1
	fi
	echo "Syntax is valid for $file."
	return 0
}

find . -name "*.php" | while read file; do
	validate_php_file "$file"
	if [ $? -ne 0 ]; then
		exit 1
	fi
done

if [ $? -ne 0 ]; then
	echo "Validation failed. One or more PHP files contain syntax errors."
	exit 1
fi
