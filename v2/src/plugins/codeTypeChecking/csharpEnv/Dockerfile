FROM mcr.microsoft.com/dotnet/sdk:6.0

WORKDIR /app

COPY validate-csharp.sh .
COPY snippets ./snippets

RUN chmod +x validate-csharp.sh

ENTRYPOINT ["./validate-csharp.sh"]
