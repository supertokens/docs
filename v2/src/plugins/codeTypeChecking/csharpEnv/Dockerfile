FROM mcr.microsoft.com/dotnet/sdk:6.0

WORKDIR /app

COPY validate-file.sh .
COPY snippets ./snippets
COPY snippets.csproj ./snippets/snippets.csproj

RUN chmod +x validate-csharp.sh

ENTRYPOINT ["./validate-csharp.sh"]
