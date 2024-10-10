#!/bin/bash

cd "snippets"

mvn compile

if [ $? -eq 0 ]; then
	echo "Java code is valid"
	exit 0
else
	echo "Java code is invalid"
	exit 1
fi
