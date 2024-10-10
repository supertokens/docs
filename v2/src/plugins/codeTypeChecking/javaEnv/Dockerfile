FROM maven:3.8.4-openjdk-11

WORKDIR /app

COPY validate-java.sh .
COPY snippets/ ./snippets

RUN chmod +x validate-java.sh

ENTRYPOINT ["./validate-java.sh"]
