import { Badge, Card, Text, Code, Flex, Heading, HoverCard, Box, Separator } from "@radix-ui/themes";
import { DocItemContext } from "@site/src/context";
import { useDocPageData, useLoadOpenApiSchema } from "@site/src/hooks";
import { normalizePath } from "@site/src/lib";
import { APIRequestMethod, APIRequest } from "@site/src/types";
import ChevronDownIcon from "/img/icons/chevron-down.svg";
import { createContext, useContext, useMemo } from "react";
import { APIRequestParametersCard } from "./APIRequestParametersCard";
import * as Accordion from "@radix-ui/react-accordion";
import { APIRequestSchemaCard } from "./APIRequestSchemaCard";

import "./APIRequest.scss";

type APIRequestContextType = {
  path: string;
  formattedPath: string;
  method: APIRequestMethod;
  title: string;
  schema: APIRequest | null;
  apiName: "fdi" | "cdi";
};

export const APIRequestContext = createContext<APIRequestContextType>({} as APIRequestContextType);

export function APIRequestProvider({
  children,
  apiName,
  path,
  method,
  title,
}: {
  children: React.ReactNode;
  apiName: "fdi" | "cdi";
  path: string;
  method: APIRequestMethod;
  title: string;
}) {
  const { appInfo } = useContext(DocItemContext);
  const tenantType = useDocPageData("tenantType");
  const apiBasePath = appInfo.apiBasePath || "/auth";
  const openApiRequestPath = useMemo(() => {
    if (apiName === "fdi") return buildFDIOpenAPIPath(path, method);
    return path;
  }, [path, method, apiName]);

  const schema = useLoadOpenApiSchema(apiName, openApiRequestPath, method);
  const formattedPath = useMemo(() => {
    if (apiName === "fdi") return buildFDIFormattedPath(path, apiBasePath, tenantType);
    return path;
  }, [path, appInfo, tenantType, apiName]);

  const formattedRequestPath = useMemo(() => {
    const apiBasePath = appInfo.apiBasePath || "/auth";
    return tenantType === "multi-tenant"
      ? `${apiBasePath}/<TENANT_ID>${normalizePath(path)}`
      : `${apiBasePath}${normalizePath(path)}`;
  }, [appInfo, tenantType]);

  return (
    <APIRequestContext.Provider
      value={{
        path: formattedRequestPath,
        formattedPath,
        method,
        title,
        schema,
        apiName,
      }}
    >
      {children}
    </APIRequestContext.Provider>
  );
}

function buildFDIOpenAPIPath(path: string, method: string) {
  const FDIPathsWithoutTenantId = [
    { path: "/totp/device", method: "post" },
    { path: "/totp/device/remove", method: "post" },
    { path: "/totp/device/verify", method: "post" },
    { path: "/totp/verify", method: "post" },
    { path: "/mfa/info", method: "put" },
    { path: "/callback/apple", method: "post" },
    { path: "/session/refresh", method: "post" },
    { path: "/signout", method: "post" },
    { path: "/jwt/jwks.json", method: "get" },
    { path: "/totp/device/list", method: "get" },
    { path: "/user/email/verify", method: "get" },
    { path: "/.well-known/openid-configuration", method: "get" },
  ];

  const normalizedPath = normalizePath(path);
  const pathWithoutTenantId = FDIPathsWithoutTenantId.find((path) => path.path === normalizedPath);
  if (pathWithoutTenantId && pathWithoutTenantId.method === method) return `{apiBasePath}${normalizedPath}`;
  return `{apiBasePath}/<tenantId>${normalizedPath}`;
}

function buildFDIFormattedPath(path: string, apiBasePath: string, tenantType: "single-tenant" | "multi-tenant") {
  return tenantType === "multi-tenant"
    ? `${apiBasePath}/<TENANT_ID>${normalizePath(path)}`
    : `${apiBasePath}${normalizePath(path)}`;
}

function APIRequestAPINameBadge() {
  const { apiName } = useContext(APIRequestContext);

  const apiNameTitle = useMemo(() => {
    if (apiName === "fdi") return "Frontend Driver Interface";
    if (apiName === "cdi") return "Core Driver Interface";
  }, [apiName]);

  const apiNameDescription = useMemo(() => {
    if (apiName === "fdi") return "The API exposed by the backend SDK. It is used by your frontend.";

    if (apiName === "cdi")
      return "The API exposed by the SuperTokens Core Service. The backend SDK used it to persist the authentication state.";
  }, [apiName]);

  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <Badge variant="soft" color="orange" size="2" radius="medium">
          {apiName.toUpperCase()}
        </Badge>
      </HoverCard.Trigger>
      <HoverCard.Content maxWidth="300px">
        <Flex gap="4">
          <Heading as="h3" size="3">
            {apiNameTitle}
          </Heading>
          <Text size="3" color="gray">
            {apiNameDescription}
          </Text>
        </Flex>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}

export function APIRequestTitle() {
  const { title } = useContext(APIRequestContext);

  return (
    <Heading as="h1" size="6">
      {title}
    </Heading>
  );
}

export function APIRequestDescription() {
  const { schema } = useContext(APIRequestContext);

  if (!schema) return null;
  if (!schema.description) return null;

  return (
    <Text size="3" color="gray">
      {schema.description}
    </Text>
  );
}

export function APIRequestPath() {
  const { formattedPath, method } = useContext(APIRequestContext);
  return (
    <div>
      <Code weight="bold" variant="soft" color="gray" size="6">
        {`${method.toUpperCase()} ${formattedPath}`}
      </Code>
    </div>
  );
}

export function APIRequestPathParameters() {
  const { schema } = useContext(APIRequestContext);

  const pathParameters = useMemo(() => {
    if (!schema || !schema.parameters) return null;
    return Object.keys(schema.parameters).reduce((acc, param) => {
      if (schema.parameters[param].in === "path") {
        acc[param] = schema.parameters[param];
      }
      return acc;
    }, {});
  }, [schema]);

  if (!pathParameters || Object.keys(pathParameters).length === 0) return null;

  return (
    <Flex direction="column" gap="2" mt="5">
      <Heading as="h3" size="4" mb="1">
        Path Parameters
      </Heading>
      <APIRequestParametersCard parameters={pathParameters} />
    </Flex>
  );
}

export function APIRequestQueryParameters() {
  const { schema } = useContext(APIRequestContext);

  const queryParameters = useMemo(() => {
    if (!schema || !schema.parameters) return null;
    return Object.keys(schema.parameters).reduce((acc, param) => {
      if (schema.parameters[param].in === "query") {
        acc[param] = schema.parameters[param];
      }
      return acc;
    }, {});
  }, [schema]);

  if (!queryParameters || Object.keys(queryParameters).length === 0) return null;

  return (
    <Flex direction="column" gap="2" mt="5">
      <Heading as="h3" size="4" mb="1">
        Query Parameters
      </Heading>
      <APIRequestParametersCard parameters={queryParameters} />
    </Flex>
  );
}

export function APIRequestHeaderParameters() {
  const { schema } = useContext(APIRequestContext);

  const headerParameters = useMemo(() => {
    if (!schema || !schema.parameters) return null;
    return Object.keys(schema.parameters).reduce((acc, param) => {
      if (schema.parameters[param].in === "header") {
        acc[param] = schema.parameters[param];
      }
      return acc;
    }, {});
  }, [schema]);

  if (!headerParameters || Object.keys(headerParameters).length === 0) return null;

  return (
    <Flex direction="column" gap="2" mt="5">
      <Heading as="h3" size="4" mb="1">
        Headers
      </Heading>
      <APIRequestParametersCard parameters={headerParameters} />
    </Flex>
  );
}

export function APIRequestBody() {
  const { schema } = useContext(APIRequestContext);

  if (!schema || !schema.body) return null;
  if (!schema.body.schema || Object.keys(schema.body.schema).length === 0) return null;

  const jsonSchema = schema.body.schema["application/json"];
  if (!jsonSchema) return null;

  if (Array.isArray(jsonSchema)) {
    return (
      <Flex direction="column" gap="2" mt="5">
        <Heading as="h3" size="3" mb="1">
          Body Schema
        </Heading>
        <Text size="3" color="gray" mb="2" mt="2">
          Use one of the following schemas:
        </Text>
        <Flex direction="column" gap="2">
          {jsonSchema.map((schemaOption, index) => (
            <>
              <APIRequestSchemaCard key={index} schema={schemaOption} />
              {index !== jsonSchema.length - 1 && (
                <Flex gap="2" mb="2" mt="3" align="center">
                  <Separator size="4" />
                  <Text size="2" color="gray">
                    OR
                  </Text>
                  <Separator size="4" />
                </Flex>
              )}
            </>
          ))}
        </Flex>
      </Flex>
    );
  }

  if (!jsonSchema.properties) return null;

  return (
    <Flex direction="column" gap="2" mt="5">
      <Heading as="h3" size="4" mb="1">
        Body
      </Heading>
      <APIRequestSchemaCard schema={jsonSchema} />
    </Flex>
  );
}

export function APIRequestResponse() {
  const { schema } = useContext(APIRequestContext);

  if (!schema) return null;
  if (!schema.responses) return null;
  const statusCodes = Object.keys(schema.responses);
  if (!statusCodes.length) return null;

  return (
    <>
      <Box p="0" asChild>
        <Card asChild>
          <Accordion.Root type="multiple" defaultValue={[statusCodes[0]]} className="api-request-accordion">
            {statusCodes.map((statusCode, index) => {
              const response = schema.responses[statusCode];

              const hasContent = response.content && Object.keys(response.content).length > 0;
              const hasHeaders = response?.headers && Object.keys(response.headers).length > 0;
              const firstContentType = hasContent ? Object.keys(response.content)[0] : null;
              const hasApplicationJsonContent = firstContentType === "application/json";
              const content = hasContent ? response.content[firstContentType] : null;
              const contentSchema = content?.schema;

              let statusCodeColor: "green" | "red" = "green";
              if (statusCode.startsWith("4") || statusCode.startsWith("5")) statusCodeColor = "red";

              return (
                <>
                  <Accordion.Item value={statusCode} className="api-request-accordion__item" defaultChecked>
                    <Flex direction="row" align="center" gap="2" width="100%" asChild>
                      <Accordion.Trigger className="api-request-accordion__trigger">
                        <Flex direction="row" gap="2" align="center" mb="0" asChild>
                          <Accordion.Header>
                            <Code size="4" color={statusCodeColor}>
                              {statusCode}
                            </Code>
                            <Box mb="0" asChild>
                              <Heading as="h4" size="4">
                                {response.description}
                              </Heading>
                            </Box>
                          </Accordion.Header>
                        </Flex>

                        <Code size="3" color="gray" ml="auto">
                          {firstContentType}
                        </Code>
                        <ChevronDownIcon className="api-request-accordion__icon" aria-hidden />
                      </Accordion.Trigger>
                    </Flex>

                    <Accordion.Content className="api-request-accordion__content">
                      <Box pb="4" px="4" mt="3">
                        {contentSchema && Array.isArray(contentSchema) && hasApplicationJsonContent ? (
                          <>
                            <Box mb="2">
                              <Heading as="h3" size="4" mb="1">
                                Body
                              </Heading>
                              <Text size="3" color="gray">
                                One of the following body schemas will be returned:
                              </Text>
                            </Box>
                            <Flex direction="column" gap="2">
                              {contentSchema.map((schemaOption, index) => (
                                <Box>
                                  <APIRequestSchemaCard key={index} schema={schemaOption} />
                                  {index !== contentSchema.length - 1 && (
                                    <Flex gap="2" mb="2" mt="3" align="center">
                                      <Separator size="4" />
                                      <Text size="2" color="gray">
                                        OR
                                      </Text>
                                      <Separator size="4" />
                                    </Flex>
                                  )}
                                </Box>
                              ))}
                            </Flex>
                          </>
                        ) : null}

                        {contentSchema && !Array.isArray(contentSchema) && hasApplicationJsonContent ? (
                          <>
                            <Heading as="h3" size="4" mb="1">
                              Body
                            </Heading>
                            <APIRequestSchemaCard schema={contentSchema} />
                          </>
                        ) : null}

                        {hasHeaders && (
                          <Flex direction="column" gap="2">
                            <Box>
                              <Heading as="h3" size="4" mb="1" mt="6">
                                Headers
                              </Heading>
                              <Text size="3" color="gray">
                                After a successful request, the following headers will be set.
                              </Text>
                            </Box>
                            <APIRequestParametersCard parameters={response.headers} />
                          </Flex>
                        )}
                      </Box>
                    </Accordion.Content>
                  </Accordion.Item>
                </>
              );
            })}
          </Accordion.Root>
        </Card>
      </Box>
    </>
  );
}
