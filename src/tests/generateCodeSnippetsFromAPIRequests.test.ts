import { describe, it, expect } from "vitest";
import { generateCodeSnippetFromAPIRequest } from "../lib/generateCodeSnippetFromAPIRequest";
import { APIRequest } from "../types";
import { readdir, readFile } from "node:fs/promises";

const loadApiRequest = async (filePath: string) => {
  const schemaFile = await readFile(filePath);
  return JSON.parse(schemaFile.toString());
};

describe("generateCodeSnippetFromAPIRequest", () => {
  it("should generate all fdi snippets without error", async () => {
    const fdiFiles = await readdir("static/openapi/fdi");
    const jsonSchemas = fdiFiles.filter((file) => file.endsWith(".json"));
    const fdiSchemasFilePaths = jsonSchemas.map((file) => `static/openapi/fdi/${file}`);

    const mockApiDomain = "https://api.supertokens.io";
    const environments = ["shell", "nodejs", "python", "go"] as const;

    for (const requestPath of fdiSchemasFilePaths) {
      const apiRequest = await loadApiRequest(requestPath);

      for (const env of environments) {
        expect(() => {
          try {
            generateCodeSnippetFromAPIRequest(mockApiDomain, apiRequest, env);
          } catch (e) {
            console.error(e);
            throw e;
          }
        }, `${requestPath} should not throw an error for ${env}`).not.toThrow();
      }
    }
  });

  it("should generate all cdi snippets with correct indentation", async () => {
    const cdiFiles = await readdir("static/openapi/cdi");
    const jsonSchemas = cdiFiles.filter((file) => file.endsWith(".json"));
    const cdiSchemasFilePaths = jsonSchemas.map((file) => `static/openapi/cdi/${file}`);

    const mockApiDomain = "https://api.supertokens.io";
    const environments = ["shell", "nodejs", "python", "go"] as const;

    for (const requestPath of cdiSchemasFilePaths) {
      const apiRequest = await loadApiRequest(requestPath);

      for (const env of environments) {
        expect(() => {
          try {
            generateCodeSnippetFromAPIRequest(mockApiDomain, apiRequest, env);
          } catch (e) {
            console.error(e);
            throw e;
          }
        }, `${requestPath} should not throw an error for ${env}`).not.toThrow();
      }
    }
  });

  const mockApiDomain = "https://api.example.com";
  const simpleGetRequest: APIRequest = {
    path: "/users",
    method: "get",
    body: {},
    parameters: {},
    responses: {
      "200": {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  name: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  const postRequestWithBody: APIRequest = {
    path: "/users",
    method: "post",
    body: {
      schema: {
        "application/json": {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "John Doe",
            },
            email: {
              type: "string",
              example: "john@example.com",
            },
          },
        },
      },
    },
    parameters: {},
    responses: {
      "201": {
        description: "Created",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
                email: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  };

  const getRequestWithQueryParams: APIRequest = {
    path: "/users/search",
    method: "get",
    body: {},
    parameters: {
      query: {
        name: "query",
        in: "query",
        description: "Search query",
        required: true,
        schema: {
          type: "string",
          example: "john",
        },
      },
      limit: {
        name: "limit",
        in: "query",
        description: "Number of results",
        required: true,
        schema: {
          type: "integer",
          example: 10,
        },
      },
    },
    responses: {
      "200": {
        description: "Success",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  name: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  describe("Shell (cURL) code generation", () => {
    it("should generate a correct cURL command for a simple GET request", () => {
      const code = generateCodeSnippetFromAPIRequest(mockApiDomain, simpleGetRequest, "shell");
      expect(code).toContain(`curl --location --request GET '${mockApiDomain}/users'`);
      expect(code).toContain("--header 'Content-Type: application/json; charset=utf-8'");
      expect(code).not.toContain("--data-raw");
    });

    it("should generate a correct cURL command for a POST request with body", () => {
      const code = generateCodeSnippetFromAPIRequest(mockApiDomain, postRequestWithBody, "shell");
      expect(code).toContain(`curl --location --request POST '${mockApiDomain}/users'`);
      expect(code).toContain("--header 'Content-Type: application/json; charset=utf-8'");
      expect(code).toContain("--data-raw");
      expect(code).toContain('"name": "John Doe"');
      expect(code).toContain('"email": "john@example.com"');
    });

    it("should handle query parameters in a GET request", () => {
      const code = generateCodeSnippetFromAPIRequest(mockApiDomain, getRequestWithQueryParams, "shell");
      expect(code).toContain(`curl --location --request GET '${mockApiDomain}/users/search?query=john&limit=10'`);
    });
  });

  describe("Node.js code generation", () => {
    it("should generate correct Node.js code for a simple GET request", () => {
      const code = generateCodeSnippetFromAPIRequest(mockApiDomain, simpleGetRequest, "nodejs");
      expect(code).toContain(`const BASE_URL = "${mockApiDomain}"`);
      expect(code).toContain(`const url = \`\$\{BASE_URL\}/users\``);
      expect(code).toContain(`method: 'GET'`);
      expect(code).not.toContain("body:");
    });

    it("should generate correct Node.js code for a POST request with body", () => {
      const code = generateCodeSnippetFromAPIRequest(mockApiDomain, postRequestWithBody, "nodejs");
      expect(code).toContain(`const url = \`\$\{BASE_URL\}/users\``);
      expect(code).toContain(`method: 'POST'`);
      expect(code).toContain("body: JSON.stringify");
      expect(code).toContain('"name": "John Doe"');
      expect(code).toContain('"email": "john@example.com"');
    });

    it("should handle query parameters in Node.js code", () => {
      const code = generateCodeSnippetFromAPIRequest(mockApiDomain, getRequestWithQueryParams, "nodejs");
      expect(code).toContain(`const url = \`\$\{BASE_URL\}/users/search?query=john&limit=10\``);
    });
  });

  describe("Python code generation", () => {
    it("should generate correct Python code for a simple GET request", () => {
      const code = generateCodeSnippetFromAPIRequest(mockApiDomain, simpleGetRequest, "python");
      expect(code).toContain(`BASE_URL = "${mockApiDomain}"`);
      expect(code).toContain(`url = f"{BASE_URL}/users"`);
      expect(code).toContain(`response = requests.get(url`);
      expect(code).not.toContain("json=payload");
    });

    it("should generate correct Python code for a POST request with body", () => {
      const code = generateCodeSnippetFromAPIRequest(mockApiDomain, postRequestWithBody, "python");
      expect(code).toContain(`url = f"{BASE_URL}/users"`);
      expect(code).toContain(`response = requests.post(url`);
      expect(code).toContain("json=payload");
      expect(code).toContain('name: "John Doe"');
      expect(code).toContain('email: "john@example.com"');
    });

    it("should handle query parameters in Python code", () => {
      const code = generateCodeSnippetFromAPIRequest(mockApiDomain, getRequestWithQueryParams, "python");
      expect(code).toContain(`url = f"{BASE_URL}/users/search?query=john&limit=10"`);
    });
  });

  describe("Go code generation", () => {
    it("should generate correct Go code for a simple GET request", () => {
      const code = generateCodeSnippetFromAPIRequest(mockApiDomain, simpleGetRequest, "go");
      expect(code).toContain(`baseUrl := "${mockApiDomain}"`);
      expect(code).toContain(`url := fmt.Sprintf("%s/users", baseUrl)`);
      expect(code).toContain(`req, _ := http.NewRequest("GET", url, nil)`);
    });

    it("should generate correct Go code for a POST request with body", () => {
      const code = generateCodeSnippetFromAPIRequest(mockApiDomain, postRequestWithBody, "go");
      expect(code).toContain(`url := fmt.Sprintf("%s/users", baseUrl)`);
      expect(code).toContain(`req, _ := http.NewRequest("POST", url, payload)`);
      expect(code).toContain(`"name": "John Doe"`);
      expect(code).toContain(`"email": "john@example.com"`);
    });

    it("should handle query parameters in Go code", () => {
      const code = generateCodeSnippetFromAPIRequest(mockApiDomain, getRequestWithQueryParams, "go");
      expect(code).toContain(`url := fmt.Sprintf("%s/users/search?query=john&limit=10", baseUrl)`);
    });
  });

  it("should throw error for invalid environment", () => {
    expect(() => {
      // @ts-expect-error Testing invalid environment
      generateCodeSnippetFromAPIRequest(mockApiDomain, simpleGetRequest, "invalid");
    }).toThrow("Invalid environment invalid");
  });
});
