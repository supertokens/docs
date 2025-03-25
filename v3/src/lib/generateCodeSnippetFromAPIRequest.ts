import { APIRequest, APIRequestSchema } from "../types";
import { generateExampleFromAPIRequestSchema } from "./generateExampleFromAPIRequestSchema";

type Environment = "shell" | "nodejs" | "go" | "python";

export function generateCodeSnippetFromAPIRequest(
  apiDomain: string,
  request: APIRequest,
  environment: Environment,
): string {
  let apiCodeSnippet: APICodeSnippet;

  switch (environment) {
    case "shell":
      apiCodeSnippet = new ShellAPICodeSnippet(apiDomain, request, environment);
      break;
    case "nodejs":
      apiCodeSnippet = new NodeJSAPICodeSnippet(apiDomain, request, environment);
      break;
    case "go":
      apiCodeSnippet = new GoAPICodeSnippet(apiDomain, request, environment);
      break;
    case "python":
      apiCodeSnippet = new PythonAPICodeSnippet(apiDomain, request, environment);
      break;
    default:
      throw new Error(`Invalid environment ${environment}`);
  }

  return apiCodeSnippet.render();
}

abstract class APICodeSnippet {
  constructor(
    public apiDomain: string,
    public request: APIRequest,
    public environment: string,
  ) {}

  get queryParams(): string {
    const queryParams = Object.keys(this.request.parameters).filter(
      (key) => this.request.parameters[key].in === "query" && this.request.parameters[key].required,
    );
    if (!queryParams.length) return "";
    return queryParams
      .map((paramName) => {
        const parameter = this.request.parameters[paramName];
        const example = generateExampleFromAPIRequestSchema(parameter.schema);
        return `${paramName}=${example}`;
      })
      .join("&");
  }

  get pathWithQueryParams() {
    const queryParams = this.queryParams;
    return queryParams ? `${this.request.path}?${queryParams}` : this.request.path;
  }

  get body(): Record<string, unknown> | null {
    const requestBody = this.request.body;
    if (!requestBody || !requestBody.schema || !requestBody.schema["application/json"]) {
      return null;
    }
    const bodySchema = requestBody.schema["application/json"];

    const example: Record<string, unknown> = {};
    if ("oneOf" in bodySchema) {
      const firstOption = bodySchema.oneOf[0];

      if (firstOption.example) return firstOption.example;
      for (const [key, propSchema] of Object.entries(firstOption.properties)) {
        example[key] = this.extractSchemaExample(propSchema);
      }
      return example;
    }

    if (bodySchema.example) {
      return bodySchema.example;
    }

    if (bodySchema.default) {
      return bodySchema.default;
    }

    if (!bodySchema.properties) {
      return null;
    }

    for (const [key, propSchema] of Object.entries(bodySchema.properties)) {
      example[key] = this.extractSchemaExample(propSchema);
    }

    return example;
  }

  private extractSchemaExample(schema: APIRequestSchema): unknown {
    if (schema.example) {
      return schema.example;
    }

    if (schema.default) {
      return schema.default;
    }

    switch (schema.type) {
      case "string":
        return schema.enum ? schema.enum[0] : "string";
      case "number":
      case "integer":
        return 0;
      case "boolean":
        return false;
      case "array":
        return [this.extractSchemaExample(schema.items)];
      case "object":
        return Object.keys(schema.properties).reduce((acc, key) => {
          return { ...acc, [key]: this.extractSchemaExample(schema.properties[key]) };
        }, {});
    }
  }

  abstract render(): string;
}

class ShellAPICodeSnippet extends APICodeSnippet {
  private get method() {
    return this.request.method.toUpperCase();
  }

  render() {
    let snippet = `curl --location --request ${this.method} '${this.apiDomain}${this.pathWithQueryParams}' \\
     --header 'Content-Type: application/json; charset=utf-8'`;

    const body = this.body;
    if (body) {
      snippet += ` \\
    --data-raw '${JSON.stringify(body, null, 2)}'
`;
    }
    return snippet;
  }
}

class NodeJSAPICodeSnippet extends APICodeSnippet {
  private get method() {
    return this.request.method.toUpperCase();
  }

  render() {
    const body = this.body;
    const bodyString = body ? `body: JSON.stringify(${JSON.stringify(body, null, 2)})` : "";

    return `const BASE_URL = "${this.apiDomain}"

const url = \`\$\{BASE_URL\}${this.pathWithQueryParams}\`;
const options = {
  method: '${this.method}',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },${bodyString ? "\n  " + bodyString : ""}
}

fetch(url, options)
  .then(response => response.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));
`;
  }
}

class GoAPICodeSnippet extends APICodeSnippet {
  private get method() {
    return this.request.method.toUpperCase();
  }

  render() {
    const body = this.body;
    const imports = ["fmt", "net/http", body ? "strings" : null, "io"].filter(Boolean).join("\n  ");
    const stringifiedBody = body ? JSON.stringify(body, null, 2) : "";

    let bodyCode = "";
    if (body) {
      bodyCode = `payload := \`${stringifiedBody}\`
  req, _ := http.NewRequest("${this.method}", url, payload);
`;
    } else {
      bodyCode = `req, _ := http.NewRequest("${this.method}", url, nil)`;
    }

    return `import (
  ${imports}
)

func main() {
  baseUrl := "${this.apiDomain}"
  url := fmt.Sprintf("%s${this.pathWithQueryParams}", baseUrl)
  ${bodyCode}

  req.Header.Add("accept", "application/json")
  req.Header.Add("content-type", "application/json")

  res, _ := http.DefaultClient.Do(req)

  defer res.Body.Close()
  body, _ := io.ReadAll(res.Body)

  fmt.Println(string(body))
}`;
  }
}

class PythonAPICodeSnippet extends APICodeSnippet {
  private get method() {
    return this.request.method.toLowerCase();
  }

  render() {
    const body = this.body;
    let imports = `import requests
from typing import Dict, Any`;

    let bodyCode = "";
    if (body) {
      const bodyExample = JSON.stringify(body, null, 2);
      let pythonDict = bodyExample
        .replace(/"([^"]+)":/g, "$1:") // Convert "key": to key:
        .replace(/: "([^"]+)"/g, ': "$1"') // Keep string values
        .replace(/true/g, "True") // Convert boolean
        .replace(/false/g, "False")
        .replace(/null/g, "None");

      bodyCode = `payload: Dict[str, Any] = ${pythonDict}`;
    }

    return `${imports}

BASE_URL = "${this.apiDomain}"

url = f"{BASE_URL}${this.pathWithQueryParams}"

${bodyCode ? bodyCode + "\n\n" : ""}headers = {
    "Content-Type": "application/json",
}

response = requests.${this.method}(url${body ? ", json=payload" : ""}, headers=headers)

print(response.json())`;
  }
}
