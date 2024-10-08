FROM maven:3.8.4-openjdk-11

WORKDIR /app

COPY validate-file.sh .
COPY snippets/ ./snippets
COPY pom.xml ./snippets/pom.xml

RUN chmod +x validate-java.sh

ENTRYPOINT ["./validate-java.sh"]
