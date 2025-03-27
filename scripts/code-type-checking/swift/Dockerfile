FROM swift:5.9


WORKDIR /app

RUN swift package init --type executable

COPY Package.swift ./Package.swift

RUN swift package resolve

COPY snippets/ ./snippets

RUN mkdir -p ./Sources/SnippetValidator

COPY validate-swift.sh ./validate-swift.sh
RUN chmod +x ./validate-swift.sh

RUN ./validate-swift.sh
