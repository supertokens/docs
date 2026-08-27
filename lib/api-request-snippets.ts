import { sampleLanguages, type RequestSample, type SampleLanguage } from "blume/components/openapi/snippets.js";

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

export const buildApiRequestSnippetLanguages = (): SampleLanguage[] => {
  const builtInLanguages = sampleLanguages(["curl", "js", "python"]);

  return [
    builtInLanguages[0],
    builtInLanguages[1] ? { ...builtInLanguages[1], label: "JavaScript / Node.js" } : undefined,
    { build: buildGoRequestSnippet, id: "go", label: "Go", lang: "go" } satisfies SampleLanguage,
    builtInLanguages[2],
  ].filter((language): language is SampleLanguage => language !== undefined);
};
