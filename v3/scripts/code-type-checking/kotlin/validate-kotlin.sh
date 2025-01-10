#!/bin/sh

snippets_dir="./snippets"
project_dir="src/main/kotlin"
output_dir="./out"

DEPENDENCIES="\
    org.jetbrains.kotlin:kotlin-stdlib:1.9.0 \
    com.supertokens:supertokens-android:0.5.3 \
    androidx.core:core-ktx:1.10.1 \
    androidx.appcompat:appcompat:1.6.1"

# Make sure output directory exists
mkdir -p $output_dir

echo "Starting compilation of Kotlin snippets..."

# find . -name "*.kt" | while read file; do
# 	kotlinc "$file" -include-runtime -d "${file%.kt}.jar"
# done

find $snippets_dir -name "*.kt" | while read file; do
	# validate_swift_file "$file"
	# cp -f "$file" $project_dir/Main.kt
	echo "Validating file: $file"

	kotlinc -cp $(echo $DEPENDENCIES | sed 's/ /:/g') \
		-d $output_dir \
		$file

	if [ $? -eq 0 ]; then
		echo "Syntax is valid for $file."
		./gradlew clean --quiet
	else
		echo "Syntax check failed for $file. The Kotlin code is invalid."
		exit 1
	fi
done

if [ $? -ne 0 ]; then
	echo "Validation failed. One or more files contain syntax errors."
	exit 1
else
	echo "All files are valid."
fi
