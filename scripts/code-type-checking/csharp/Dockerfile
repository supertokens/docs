FROM mcr.microsoft.com/dotnet/sdk:6.0

WORKDIR /app

COPY validate-csharp.sh .
COPY snippets ./snippets
COPY main.cs ./snippets/
COPY snippets.csproj ./snippets/

RUN chmod +x validate-csharp.sh

RUN ./validate-csharp.sh
