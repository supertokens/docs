import { getExampleFromSchema } from "./getExampleFromSchema";
import type { OpenAPIV3 } from "@scalar/openapi-types";

type Environment = "shell" | "nodejs" | "go" | "python";

export enum AuthType {
  None = "none",
  Bearer = "bearer",
  ApiKey = "apiKey",
  Cookie = "cookie",
}

export function generateCodeSnippetFromAPIRequest(params: {
  host: string;
  operation: OpenAPIV3.OperationObject;
  security: OpenAPIV3.Document["components"]["securitySchemes"];
  environment: Environment;
  method: string;
  preferredAuthType?: AuthType;
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
  public preferredAuthType?: AuthType;
  constructor(params: {
    host: string;
    operation: OpenAPIV3.OperationObject;
    security: OpenAPIV3.Document["components"]["securitySchemes"];
    method: string;
    path: string;
    preferredAuthType?: AuthType;
  }) {
    this.apiDomain = params.host;
    this.request = params.operation;
    this.method = params.method;
    this.path = params.path;
    this.security = params.security;
    this.preferredAuthType = params.preferredAuthType;
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

  get securityRequirements() {
    const operation = this.request;
    const security = this.security;

    if (!operation) return [];
    if (!operation.security) return [];
    if (!security) return [];

    return operation.security
      .map((securityRequirement) => {
        const requirementName = Object.keys(securityRequirement)[0];
        const req = security[requirementName] as OpenAPIV3.SecuritySchemeObject | null;
        return req as OpenAPIV3.SecuritySchemeObject;
      })
      .filter((v) => v);
  }

  get headers(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json; charset=utf-8",
    };

    if (this.request.parameters) {
      const headerParams = this.request.parameters.filter((param) => param.in === "header" && param.required);
      headerParams.forEach((param) => {
        headers[param.name] = getExampleFromSchema(param.schema) as string;
      });
    }

    const securityRequirements = this.securityRequirements;

    if (securityRequirements.length > 0) {
      for (const securityRequirement of securityRequirements) {
        if (this.preferredAuthType && this.preferredAuthType !== securityRequirement.type) continue;
        if (securityRequirement.type === "http") {
          headers["Authorization"] = "Bearer {{token}}";
        } else if (securityRequirement.type === "apiKey" && securityRequirement.in === "cookie") {
          headers["Cookie"] = `${securityRequirement.name}={{token}}`;
        } else if (securityRequirement.type === "apiKey" && securityRequirement.in === "header") {
          headers[securityRequirement.name] = "{{api_key}}";
        }
      }
    }

    return headers;
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
    --url '${this.apiDomain}${this.pathWithQueryParams}'`;

    const headers = this.headers;
    for (const [headerName, headerValue] of Object.entries(headers)) {
      snippet += ` \\
    --header '${headerName}: ${headerValue}'`;
    }

    const body = this.body;
    if (body) {
      snippet += ` \\
    --data '${JSON.stringify(body, null, 6)}'
`;
    } else {
      snippet += `\n`;
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

    // Format headers for Node.js
    const headers = this.headers;
    const headersString = Object.entries(headers)
      .map(([name, value]) => `    '${name}': '${value}'`)
      .join(",\n");

    return `const BASE_URL = "${this.apiDomain}"

const url = \`\$\{BASE_URL\}${this.pathWithQueryParams}\`;
const options = {
  method: '${this.formattedMethod}',
  headers: {
${headersString}
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
      bodyCode = `req, _ := http.NewRequest("${this.formattedMethod}", url, nil)`;
    }

    const headers = this.headers;
    const headersCode = Object.entries(headers)
      .map(([name, value]) => `  req.Header.Add("${name}", "${value}")`)
      .join("\n");

    return `import (
  ${imports}
)

func main() {
  baseUrl := "${this.apiDomain}"
  url := fmt.Sprintf("%s${this.pathWithQueryParams}", baseUrl)
  ${bodyCode}

${headersCode}

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

    const headers = this.headers;
    const headersDict = Object.entries(headers)
      .map(([name, value]) => `    "${name}": "${value}"`)
      .join(",\n");

    return `${imports}

BASE_URL = "${this.apiDomain}"

url = f"{BASE_URL}${this.pathWithQueryParams}"

${bodyCode ? bodyCode + "\n\n" : ""}headers = {
${headersDict}
}

response = requests.${this.formattedMethod}(url${body ? ", json=payload" : ""}, headers=headers)

print(response.json())`;
  }
}
