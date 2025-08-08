import { Badge, Card, Text, Code, Skeleton, Flex, Heading, HoverCard, Box, Separator, Callout } from "@radix-ui/themes";
import { DocItemContext } from "@site/src/context";
import { ApiClientModalProvider, useApiClientModal } from "@scalar/api-client-react";
import InfoCircledIcon from "/img/icons/info-circled.svg";
import CopyIcon from "/img/icons/copy.svg";
import CheckIcon from "/img/icons/check.svg";
import ExclamationTriangleIcon from "/img/icons/exclamation-triangle.svg";
import { useDocPageData, useLoadOpenApiDocument } from "@site/src/hooks";
import { normalizePath } from "@site/src/lib";
import Link from "@docusaurus/Link";
import { APIRequestMethod } from "@site/src/types";
import ChevronDownIcon from "/img/icons/chevron-down.svg";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { APIRequestParametersCard } from "./APIRequestParametersCard";
import * as Accordion from "@radix-ui/react-accordion";
import { APIRequestSchemaCard } from "./APIRequestSchemaCard";
import type { OpenAPIV3 } from "@scalar/openapi-types";
import "@scalar/api-client-react/style.css";

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
      <APIRequestClient.Provider>{children}</APIRequestClient.Provider>
    </APIRequestContext.Provider>
  );
}

function buildFDIFormattedPath(path: string, apiBasePath: string, tenantType: "single-tenant" | "multi-tenant") {
  return tenantType === "multi-tenant"
    ? `${apiBasePath}/<TENANT_ID>${normalizePath(path)}`
    : `${apiBasePath}${normalizePath(path)}`;
}

export function APIRequestTitle() {
  const { title } = useContext(APIRequestContext);

  return (
    <Heading as="h1" size="6">
      {title}
    </Heading>
  );
}

import Markdown from "react-markdown";
import { APIRequestClient } from "./APIRequestClient";

export function APIRequestDescription() {
  const { operation } = useContext(APIRequestContext);

  if (!operation) return null;
  if (!operation.description) return null;

  // TODO: This is a temp solution. Need to figure out how to use mdx-js
  return (
    <Text color="gray">
      <Markdown>{operation.description}</Markdown>
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
  const [hasCopied, setHasCopied] = useState(false);

  const IconComponent = hasCopied ? CheckIcon : CopyIcon;

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(path);
    setHasCopied(true);
  }, [path]);

  return (
    <Flex gap="5" style={{ maxWidth: "100%" }}>
      <Flex gap="4" align="center" style={{ maxWidth: "100%" }} asChild>
        <Heading
          as="h2"
          size={{
            initial: "4",
            md: "6",
          }}
          mb="0"
        >
          <Text color={MethodToColorMap[method]} align="center">
            {method.toUpperCase()}
          </Text>
          <Flex
            gap="2"
            align="center"
            onMouseLeave={() => setHasCopied(false)}
            onClick={copyToClipboard}
            className="api-request-path-title"
          >
            <Code color="gray" highContrast>
              {path}
            </Code>
            <IconComponent className="api-request-path-title__icon" />
          </Flex>
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
    <Box mt="6">
      <Heading as="h3" size="4" mb="1">
        Path parameters
      </Heading>
      <Separator size="4" mt="3" mb="0" />
      <APIRequestParametersCard parameters={pathParameters} />
    </Box>
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
    <Box mt="6">
      <Heading as="h3" size="4" mb="1">
        Query parameters
      </Heading>
      <Separator size="4" mt="3" mb="0" />
      <APIRequestParametersCard parameters={queryParameters} />
    </Box>
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
    <Box mt="6">
      <Heading as="h3" size="5" mb="1">
        Headers
      </Heading>
      <Separator size="4" mt="3" mb="0" />
      <APIRequestParametersCard parameters={headerParameters} />
    </Box>
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
      <Box mt="6">
        <Heading as="h2" size="6" mb="1">
          Body
        </Heading>
        <Separator size="4" mt="3" mb="0" />
        <Text size="3" color="gray" mb="2" mt="2">
          Use one of the following schemas:
        </Text>

        <Flex direction="column" gap="2">
          {bodySchema.items.map((schemaOption, index) => {
            const itemSchema = schemaOption as OpenAPIV3.SchemaObject;
            return (
              <>
                <Card>
                  <APIRequestSchemaCard key={index} schema={itemSchema} />
                </Card>
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
      </Box>
    );
  }

  if (bodySchema.type === "object" && !bodySchema.properties) {
    return null;
  }

  if (bodySchema.oneOf) {
    return (
      <Box mt="6">
        <Heading as="h3" size="5" mb="1">
          Body
        </Heading>
        <Separator size="4" mt="3" mb="0" />
        <Box mb="2" mt="3">
          <Text size="3" color="gray">
            One of the following schemas can be used:
          </Text>
        </Box>

        <Flex direction="column" gap="2">
          {bodySchema.oneOf.map((schema, index) => {
            const typedSchema = schema as OpenAPIV3.SchemaObject;
            return (
              <Box key={`${schema.type}-${index}`}>
                <Box py="0" asChild>
                  <Card>
                    <APIRequestSchemaCard key={index} schema={typedSchema} />
                  </Card>
                </Box>

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
      </Box>
    );
  }

  return (
    <Box mt="6">
      <Heading as="h3" size="5" mb="1">
        Body
      </Heading>
      <Separator size="4" mt="3" mb="0" />
      <APIRequestSchemaCard schema={bodySchema} />
    </Box>
  );
}

export function APIRequestResponse() {
  const { operation } = useContext(APIRequestContext);

  if (!operation) return null;
  if (!operation.responses) return null;
  const statusCodes = Object.keys(operation.responses);
  if (!statusCodes.length) return null;

  return (
    <Box mt="6">
      <Heading as="h2" size="5" mb="1">
        Responses
      </Heading>
      <Separator size="4" mt="3" mb="0" />
      <Accordion.Root type="multiple" className="api-request-accordion">
        {statusCodes.map((statusCode, index) => {
          const response = operation.responses[statusCode] as OpenAPIV3.ResponseObject;

          const hasContent = response.content && Object.keys(response.content).length > 0;
          const hasHeaders = response?.headers && Object.keys(response.headers).length > 0;

          const firstContentType = hasContent ? Object.keys(response.content)[0] : null;
          const content = hasContent ? response.content[firstContentType] : null;

          let statusCodeColor: "green" | "red" = "green";
          if (statusCode.startsWith("4") || statusCode.startsWith("5")) statusCodeColor = "red";

          return (
            <Accordion.Item
              value={statusCode}
              data-border="true"
              className="api-request-accordion__item"
              key={`${statusCode}-${index}`}
            >
              <Flex direction="row" align="center" gap="2" width="100%" asChild>
                <Accordion.Trigger className="api-request-accordion__trigger" data-border="false">
                  <ChevronDownIcon className="api-request-accordion__icon" aria-hidden />
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
                </Accordion.Trigger>
              </Flex>

              <Accordion.Content className="api-request-accordion__content">
                <Flex direction="column" gap="3" pb="4" mt="3">
                  {hasContent && <APIRequestResponseBody mediaTypeObject={content} mediaType={firstContentType} />}
                  {hasHeaders && (
                    <Flex direction="column" gap="2" mt="2">
                      <Box>
                        <Heading as="h5" size="3" mb="1">
                          Headers
                        </Heading>
                        <Text size="3" color="gray">
                          After a successful request, the following headers will be set.
                        </Text>
                      </Box>
                      <Box py="0" asChild>
                        <Card>
                          <APIRequestParametersCard
                            parameters={
                              Object.keys(response.headers).map((key) => ({
                                name: key,
                                ...response.headers[key],
                              })) as OpenAPIV3.ParameterObject[]
                            }
                          />
                        </Card>
                      </Box>
                    </Flex>
                  )}
                </Flex>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>
    </Box>
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

  if (mediaType !== "application/json" && bodySchema.enum) {
    return (
      <Flex direction="column" gap="2">
        {bodySchema.enum[0]}
      </Flex>
    );
  }

  if (bodySchema.oneOf) {
    return (
      <>
        <Box mb="2">
          <Text size="3" color="gray">
            One of the following body schemas will be returned:
          </Text>
        </Box>
        <Flex direction="column" gap="2">
          {bodySchema.oneOf.map((schema, index) => {
            const typedSchema = schema as OpenAPIV3.SchemaObject;
            return (
              <Box key={`${schema.type}-${index}`}>
                <Box py="0" asChild>
                  <Card>
                    <APIRequestSchemaCard key={index} schema={typedSchema} />
                  </Card>
                </Box>
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
          <Text size="3" color="gray">
            One of the following body schemas will be returned:
          </Text>
        </Box>
        <Flex direction="column" gap="2">
          {bodySchema.items.map((schema, index) => {
            const typedSchema = schema as OpenAPIV3.SchemaObject;
            return (
              <Box>
                <Box py="0" asChild>
                  <Card>
                    <APIRequestSchemaCard key={index} schema={typedSchema} />
                  </Card>
                </Box>
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

      <Box py="0" asChild>
        <Card>
          <APIRequestSchemaCard schema={bodySchema} />
        </Card>
      </Box>
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
        <HoverCard.Content align="end">
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

  const securityRequirements = useMemo(() => {
    if (!operation) return [];
    if (!operation.security) return [];
    if (!security) return [];

    return operation.security
      .map((securityRequirement) => {
        const requirementName = Object.keys(securityRequirement)[0];
        const req = security[requirementName] as OpenAPIV3.SecuritySchemeObject | null;
        return req;
      })
      .filter((v) => v);
  }, [security]);

  return (
    <Box p="0" asChild>
      <Accordion.Root type="multiple" className="api-request-accordion">
        <Accordion.Item value="authorization" className="api-request-accordion__item">
          <Flex direction="row" align="center" gap="2" width="100%" asChild>
            <Accordion.Trigger className="api-request-accordion__trigger" disabled={securityRequirements.length === 0}>
              {securityRequirements.length > 0 && (
                <ChevronDownIcon className="api-request-accordion__icon" aria-hidden />
              )}
              <Flex direction="row" gap="2" align="center" mb="0" asChild>
                <Accordion.Header>
                  <Heading as="h3" size="5" mb="0">
                    Authorization
                  </Heading>
                </Accordion.Header>
              </Flex>

              <Code size="3" color={securityRequirements.length ? "red" : "gray"} ml="auto">
                {securityRequirements.length ? "Required" : "None"}
              </Code>
            </Accordion.Trigger>
          </Flex>

          <Accordion.Content className="api-request-accordion__content">
            <Flex direction="column">
              {securityRequirements.map((securityRequirement, index) => {
                return <APISecuritySchemeItem scheme={securityRequirement} />;
              })}
            </Flex>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </Box>
  );
}

function APISecuritySchemeItem({ scheme }: { scheme: OpenAPIV3.SecuritySchemeObject }) {
  if (scheme.type === "http") {
    return (
      <Box px="0" py="2" className="api-request-parameters-card__parameter">
        <Flex direction="column" gap="1">
          <Flex gap="1" align="center">
            <Code size="4" variant="ghost" asChild>
              <span>{scheme.scheme}</span>
            </Code>

            <Code size="2" color="gray">
              {scheme.type}
            </Code>
          </Flex>
          <Text size="3" color="gray">
            {scheme.description}
          </Text>
        </Flex>
      </Box>
    );
  }

  if (scheme.type === "apiKey") {
    return (
      <Box px="0" py="2" className="api-request-parameters-card__parameter">
        <Flex direction="column" gap="1">
          <Flex gap="1" align="center">
            <Code size="4" variant="ghost" asChild>
              <span>{scheme.name}</span>
            </Code>

            <Code size="2" color="gray">
              {scheme.in}
            </Code>
          </Flex>
          <Text size="3" color="gray">
            {scheme.description}
          </Text>
        </Flex>
      </Box>
    );
  }

  return null;
}

export function APIRequestSkeleton({ children }: { children?: React.ReactNode }) {
  const { operation, title } = useContext(APIRequestContext);

  if (operation) return children;

  return (
    <Flex direction="column" width="100%" gap="9">
      <Box mb="4">
        <Heading
          as="h1"
          size={{
            initial: "7",
            md: "8",
          }}
        >
          {title}
        </Heading>
        <Flex align="center">
          <APIRequestPath />
          <Box ml="auto" display={{ initial: "none", md: "block" }}>
            <APIRequestApiTypeBadge />
          </Box>
        </Flex>{" "}
      </Box>
      <Box>
        <Skeleton height="600px" />
      </Box>
    </Flex>
  );
}
