import {
  OpenAPISchemaObject,
  OpenAPIResponseObject,
  OpenAPIHeaderObject,
  OpenAPIParameterObject,
} from "./openapischema";

export type APIRequestSchema = Omit<OpenAPISchemaObject, "properties" | "items" | "type"> & {
  type: "object" | "string" | "number" | "integer" | "boolean" | "array" | "dictionary";
  properties?: Record<string, APIRequestSchema>;
  items?: APIRequestSchema;
};
export type APIRequestResponse = Omit<OpenAPIResponseObject, "content" | "headers"> & {
  content?: Record<
    string,
    {
      schema?: APIRequestSchema | APIRequestSchema[];
      examples?: Record<string, any>;
    }
  >;
  headers?: Record<string, APIRequestHeader>;
};
export type APIRequestMethod = "get" | "post" | "put" | "delete" | "options" | "head" | "patch" | "trace";
export type APIRequestHeader = Omit<OpenAPIHeaderObject, "schema"> & { schema?: APIRequestSchema };
export type APIRequestParameter = Omit<OpenAPIParameterObject, "schema"> & { schema?: APIRequestSchema };

export type APIRequest = {
  path: string;
  summary?: string;
  title?: string;
  frontmatter?: Record<string, string | number | boolean>;
  description?: string;
  method: APIRequestMethod;
  parameters?: Record<string, APIRequestParameter>;
  body: {
    description?: string;
    schema?: Record<string, APIRequestSchema | APIRequestSchema[]>;
    required?: boolean;
  };
  deprecated?: boolean;
  security?: Record<string, string[]>[];
  responses: Record<string, APIRequestResponse>;
};
