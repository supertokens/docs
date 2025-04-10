import { APIRequest, APIRequestSchema } from "../types";
import { generateExampleFromAPIRequestSchema } from "./generateExampleFromAPIRequestSchema";
import { getExampleFromSchema } from "./getExampleFromSchema";
import type { OpenAPIV3 } from "@scalar/openapi-types";

type Environment = "shell" | "nodejs" | "go" | "python";

export function generateCodeSnippetFromAPIRequest(params: {
  host: string;
  operation: OpenAPIV3.OperationObject;
  security: OpenAPIV3.Document["components"]["securitySchemes"];
  environment: Environment;
  method: string;
  path: string;
}): string {
  const { environment } = params;
  let apiCodeSnippet: APICodeSnippet;

  switch (environment) {
    case "shell":
      apiCodeSnippet = new ShellAPICodeSnippet(params);
      break;
    case "nodejs":
      apiCodeSnippet = new NodeJSAPICodeSnippet(params);
      break;
    case "go":
      apiCodeSnippet = new GoAPICodeSnippet(params);
      break;
    case "python":
      apiCodeSnippet = new PythonAPICodeSnippet(params);
      break;
    default:
      throw new Error(`Invalid environment ${environment}`);
  }

  return apiCodeSnippet.render();
}

abstract class APICodeSnippet {
  public apiDomain: string;
  public request: OpenAPIV3.OperationObject;
  public security: OpenAPIV3.Document["components"]["securitySchemes"];
  public method: string;
  public path: string;
  constructor(params: {
    host: string;
    operation: OpenAPIV3.OperationObject;
    security: OpenAPIV3.Document["components"]["securitySchemes"];
    method: string;
    path: string;
  }) {
    this.apiDomain = params.host;
    this.request = params.operation;
    this.method = params.method;
    this.path = params.path;
    this.security = params.security;
  }

  get queryParams(): string {
    if (!this.request.parameters) return "";

    const queryParams = this.request.parameters.filter((param) => param.in === "query" && param.required);
    if (!queryParams.length) return "";
    return queryParams
      .map((parameter) => {
        const example = getExampleFromSchema(parameter.schema);
        return `${parameter.name}=${example}`;
      })
      .join("&");
  }

  get pathWithQueryParams() {
    const queryParams = this.queryParams;
    return queryParams ? `${this.path}?${queryParams}` : this.path;
  }

  get body(): Record<string, unknown> | null {
    const requestBody = this.request.requestBody as OpenAPIV3.RequestBodyObject;
    if (!requestBody || !requestBody.content || !requestBody.content["application/json"]) {
      return null;
    }
    const bodySchema = requestBody.content["application/json"];

    const example: Record<string, unknown> = {};

    if (bodySchema.examples) {
      return bodySchema.examples;
    }

    if ("oneOf" in bodySchema.schema) {
      const firstOption = bodySchema.schema.oneOf[0];

      if (firstOption.example) return firstOption.example;
      for (const [key, propSchema] of Object.entries(firstOption.properties)) {
        example[key] = this.extractSchemaExample(propSchema);
      }
      return example;
    }

    if (bodySchema.example) {
      return bodySchema.example;
    }

    return this.extractSchemaExample(bodySchema.schema) as Record<string, unknown>;
  }

  private extractSchemaExample(schema: OpenAPIV3.SchemaObject): unknown {
    if (schema.oneOf) {
      return this.extractSchemaExample(schema.oneOf[0]);
    }

    if (schema.example) {
      return schema.example;
    }

    if (schema.default) {
      return schema.default;
    }

    return getExampleFromSchema(schema);
  }

  abstract render(): string;
}

class ShellAPICodeSnippet extends APICodeSnippet {
  private get formattedMethod() {
    return this.method.toUpperCase();
  }

  render() {
    let snippet = `curl -L \\
    --request ${this.formattedMethod} \\
    --url '${this.apiDomain}${this.pathWithQueryParams}' \\
    --header 'Content-Type: application/json; charset=utf-8'`;

    const body = this.body;
    if (body) {
      snippet += ` \\
    --data '${JSON.stringify(body, null, 6)}'
`;
    }
    return snippet;
  }
}

class NodeJSAPICodeSnippet extends APICodeSnippet {
  private get formattedMethod() {
    return this.method.toUpperCase();
  }

  render() {
    const body = this.body;
    const bodyString = body ? `body: JSON.stringify(${JSON.stringify(body, null, 2)})` : "";

    return `const BASE_URL = "${this.apiDomain}"

const url = \`\$\{BASE_URL\}${this.pathWithQueryParams}\`;
const options = {
  method: '${this.formattedMethod}',
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
  private get formattedMethod() {
    return this.method.toUpperCase();
  }

  render() {
    const body = this.body;
    const imports = ["fmt", "net/http", body ? "strings" : null, "io"].filter(Boolean).join("\n  ");
    const stringifiedBody = body ? JSON.stringify(body, null, 2) : "";

    let bodyCode = "";
    if (body) {
      bodyCode = `payload := \`${stringifiedBody}\`
  req, _ := http.NewRequest("${this.formattedMethod}", url, payload);
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
  private get formattedMethod() {
    return this.method.toLowerCase();
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

response = requests.${this.formattedMethod}(url${body ? ", json=payload" : ""}, headers=headers)

print(response.json())`;
  }
}
