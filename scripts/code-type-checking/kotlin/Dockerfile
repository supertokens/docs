# FROM gradle:jdk16
FROM rishabhpoddar/supertokens_docs_building_with_android:latest

WORKDIR /app

COPY . .

RUN sh ./validate-kotlin.sh
