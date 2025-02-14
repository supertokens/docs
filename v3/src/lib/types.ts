type SaasConnectionUrlDomainCommonInfo = {
  deploymentId: string;
  deploymentName: string;
  region: string;
};

type SaasAppDeploymentConnectionInfo = {
  host: string;
  apiKeys: string[];
};

type SaasConnectionUriDomainApp = {
  appId: string;
  deployments: SaasAppDeployment[];
};

type SaasAppDeploymentCommonInfo = {
  coreVersion: string;
  config: SaasAppDeploymentConfig[];
  status: "active" | "restarting";
};

type SaasAppDeploymentConfig = {
  keyName: string;
  value: string;
  description: string | number | boolean;
};

type SaasAppDevDeployment = SaasAppDeploymentCommonInfo & {
  deploymentType: "development";
  connectionInfo: SaasAppDeploymentConnectionInfo;
};

type SaasAppProdDeployment = SaasAppDeploymentCommonInfo & {
  deploymentType: "production";
  connectionInfo?: SaasAppDeploymentConnectionInfo & {
    serviceApiKey: string;
  };
  pricing?: {
    basePrice: number;
    pricePerInstance: number;
    numberOfInstancesToPayFor: number;
    nextDueDate?: number;
  };
};

type SaasAppDeployment = SaasAppDevDeployment | SaasAppProdDeployment;

export type SaasConnectionUrlDomain = SaasConnectionUrlDomainCommonInfo &
  (
    | {
        isTemporarilyRemoved: false;
        apps: SaasConnectionUriDomainApp[];
      }
    | {
        isTemporarilyRemoved: true;
        isRecreating: boolean;
      }
  );

export type SaasAppListItem = {
  appName: string;
  appId: string;
  region: string;
  isTemporarilyRemoved: boolean;
  devDeployment: SassAppDevData;
  prodDeployment: SassAppProductionData;
};

export type SassAppDevData = {
  id: string;
  /** Version in format X.Y */
  supertokensVersion?: string;
  connectionInfo?: {
    host: string;
    apiKeys: string[];
  };
  config: {
    keyName: string;
    value: string | number | boolean;
    description: string;
  }[];
  supertokensInstance: {
    status: "active" | "restarting";
    /** unique ID across all instances */
    containerName: string;
  }[];
};

type SassAppProductionData = SassAppDevData & {
  userHadCreated: boolean;
  connectionInfo?: SassAppDevData["connectionInfo"] & {
    serviceApiKey: string;
  };
  pricing?: {
    basePrice: number;
    pricePerInstance: number;
    numberOfInstancesToPayFor: number;
    nextDueDate?: number;
  };
};

export interface OpenAPIDocument {
  openapi: string;
  info: InfoObject;
  servers?: ServerObject[];
  paths: PathsObject;
  components?: ComponentsObject;
  security?: SecurityRequirementObject[];
  tags?: TagObject[];
  externalDocs?: ExternalDocumentationObject;
}

interface InfoObject {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: ContactObject;
  license?: LicenseObject;
  version: string;
}

interface ContactObject {
  name?: string;
  url?: string;
  email?: string;
}

interface LicenseObject {
  name: string;
  url?: string;
}

interface ServerObject {
  url: string;
  description?: string;
  variables?: { [variable: string]: ServerVariableObject };
}

interface ServerVariableObject {
  enum?: string[];
  default: string;
  description?: string;
}

interface PathsObject {
  [path: string]: PathItemObject;
}

interface PathItemObject {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: OperationObject;
  put?: OperationObject;
  post?: OperationObject;
  delete?: OperationObject;
  options?: OperationObject;
  head?: OperationObject;
  patch?: OperationObject;
  trace?: OperationObject;
  servers?: ServerObject[];
  parameters?: (ParameterObject | ReferenceObject)[];
}

interface OperationObject {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
  operationId?: string;
  parameters?: (ParameterObject | ReferenceObject)[];
  requestBody?: RequestBodyObject | ReferenceObject;
  responses: ResponsesObject;
  callbacks?: { [callback: string]: CallbackObject | ReferenceObject };
  deprecated?: boolean;
  security?: SecurityRequirementObject[];
  servers?: ServerObject[];
}

interface ExternalDocumentationObject {
  description?: string;
  url: string;
}

interface ParameterObject {
  name: string;
  in: "query" | "header" | "path" | "cookie";
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: SchemaObject | ReferenceObject;
  example?: any;
  examples?: { [media: string]: ExampleObject | ReferenceObject };
  content?: { [media: string]: MediaTypeObject };
}

interface ReferenceObject {
  $ref: string;
}

interface RequestBodyObject {
  description?: string;
  content: { [media: string]: MediaTypeObject };
  required?: boolean;
}

interface ResponsesObject {
  [status: string]: ResponseObject | ReferenceObject;
}

interface ResponseObject {
  description: string;
  headers?: { [header: string]: HeaderObject | ReferenceObject };
  content?: { [media: string]: MediaTypeObject };
  links?: { [link: string]: LinkObject | ReferenceObject };
}

interface CallbackObject {
  [url: string]: PathItemObject | ReferenceObject;
}

interface ExampleObject {
  summary?: string;
  description?: string;
  value?: any;
  externalValue?: string;
}

interface MediaTypeObject {
  schema?: SchemaObject | ReferenceObject;
  example?: any;
  examples?: { [media: string]: ExampleObject | ReferenceObject };
  encoding?: { [media: string]: EncodingObject };
}

interface EncodingObject {
  contentType?: string;
  headers?: { [header: string]: HeaderObject | ReferenceObject };
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
}

interface HeaderObject extends ParameterObject {}

interface LinkObject {
  operationRef?: string;
  operationId?: string;
  parameters?: { [parameter: string]: any };
  requestBody?: any;
  description?: string;
  server?: ServerObject;
}

interface SecurityRequirementObject {
  [name: string]: string[];
}

interface ComponentsObject {
  schemas?: { [schema: string]: SchemaObject | ReferenceObject };
  responses?: { [response: string]: ResponseObject | ReferenceObject };
  parameters?: { [parameter: string]: ParameterObject | ReferenceObject };
  examples?: { [example: string]: ExampleObject | ReferenceObject };
  requestBodies?: { [request: string]: RequestBodyObject | ReferenceObject };
  headers?: { [header: string]: HeaderObject | ReferenceObject };
  securitySchemes?: {
    [scheme: string]: SecuritySchemeObject | ReferenceObject;
  };
  links?: { [link: string]: LinkObject | ReferenceObject };
  callbacks?: { [callback: string]: CallbackObject | ReferenceObject };
}

interface SchemaObject {
  title?: string;
  description?: string;
  type?: string;
  format?: string;
  nullable?: boolean;
  required?: string[];
  properties?: { [property: string]: SchemaObject | ReferenceObject };
  items?: SchemaObject | ReferenceObject;
  allOf?: (SchemaObject | ReferenceObject)[];
  oneOf?: (SchemaObject | ReferenceObject)[];
  anyOf?: (SchemaObject | ReferenceObject)[];
  not?: SchemaObject | ReferenceObject;
  enum?: any[];
  // Add more schema properties as needed
}

interface TagObject {
  name: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
}

interface SecuritySchemeObject {
  type: string;
  description?: string;
  name?: string;
  in?: string;
  scheme?: string;
  bearerFormat?: string;
  flows?: OAuthFlowsObject;
  openIdConnectUrl?: string;
}

interface OAuthFlowsObject {
  implicit?: OAuthFlowObject;
  password?: OAuthFlowObject;
  clientCredentials?: OAuthFlowObject;
  authorizationCode?: OAuthFlowObject;
}

interface OAuthFlowObject {
  authorizationUrl: string;
  tokenUrl: string;
  refreshUrl?: string;
  scopes: { [scope: string]: string };
}

export type InferDotNotationKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}` | `${K}.${InferDotNotationKeys<T[K]>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;

export type InferDotNotationValue<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? InferDotNotationValue<T[K], Rest>
      : never
    : never;
