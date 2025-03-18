import {
  OpenAPISchema,
  OpenAPISchemaObject,
  OpenAPIHeaderObject,
  OpenAPIParameterObject,
  OpenAPIResponseObject,
  OpenAPIReferenceObject,
  APIRequestSchema,
  APIRequest,
  APIRequestHeader,
  APIRequestMethod,
  APIRequestResponse,
  APIRequestParameter,
} from "../types";

function resolveReference(schema: OpenAPISchema, ref: string): any {
  if (!ref.startsWith("#/")) {
    throw new Error(`External references are not supported: ${ref}`);
  }

  const parts = ref.substring(2).split("/");
  let current: any = schema;

  for (const part of parts) {
    if (current[part] === undefined) {
      throw new Error(`Reference not found: ${ref}`);
    }
    current = current[part];
  }

  return current;
}

function transformSchema(
  schema: OpenAPISchema,
  schemaObj: OpenAPISchemaObject | OpenAPIReferenceObject | undefined,
): APIRequestSchema | undefined {
  if (!schemaObj) {
    return undefined;
  }

  if ("$ref" in schemaObj) {
    const resolved = resolveReference(schema, schemaObj.$ref);
    return transformSchema(schema, resolved);
  }

  const { properties, items, ...rest } = schemaObj;
  const result: APIRequestSchema = { ...rest };

  if (schemaObj.properties) {
    result.properties = {};
    for (const [key, value] of Object.entries(schemaObj.properties)) {
      result.properties[key] = transformSchema(schema, value) as APIRequestSchema;
    }
  }

  if (schemaObj.items) {
    result.items = transformSchema(schema, schemaObj.items) as APIRequestSchema;
  }

  return result;
}

function transformParameter(
  schema: OpenAPISchema,
  param: OpenAPIParameterObject | OpenAPIReferenceObject,
): APIRequestParameter {
  if ("$ref" in param) {
    const resolved = resolveReference(schema, param.$ref);
    return transformParameter(schema, resolved);
  }

  return {
    ...param,
    schema: transformSchema(schema, param.schema),
  };
}

function transformHeader(
  schema: OpenAPISchema,
  header: OpenAPIHeaderObject | OpenAPIReferenceObject,
): APIRequestHeader {
  if ("$ref" in header) {
    const resolved = resolveReference(schema, header.$ref);
    return transformHeader(schema, resolved);
  }

  return {
    ...header,
    schema: transformSchema(schema, header.schema),
  };
}

function transformResponse(
  schema: OpenAPISchema,
  response: OpenAPIResponseObject | OpenAPIReferenceObject,
): APIRequestResponse {
  if ("$ref" in response) {
    const resolved = resolveReference(schema, response.$ref);
    return transformResponse(schema, resolved);
  }

  const result: APIRequestResponse = {
    description: response.description,
  };

  if (response.content) {
    result.content = {};
    for (const [mediaType, content] of Object.entries(response.content)) {
      if (content.schema) {
        if (typeof content.schema === "object" && "oneOf" in content.schema) {
          const oneOfArray = content.schema.oneOf.map(
            (schemaOption) =>
              transformSchema(schema, schemaOption as OpenAPISchemaObject | OpenAPIReferenceObject) as APIRequestSchema,
          );
          result.content[mediaType] = {
            ...content,
            schema: { oneOf: oneOfArray },
          };
        } else {
          result.content[mediaType] = {
            ...content,
            schema: transformSchema(schema, content.schema as OpenAPISchemaObject | OpenAPIReferenceObject),
          };
        }
      } else {
        result.content[mediaType] = {
          examples: content.examples,
        };
      }
    }
  }

  if (response.headers) {
    result.headers = {};
    for (const [name, header] of Object.entries(response.headers)) {
      result.headers[name] = transformHeader(schema, header);
    }
  }

  return result;
}

export function parseOpenApiRequest(schema: OpenAPISchema, path: string, method: APIRequestMethod): APIRequest {
  const pathObj = schema.paths[path];
  if (!pathObj) {
    throw new Error(`Path not found: ${path}`);
  }

  const operation = pathObj[method];
  if (!operation) {
    throw new Error(`Method ${method} not found for path: ${path}`);
  }

  const headers: Record<string, APIRequestHeader> = {};
  const parameters: Record<string, APIRequestParameter> = {};

  const allParams = [...(pathObj.parameters || []), ...(operation.parameters || [])];

  for (const param of allParams) {
    const transformedParam = transformParameter(schema, param);

    if (transformedParam.in === "header") {
      headers[transformedParam.name] = {
        description: transformedParam.description,
        required: transformedParam.required,
        deprecated: transformedParam.deprecated,
        schema: transformedParam.schema,
      };
    } else {
      parameters[transformedParam.name] = transformedParam;
    }
  }

  const body: APIRequest["body"] = {};
  if (operation.requestBody) {
    let requestBody = operation.requestBody;

    if (requestBody && typeof requestBody === "object" && "$ref" in requestBody) {
      const ref = requestBody.$ref as string;
      requestBody = resolveReference(schema, ref);
    }

    body.description = requestBody.description;
    body.required = requestBody.required;

    if (requestBody.content) {
      body.schema = {};
      for (const [mediaType, content] of Object.entries(requestBody.content)) {
        if (!content.schema) continue;
        if ("oneOf" in content.schema) {
          body.schema[mediaType] = {
            oneOf: content.schema.oneOf.map(
              (schemaOption) => transformSchema(schema, schemaOption) as APIRequestSchema,
            ),
          };
        } else {
          body.schema[mediaType] = transformSchema(schema, content.schema) as APIRequestSchema;
        }
      }
    }
  }

  const responses: Record<string, APIRequestResponse> = {};
  for (const [statusCode, response] of Object.entries(operation.responses)) {
    responses[statusCode] = transformResponse(schema, response);
  }

  return {
    path,
    method,
    summary: operation.summary,
    description: operation.description,
    headers,
    parameters: Object.keys(parameters).length > 0 ? parameters : undefined,
    body,
    deprecated: operation.deprecated,
    security: operation.security,
    responses,
  };
}
