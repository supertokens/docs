interface OpenAPIInfoObject {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: {
    name?: string;
    url?: string;
    email?: string;
  };
  license?: {
    name: string;
    url?: string;
  };
  version: string;
}

interface OpenAPIServerObject {
  url: string;
  description?: string;
  variables?: Record<
    string,
    {
      enum?: string[];
      default: string;
      description?: string;
    }
  >;
}

export interface OpenAPIParameterObject {
  name: string;
  in: "query" | "header" | "path" | "cookie";
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  schema?: OpenAPISchemaObject | OpenAPIReferenceObject;
}

export interface OpenAPISchemaObject {
  type?: string;
  format?: string;
  title?: string;
  description?: string;
  default?: any;
  properties?: Record<string, OpenAPISchemaObject | OpenAPIReferenceObject>;
  items?: OpenAPISchemaObject | OpenAPIReferenceObject;
  required?: string[];
  example?: any;
  enum?: any[];
}

export interface OpenAPIReferenceObject {
  $ref: string;
}

export interface OpenAPIResponseObject {
  description: string;
  headers?: Record<string, OpenAPIHeaderObject | OpenAPIReferenceObject>;
  content?: Record<
    string,
    {
      schema?:
        | OpenAPISchemaObject
        | OpenAPIReferenceObject
        | {
            oneOf: Array<
              | OpenAPISchemaObject
              | OpenAPIReferenceObject
              | { oneOf: Array<OpenAPISchemaObject | OpenAPIReferenceObject> }
            >;
          };
      examples?: Record<string, any>;
    }
  >;
  links?: Record<string, any>;
}

export interface OpenAPIHeaderObject {
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  schema?: OpenAPISchemaObject | OpenAPIReferenceObject;
}

interface OpenAPIOperationObject {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: {
    description?: string;
    url: string;
  };
  operationId?: string;
  parameters?: (OpenAPIParameterObject | OpenAPIReferenceObject)[];
  requestBody?: {
    description?: string;
    content: Record<
      string,
      {
        schema?:
          | OpenAPISchemaObject
          | OpenAPIReferenceObject
          | {
              oneOf: Array<
                | OpenAPISchemaObject
                | OpenAPIReferenceObject
                | { oneOf: Array<OpenAPISchemaObject | OpenAPIReferenceObject> }
              >;
            };
      }
    >;
    required?: boolean;
  };
  responses: Record<string, OpenAPIResponseObject | OpenAPIReferenceObject>;
  deprecated?: boolean;
  security?: Record<string, string[]>[];
}

interface OpenAPIPathItemObject {
  summary?: string;
  description?: string;
  get?: OpenAPIOperationObject;
  put?: OpenAPIOperationObject;
  post?: OpenAPIOperationObject;
  delete?: OpenAPIOperationObject;
  options?: OpenAPIOperationObject;
  head?: OpenAPIOperationObject;
  patch?: OpenAPIOperationObject;
  trace?: OpenAPIOperationObject;
  servers?: OpenAPIServerObject[];
  parameters?: (OpenAPIParameterObject | OpenAPIReferenceObject)[];
}

interface OpenAPIComponentsObject {
  schemas?: Record<string, OpenAPISchemaObject | OpenAPIReferenceObject>;
  responses?: Record<string, OpenAPIResponseObject | OpenAPIReferenceObject>;
  parameters?: Record<string, OpenAPIParameterObject | OpenAPIReferenceObject>;
  examples?: Record<string, any>;
  requestBodies?: Record<string, any>;
  headers?: Record<string, OpenAPIHeaderObject | OpenAPIReferenceObject>;
  securitySchemes?: Record<string, any>;
  links?: Record<string, any>;
  callbacks?: Record<string, any>;
}

export interface OpenAPISchema {
  openapi: string;
  info: OpenAPIInfoObject;
  servers?: OpenAPIServerObject[];
  paths: Record<string, OpenAPIPathItemObject>;
  components?: OpenAPIComponentsObject;
  security?: Record<string, string[]>[];
  tags?: {
    name: string;
    description?: string;
    externalDocs?: {
      description?: string;
      url: string;
    };
  }[];
  externalDocs?: {
    description?: string;
    url: string;
  };
}
