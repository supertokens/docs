import { Badge, Card, Text, Code, Flex, Heading, HoverCard, Box, Separator, Callout } from "@radix-ui/themes";
import { DocItemContext } from "@site/src/context";
import InfoCircledIcon from "/img/icons/info-circled.svg";
import ExclamationTriangleIcon from "/img/icons/exclamation-triangle.svg";
import { useDocPageData, useLoadOpenApiDocument } from "@site/src/hooks";
import { normalizePath } from "@site/src/lib";
import Link from "@docusaurus/Link";
import { APIRequestMethod, APIRequest } from "@site/src/types";
import ChevronDownIcon from "/img/icons/chevron-down.svg";
import { createContext, useContext, useMemo } from "react";
import { APIRequestParametersCard } from "./APIRequestParametersCard";
import * as Accordion from "@radix-ui/react-accordion";
import { APIRequestSchemaCard } from "./APIRequestSchemaCard";
import type { OpenAPIV3 } from "@scalar/openapi-types";

import "./APIRequest.scss";

type APIRequestContextType = {
  path: string;
  formattedPath: string;
  method: APIRequestMethod;
  security: OpenAPIV3.Document["components"]["securitySchemes"] | null;
  title: string;
  operation: OpenAPIV3.OperationObject | null;
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

  const document = useLoadOpenApiDocument(apiName);

  const operation = useMemo(() => {
    if (!document) return null;
    return document.paths[path][method] as OpenAPIV3.OperationObject;
  }, [document, path, method]);

  const securitySchemes = useMemo(() => {
    if (!document) return null;
    return document.components?.securitySchemes;
  }, [document]);

  const formattedPath = useMemo(() => {
    if (apiName === "fdi") return buildFDIFormattedPath(path, apiBasePath, tenantType);
    return path;
  }, [path, appInfo, tenantType, apiName]);

  return (
    <APIRequestContext.Provider
      value={{
        path,
        security: securitySchemes,
        formattedPath,
        method,
        title,
        operation,
        apiName,
      }}
    >
      {children}
    </APIRequestContext.Provider>
  );
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
  const { operation } = useContext(APIRequestContext);

  if (!operation) return null;
  if (!operation.description) return null;

  return (
    <Text size="3" color="gray">
      {operation.description}
    </Text>
  );
}

const MethodToColorMap: Record<APIRequestMethod, "green" | "red" | "blue" | "orange" | "yellow" | "gray"> = {
  get: "green",
  delete: "red",
  post: "blue",
  put: "orange",
  patch: "yellow",
  options: "gray",
  head: "gray",
  trace: "gray",
};

export function APIRequestMethodBadge({
  size = "3",
  method,
}: Pick<React.ComponentProps<typeof Badge>, "size"> & { method: APIRequestMethod }) {
  return (
    <Badge variant="soft" color={MethodToColorMap[method]} size={size} radius="full">
      {method.toUpperCase()}
    </Badge>
  );
}

export function APIRequestPath() {
  const { path, method } = useContext(APIRequestContext);
  const parsedPath = useMemo(() => {
    const params = { apiBasePath: ":apiBasePath", tenantId: ":tenantId" };
    return path.replace(/\{([^}]+)\}/g, (_, key) => {
      return params[key] || key;
    });
  }, [path]);

  return (
    <Flex gap="5">
      <Flex gap="4" align="center" asChild>
        <Heading as="h1" size="8">
          <Text color={MethodToColorMap[method]} align="center">
            {method.toUpperCase()}
          </Text>
          <Text color="gray" highContrast align="center">
            {parsedPath}
          </Text>
        </Heading>
      </Flex>
    </Flex>
  );
}

export function APIRequestPathParameters() {
  const { operation: schema } = useContext(APIRequestContext);

  const pathParameters = useMemo(() => {
    if (!schema || !schema.parameters) return null;
    return schema.parameters.filter((param) => param.in === "path") as OpenAPIV3.ParameterObject[];
  }, [schema]);

  if (!pathParameters || pathParameters.length === 0) return null;

  return (
    <Flex direction="column" gap="2">
      <Heading as="h3" size="4" mb="1">
        Path Parameters
      </Heading>
      <APIRequestParametersCard parameters={pathParameters} />
    </Flex>
  );
}

export function APIRequestQueryParameters() {
  const { operation: schema } = useContext(APIRequestContext);

  const queryParameters = useMemo(() => {
    if (!schema || !schema.parameters) return null;
    return schema.parameters.filter((param) => param.in === "query") as OpenAPIV3.ParameterObject[];
  }, [schema]);

  if (!queryParameters || queryParameters.length === 0) return null;

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
  const { operation: schema } = useContext(APIRequestContext);

  const headerParameters = useMemo(() => {
    if (!schema || !schema.parameters) return null;
    return schema.parameters.filter((param) => param.in === "header") as OpenAPIV3.ParameterObject[];
  }, [schema]);

  if (!headerParameters || headerParameters.length === 0) return null;

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
  const { operation } = useContext(APIRequestContext);

  if (!operation || !operation.requestBody) return null;
  const requestBody = operation.requestBody as OpenAPIV3.RequestBodyObject;
  if (!requestBody.content || Object.keys(requestBody.content).length === 0) return null;

  const mediaTypeObject = requestBody.content["application/json"];
  if (!mediaTypeObject) return null;

  const bodySchema = mediaTypeObject.schema as OpenAPIV3.SchemaObject;

  if (bodySchema.type === "array") {
    return (
      <Flex direction="column" gap="2" mt="5">
        <Heading as="h3" size="3" mb="1">
          Body Schema
        </Heading>
        <Text size="3" color="gray" mb="2" mt="2">
          Use one of the following schemas:
        </Text>
        <Flex direction="column" gap="2">
          {bodySchema.items.map((schemaOption, index) => {
            const itemSchema = schemaOption as OpenAPIV3.SchemaObject;
            return (
              <>
                <APIRequestSchemaCard key={index} schema={itemSchema} />
                {index !== bodySchema.length - 1 && (
                  <Flex gap="2" mb="2" mt="3" align="center">
                    <Separator size="4" />
                    <Text size="2" color="gray">
                      OR
                    </Text>
                    <Separator size="4" />
                  </Flex>
                )}
              </>
            );
          })}
        </Flex>
      </Flex>
    );
  }

  if (bodySchema.type === "object" && !bodySchema.properties) {
    return null;
  }

  return (
    <Flex direction="column" gap="2" mt="5">
      <Heading as="h3" size="4" mb="1">
        Body
      </Heading>
      <APIRequestSchemaCard schema={bodySchema} />
    </Flex>
  );
}

export function APIRequestResponse() {
  const { operation } = useContext(APIRequestContext);

  if (!operation) return null;
  if (!operation.responses) return null;
  const statusCodes = Object.keys(operation.responses);
  if (!statusCodes.length) return null;

  return (
    <>
      <Box p="0" asChild>
        <Card asChild>
          <Accordion.Root type="multiple" defaultValue={[statusCodes[0]]} className="api-request-accordion">
            {statusCodes.map((statusCode, index) => {
              const response = operation.responses[statusCode] as OpenAPIV3.ResponseObject;

              const hasContent = response.content && Object.keys(response.content).length > 0;
              const hasHeaders = response?.headers && Object.keys(response.headers).length > 0;

              const firstContentType = hasContent ? Object.keys(response.content)[0] : null;
              const content = hasContent ? response.content[firstContentType] : null;

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
                          {firstContentType || "application/json"}
                        </Code>
                        <ChevronDownIcon className="api-request-accordion__icon" aria-hidden />
                      </Accordion.Trigger>
                    </Flex>

                    <Accordion.Content className="api-request-accordion__content">
                      <Flex direction="column" gap="3" pb="4" px="4" mt="3">
                        {hasContent && (
                          <APIRequestResponseBody mediaTypeObject={content} mediaType={firstContentType} />
                        )}
                        {hasHeaders && (
                          <Flex direction="column" gap="2">
                            <Box>
                              <Heading as="h5" size="4" mb="1" mt="0">
                                Headers
                              </Heading>
                              <Text size="3" color="gray">
                                After a successful request, the following headers will be set.
                              </Text>
                            </Box>
                            <APIRequestParametersCard
                              parameters={
                                Object.keys(response.headers).map((key) => ({
                                  name: key,
                                  ...response.headers[key],
                                })) as OpenAPIV3.ParameterObject[]
                              }
                            />
                          </Flex>
                        )}
                      </Flex>
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

function APIRequestResponseBody({
  mediaTypeObject,
  mediaType,
}: {
  mediaTypeObject: OpenAPIV3.MediaTypeObject;
  mediaType: string;
}) {
  const bodySchema = mediaTypeObject.schema as OpenAPIV3.SchemaObject;

  if (!bodySchema) return null;

  if (mediaType !== "application/json") {
    return (
      <>
        <Box mb="2">
          <Heading as="h3" size="4" mb="1">
            Body
          </Heading>
        </Box>
        <Flex direction="column" gap="2">
          {bodySchema.enum[0]}
        </Flex>
      </>
    );
  }

  if (bodySchema.oneOf) {
    return (
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
          {bodySchema.oneOf.map((schema, index) => {
            const typedSchema = schema as OpenAPIV3.SchemaObject;
            return (
              <Box key={`${schema.type}-${index}`}>
                <APIRequestSchemaCard key={index} schema={typedSchema} />
                {index !== bodySchema.oneOf.length - 1 && (
                  <Flex gap="2" mb="2" mt="3" align="center">
                    <Separator size="4" />
                    <Text size="2" color="gray">
                      OR
                    </Text>
                    <Separator size="4" />
                  </Flex>
                )}
              </Box>
            );
          })}
        </Flex>
      </>
    );
  }

  if (bodySchema.type === "array") {
    return (
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
          {bodySchema.items.map((schema, index) => {
            const typedSchema = schema as OpenAPIV3.SchemaObject;
            return (
              <Box>
                <APIRequestSchemaCard key={index} schema={typedSchema} />
                {index !== bodySchema.items.length - 1 && (
                  <Flex gap="2" mb="2" mt="3" align="center">
                    <Separator size="4" />
                    <Text size="2" color="gray">
                      OR
                    </Text>
                    <Separator size="4" />
                  </Flex>
                )}
              </Box>
            );
          })}
        </Flex>
      </>
    );
  }

  return (
    <>
      <Heading as="h3" size="4" mb="1">
        Body
      </Heading>
      <APIRequestSchemaCard schema={bodySchema} />
    </>
  );
}

export function APIRequestApiTypeBadge() {
  const { apiName } = useContext(APIRequestContext);

  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <Box style={{ cursor: "pointer" }} asChild>
          <Code color="blue" size="7" weight="bold">
            {apiName.toUpperCase()}
          </Code>
        </Box>
      </HoverCard.Trigger>
      <Box p="0" asChild>
        <HoverCard.Content>
          <Callout.Root color="blue">
            <Flex gap="2">
              <Callout.Icon>
                <InfoCircledIcon width="20px" height="20px" />
              </Callout.Icon>
              <Flex direction="column">
                <Heading as="h3" size="4" mb="2">
                  {apiName.toUpperCase()} Endpoint
                </Heading>
                <Text>
                  {apiName === "cdi" ? (
                    <>
                      The endpoint is part of the{" "}
                      <Link href="/docs/references/cdi/introduction.mdx">
                        <b>Core Driver Interface</b>
                      </Link>{" "}
                      API. It's exposed by the SuperTokens Core service and you should only use it from your backend
                      applications.
                    </>
                  ) : (
                    <>
                      This endpoint is part of the{" "}
                      <Link href="/docs/references/fdi/introduction.mdx">
                        <b>Frontend Driver Interface</b>
                      </Link>{" "}
                      API. It's exposed by the SuperTokens Backend SDKs and you should only use it from your frontend
                      applications.
                    </>
                  )}
                </Text>
              </Flex>
            </Flex>
          </Callout.Root>
        </HoverCard.Content>
      </Box>
    </HoverCard.Root>
  );
}

export function APIRequestDeprecatedCallout() {
  const { operation } = useContext(APIRequestContext);

  if (!operation) return null;
  if (!operation.deprecated) return null;

  return (
    <Callout.Root color="red">
      <Flex gap="3">
        <Box mt="1" asChild>
          <Callout.Icon>
            <ExclamationTriangleIcon width="20px" height="20px" />
          </Callout.Icon>
        </Box>
        <Flex direction="column">
          <Heading as="h3" size="4" mb="2">
            Deprecated
          </Heading>
          <Text>This endpoint is deprecated. Please use the newer version.</Text>
        </Flex>
      </Flex>
    </Callout.Root>
  );
}

export function APIRequestSecuritySection() {
  const { operation, security } = useContext(APIRequestContext);

  if (!operation) return null;
  if (!operation.security) return null;
  if (!security) return null;

  console.log(operation.security);
  console.log(security);

  return (
    <Flex direction="column" gap="2" mt="5">
      <Heading as="h3" size="6" mb="1">
        Authorization
      </Heading>
      <Text></Text>
    </Flex>
  );
}
