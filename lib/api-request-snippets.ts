import { sampleLanguages, type RequestSample, type SampleLanguage } from "blume/components/openapi/snippets.js";

interface ApiRequestSnippetLanguageOptions {
  curlConfig?: string;
}

export const buildGoRequestSnippet = (request: RequestSample): string => {
  const body = request.body ? `strings.NewReader(\`${request.body.replaceAll("`", '` + "`" + `')}\`)` : "nil";
  const imports = request.body ? ['"net/http"', '"strings"'] : ['"net/http"'];
  const headers = Object.entries(request.headers)
    .map(([name, value]) => `req.Header.Set(${JSON.stringify(name)}, ${JSON.stringify(value)})`)
    .join("\n");

  return `package main

import (
${imports.map((entry) => `\t${entry}`).join("\n")}
)

func main() {
\treq, err := http.NewRequest(${JSON.stringify(request.method)}, ${JSON.stringify(request.url)}, ${body})
\tif err != nil {
\t\tpanic(err)
\t}
${headers
  .split("\n")
  .filter(Boolean)
  .map((line) => `\t${line}`)
  .join("\n")}
\tresponse, err := http.DefaultClient.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer response.Body.Close()
}`;
};

export const buildApiRequestSnippetLanguages = ({
  curlConfig,
}: ApiRequestSnippetLanguageOptions = {}): SampleLanguage[] => {
  const builtInLanguages = sampleLanguages(["curl", "js", "python"]);
  const curl = builtInLanguages[0];
  const configuredCurl =
    curlConfig && curl
      ? {
          ...curl,
          build: (request: RequestSample) => {
            const { "api-key": _apiKey, ...headers } = request.headers;
            const lines = curl.build({ ...request, headers }).split(" \\\n");
            lines.splice(1, 0, `  --config '${curlConfig}'`);
            return lines.join(" \\\n");
          },
        }
      : curl;

  return [
    configuredCurl,
    builtInLanguages[1] ? { ...builtInLanguages[1], label: "JavaScript" } : undefined,
    { build: buildGoRequestSnippet, id: "go", label: "Go", lang: "go" } satisfies SampleLanguage,
    builtInLanguages[2],
  ].filter((language): language is SampleLanguage => language !== undefined);
};
