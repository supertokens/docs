import * as yaml from "js-yaml";
import * as fs from "fs";
import { z } from "zod";

import { parseOpenApiRequest } from "../src/lib/parseOpenApiRequest";
import { APIRequestMethod } from "../src/types";

const API_NAME = "cdi";

const APIRequestSchemaSchema = z.lazy(() =>
  z
    .object({
      type: z.string().optional(),
      format: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      default: z.any().optional(),
      properties: z.record(z.string(), APIRequestSchemaSchema).optional(),
      items: APIRequestSchemaSchema.optional(),
      required: z.array(z.string()).optional(),
      example: z.any().optional(),
      enum: z.array(z.any()).optional(),
    })
    .refine((data) => {
      if (data.type === "object" && !data.properties) {
        return false;
      }
      return true;
    }, "Objects without properties are invalid"),
);

const APIRequestHeaderSchema = z.object({
  description: z.string().optional(),
  required: z.boolean().optional(),
  deprecated: z.boolean().optional(),
  schema: APIRequestSchemaSchema.optional(),
});

const APIRequestParameterSchema = z.object({
  name: z.string(),
  in: z.enum(["query", "header", "path", "cookie"]),
  description: z.string().optional(),
  required: z.boolean().optional(),
  deprecated: z.boolean().optional(),
  schema: APIRequestSchemaSchema.optional(),
});

const APIRequestResponseSchema = z.object({
  description: z.string(),
  content: z
    .record(
      z.string(),
      z.object({
        schema: z.union([APIRequestSchemaSchema, z.array(APIRequestSchemaSchema)]).optional(),
        examples: z.record(z.string(), z.any()).optional(),
      }),
    )
    .optional(),
  headers: z.record(z.string(), APIRequestHeaderSchema).optional(),
});

const APIRequestSchema = z.object({
  path: z.string(),
  summary: z.string().optional(),
  description: z.string().optional(),
  method: z.enum(["get", "post", "put", "delete", "options", "head", "patch", "trace"]),
  parameters: z.record(z.string(), APIRequestParameterSchema).optional(),
  body: z.object({
    description: z.string().optional(),
    schema: z.record(z.string(), z.union([APIRequestSchemaSchema, z.array(APIRequestSchemaSchema)])).optional(),
    required: z.boolean().optional(),
  }),
  deprecated: z.boolean().optional(),
  security: z.array(z.record(z.string(), z.array(z.string()))).optional(),
  responses: z.record(z.string(), APIRequestResponseSchema),
});

function parseOpenApiSchema() {
  const schemaPath = `./static/openapi/${API_NAME}/schema.yml`;
  const yamlContent = fs.readFileSync(schemaPath, "utf8");
  const openApiSpec = yaml.load(yamlContent);

  let successCount = 0;
  let errorCount = 0;

  for (const path in openApiSpec.paths) {
    for (const method in openApiSpec.paths[path]) {
      try {
        const request = parseOpenApiRequest(openApiSpec, path, method as APIRequestMethod);

        const validationResult = APIRequestSchema.safeParse(request);

        if (!validationResult.success) {
          console.error(`Validation failed for ${method} ${path}:`, validationResult.error);
          errorCount++;
          continue;
        }

        let parsedRequestPath = path.startsWith("/") ? path.substring(1) : path;
        parsedRequestPath = parsedRequestPath.replaceAll("/", "_");

        fs.writeFileSync(
          `./static/openapi/${API_NAME}/${method.toLowerCase()}-${parsedRequestPath}.json`,
          JSON.stringify(request, null, 2),
        );

        successCount++;
      } catch (error) {
        console.error(`Error processing ${method} ${path}:`, error);
        errorCount++;
      }
    }
  }

  console.log(`Processed ${successCount + errorCount} OpenAPI endpoints`);
  console.log(`Success: ${successCount}, Errors: ${errorCount}`);
}

parseOpenApiSchema();
