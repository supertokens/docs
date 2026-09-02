import Parser from "tree-sitter";
import Go from "tree-sitter-go";
import { describe, expect, it } from "vitest";

import type { RequestSample } from "blume/components/openapi/snippets.js";

import { buildApiRequestSnippetLanguages, buildGoRequestSnippet } from "./api-request-snippets";

const parser = new Parser();
parser.setLanguage(Go);

const expectValidGoSyntax = (source: string): void => {
  expect(parser.parse(source).rootNode.hasError).toBe(false);
};

describe("buildGoRequestSnippet", () => {
  it("generates a stable request without a body or headers", () => {
    const request = {
      bodyValue: undefined,
      headers: {},
      method: "GET",
      url: "https://core.example.com/recipe/users?limit=10",
    } satisfies RequestSample;

    const source = buildGoRequestSnippet(request);

    expect(source).toBe(`package main

import (
\t"net/http"
)

func main() {
\treq, err := http.NewRequest("GET", "https://core.example.com/recipe/users?limit=10", nil)
\tif err != nil {
\t\tpanic(err)
\t}

\tresponse, err := http.DefaultClient.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer response.Body.Close()
}`);
    expect(source).not.toContain('"strings"');
    expectValidGoSyntax(source);
  });

  it("generates a stable request with headers and a body containing backticks", () => {
    const request = {
      body: '{"template":"before `value` after"}',
      bodyValue: { template: "before `value` after" },
      headers: {
        "Content-Type": "application/json",
        rid: "emailpassword",
      },
      method: "POST",
      url: "https://core.example.com/recipe/signin",
    } satisfies RequestSample;

    const source = buildGoRequestSnippet(request);

    expect(source).toBe(`package main

import (
\t"net/http"
\t"strings"
)

func main() {
\treq, err := http.NewRequest("POST", "https://core.example.com/recipe/signin", strings.NewReader(\`{"template":"before \` + "\`" + \`value\` + "\`" + \` after"}\`))
\tif err != nil {
\t\tpanic(err)
\t}
\treq.Header.Set("Content-Type", "application/json")
\treq.Header.Set("rid", "emailpassword")
\tresponse, err := http.DefaultClient.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer response.Body.Close()
}`);
    expectValidGoSyntax(source);
  });
});

describe("buildApiRequestSnippetLanguages", () => {
  it("keeps the configured language order, labels, and syntax identifiers", () => {
    const languages = buildApiRequestSnippetLanguages();

    expect(languages.map(({ id }) => id)).toEqual(["curl", "js", "go", "python"]);
    expect(languages.map(({ label }) => label)).toEqual(["cURL", "JavaScript", "Go", "Python"]);
    expect(languages.map(({ lang }) => lang)).toEqual(["bash", "js", "go", "python"]);
  });

  it("uses a protected curl config instead of an API key argument", () => {
    const curl = buildApiRequestSnippetLanguages({ curlConfig: "<PROTECTED_CONFIG>" })[0];
    const source = curl.build({
      body: '{"grantTypes":["client_credentials"]}',
      bodyValue: { grantTypes: ["client_credentials"] },
      headers: { "api-key": "YOUR_API_KEY", "Content-Type": "application/json" },
      method: "POST",
      url: "https://core.example.com/appid-public/recipe/oauth/clients",
    });

    expect(source).toContain("--config '<PROTECTED_CONFIG>'");
    expect(source).not.toContain("api-key");
    expect(source).not.toContain("YOUR_API_KEY");
    expect(source).toContain("Content-Type: application/json");
  });
});
