# FROM gradle:jdk16
FROM rishabhpoddar/supertokens_docs_building_with_android:latest

WORKDIR /app

COPY . .

COPY snippets/* ./app/src/main/java/com/example/myapplication

RUN ./gradlew build
