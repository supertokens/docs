import { describe, it, expect } from "vitest";
import { generateExampleFromAPIRequestSchema } from "../lib/generateExampleFromAPIRequestSchema";
import { APIRequestSchema } from "../types";

describe("generateExampleFromAPIRequestSchema", () => {
  it("should return the example when it exists", () => {
    const schema: APIRequestSchema = {
      type: "string",
      example: "example-value",
    };

    expect(generateExampleFromAPIRequestSchema(schema)).toBe("example-value");
  });

  it("should return the first enum value when enum exists", () => {
    const schema: APIRequestSchema = {
      type: "string",
      enum: ["option1", "option2", "option3"],
    };

    expect(generateExampleFromAPIRequestSchema(schema)).toBe("option1");
  });

  it("should handle array types by returning an array with one example item", () => {
    const schema: APIRequestSchema = {
      type: "array",
      items: {
        type: "string",
        example: "item-example",
      },
    };

    expect(generateExampleFromAPIRequestSchema(schema)).toEqual(["item-example"]);
  });

  it("should handle nested array types", () => {
    const schema: APIRequestSchema = {
      type: "array",
      items: {
        type: "array",
        items: {
          type: "string",
          example: "nested-item",
        },
      },
    };

    expect(generateExampleFromAPIRequestSchema(schema)).toEqual([["nested-item"]]);
  });

  it("should handle object types with properties", () => {
    const schema: APIRequestSchema = {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "John Doe",
        },
        age: {
          type: "integer",
          example: 30,
        },
        isActive: {
          type: "boolean",
          example: true,
        },
      },
    };

    expect(generateExampleFromAPIRequestSchema(schema)).toEqual({
      name: "John Doe",
      age: 30,
      isActive: true,
    });
  });

  it("should handle nested object types", () => {
    const schema: APIRequestSchema = {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "John Doe",
            },
            contact: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  example: "john@example.com",
                },
              },
            },
          },
        },
      },
    };

    expect(generateExampleFromAPIRequestSchema(schema)).toEqual({
      user: {
        name: "John Doe",
        contact: {
          email: "john@example.com",
        },
      },
    });
  });

  it("should handle properties with missing examples", () => {
    const schema: APIRequestSchema = {
      type: "object",
      properties: {
        name: {
          type: "string",
          example: "John Doe",
        },
        description: {
          type: "string",
          // No example
        },
      },
    };

    const result = generateExampleFromAPIRequestSchema(schema);
    expect(result).toHaveProperty("name", "John Doe");
    expect(result).toHaveProperty("description");
    // Since description doesn't have an example, it will fallback to an empty object
    expect(result.description).toEqual({});
  });

  it("should generate all fdi examples without error", async () => {
    const { readdir, readFile } = await import("node:fs/promises");
    const fdiFiles = await readdir("static/openapi/fdi");
    const jsonSchemas = fdiFiles.filter((file) => file.endsWith(".json"));
    const fdiSchemasFilePaths = jsonSchemas.map((file) => `static/openapi/fdi/${file}`);

    for (const requestPath of fdiSchemasFilePaths) {
      const schemaFile = await readFile(requestPath);
      const apiRequest = JSON.parse(schemaFile.toString());

      // Extract schema objects from responses
      for (const statusCode in apiRequest.responses) {
        const response = apiRequest.responses[statusCode];
        if (response.content && response.content["application/json"]) {
          const schema = response.content["application/json"].schema;
          
          expect(() => {
            try {
              generateExampleFromAPIRequestSchema(schema);
            } catch (e) {
              console.error(`Error in ${requestPath} for status ${statusCode}:`, e);
              throw e;
            }
          }, `${requestPath} status ${statusCode} should not throw an error`).not.toThrow();
        }
      }

      // Check parameters schema
      if (apiRequest.parameters) {
        for (const param in apiRequest.parameters) {
          const parameter = apiRequest.parameters[param];
          if (parameter.schema) {
            expect(() => {
              try {
                generateExampleFromAPIRequestSchema(parameter.schema);
              } catch (e) {
                console.error(`Error in ${requestPath} for parameter ${param}:`, e);
                throw e;
              }
            }, `${requestPath} parameter ${param} should not throw an error`).not.toThrow();
          }
        }
      }

      // Check body schema
      if (apiRequest.body && apiRequest.body.schema) {
        for (const contentType in apiRequest.body.schema) {
          const schema = apiRequest.body.schema[contentType];
          expect(() => {
            try {
              generateExampleFromAPIRequestSchema(schema);
            } catch (e) {
              console.error(`Error in ${requestPath} for body:`, e);
              throw e;
            }
          }, `${requestPath} body should not throw an error`).not.toThrow();
        }
      }
    }
  });

  it("should generate all cdi examples with correct indentation", async () => {
    const { readdir, readFile } = await import("node:fs/promises");
    const cdiFiles = await readdir("static/openapi/cdi");
    const jsonSchemas = cdiFiles.filter((file) => file.endsWith(".json"));
    const cdiSchemasFilePaths = jsonSchemas.map((file) => `static/openapi/cdi/${file}`);

    for (const requestPath of cdiSchemasFilePaths) {
      const schemaFile = await readFile(requestPath);
      const apiRequest = JSON.parse(schemaFile.toString());

      // Extract schema objects from responses
      for (const statusCode in apiRequest.responses) {
        const response = apiRequest.responses[statusCode];
        if (response.content && response.content["application/json"]) {
          const schema = response.content["application/json"].schema;
          
          // If schema is an array, check each schema in the array
          if (Array.isArray(schema)) {
            for (let i = 0; i < schema.length; i++) {
              const schemaItem = schema[i];
              expect(() => {
                try {
                  const example = generateExampleFromAPIRequestSchema(schemaItem);
                  // Check indentation by converting to JSON string with 2 spaces
                  if (typeof example === 'object' && example !== null && !Array.isArray(example)) {
                    const jsonStr = JSON.stringify(example, null, 2);
                    // Only check indentation for non-empty objects
                    if (Object.keys(example).length > 0) {
                      // Ensure the JSON string has correct indentation
                      expect(jsonStr).toMatch(/{\n\s{2}"[^"]+"/); // Check that there are exactly 2 spaces before properties
                    }
                  }
                } catch (e) {
                  console.error(`Error in ${requestPath} for status ${statusCode}, schema[${i}]:`, e);
                  throw e;
                }
              }, `${requestPath} status ${statusCode}, schema[${i}] should generate properly indented example`).not.toThrow();
            }
          } else if (schema) {
            expect(() => {
              try {
                const example = generateExampleFromAPIRequestSchema(schema);
                // Only check indentation for objects
                if (typeof example === 'object' && example !== null && !Array.isArray(example)) {
                  const jsonStr = JSON.stringify(example, null, 2);
                  // Only check indentation for non-empty objects
                  if (Object.keys(example).length > 0) {
                    // Ensure the JSON string has correct indentation
                    expect(jsonStr).toMatch(/{\n\s{2}"[^"]+"/); // Check that there are exactly 2 spaces before properties
                  }
                }
              } catch (e) {
                console.error(`Error in ${requestPath} for status ${statusCode}:`, e);
                throw e;
              }
            }, `${requestPath} status ${statusCode} should generate properly indented example`).not.toThrow();
          }
        }
      }

      // Check parameters schema
      if (apiRequest.parameters) {
        for (const param in apiRequest.parameters) {
          const parameter = apiRequest.parameters[param];
          if (parameter.schema) {
            expect(() => {
              try {
                generateExampleFromAPIRequestSchema(parameter.schema);
              } catch (e) {
                console.error(`Error in ${requestPath} for parameter ${param}:`, e);
                throw e;
              }
            }, `${requestPath} parameter ${param} should not throw an error`).not.toThrow();
          }
        }
      }

      // Check body schema
      if (apiRequest.body && apiRequest.body.schema) {
        for (const contentType in apiRequest.body.schema) {
          const schema = apiRequest.body.schema[contentType];
          expect(() => {
            try {
              const example = generateExampleFromAPIRequestSchema(schema);
              // Only check indentation for objects
              if (typeof example === 'object' && example !== null && !Array.isArray(example)) {
                const jsonStr = JSON.stringify(example, null, 2);
                // Only check indentation for non-empty objects
                if (Object.keys(example).length > 0) {
                  // Ensure the JSON string has correct indentation
                  expect(jsonStr).toMatch(/{\n\s{2}"[^"]+"/); // Check that there are exactly 2 spaces before properties
                }
              }
            } catch (e) {
              console.error(`Error in ${requestPath} for body:`, e);
              throw e;
            }
          }, `${requestPath} body should generate properly indented example`).not.toThrow();
        }
      }
    }
  });
});
