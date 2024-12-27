#!/bin/bash

cd "snippets"

dotnet build

if [ $? -eq 0 ]; then
	echo "C# code is valid"
	exit 0
else
	echo "C# code is invalid"
	exit 1
fi
