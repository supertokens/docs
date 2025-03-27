import { useDocPageData, useLoadOpenApiSchema } from "@site/src/hooks";
import { Select } from "@radix-ui/themes";
import { APIRequest, APIRequestMethod, APIRequestSchema } from "@site/src/types";

import ChevronDownIcon from "/img/icons/chevron-down.svg";
import React, { useState, useMemo, useContext, createContext } from "react";
import {
  Flex,
  Box,
  Heading,
  TextField,
  SegmentedControl,
  Code,
  Badge,
  Card,
  Button,
  Text,
  Separator,
  ScrollArea,
} from "@radix-ui/themes";
import * as RadixAccordion from "@radix-ui/react-accordion";
import CodeBlock from "@theme/CodeBlock";
import useBrokenLinks from "@docusaurus/useBrokenLinks";
import { SideModal } from "../Modal";
import InfoIcon from "/img/icons/info.svg";

import "../Cards/HTTPRequestCard.scss";
import {
  docPageStore,
  generateCodeSnippetFromAPIRequest,
  generateJSONSnippetFromAPIRequestResponse,
  normalizePath,
} from "@site/src/lib";
import { DocItemContext } from "@site/src/context";

import "./APIRequestCard.scss";

type RequestEnvironment = "shell" | "nodejs" | "python" | "go";

type APIRequestContextType = {
  path: string;
  method: APIRequestMethod;
  title: string;
  isDetailsModalOpen: boolean;
  schema: APIRequest | null;
  apiName: "fdi" | "cdi";
};

const APIRequestContext = createContext<APIRequestContextType>({} as APIRequestContextType);

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

export function FDIRequestCard({ method, path, title }: { path: string; method: APIRequestMethod; title: string }) {
  const { appInfo } = useContext(DocItemContext);
  const tenantType = useDocPageData("tenantType");

  const openApiRequestPath = useMemo(() => {
    const normalizedPath = normalizePath(path);
    const pathWithoutTenantId = FDIPathsWithoutTenantId.find((path) => path.path === normalizedPath);
    if (pathWithoutTenantId && pathWithoutTenantId.method === method) return `{apiBasePath}${normalizedPath}`;
    return `{apiBasePath}/<tenantId>${normalizedPath}`;
  }, [path, method]);

  const schema = useLoadOpenApiSchema("fdi", openApiRequestPath, method);
  const [showRequestDetails, setShowRequestDetails] = useState(false);

  const formattedRequestPath = useMemo(() => {
    const apiBasePath = appInfo.apiBasePath || "/auth";
    return tenantType === "multi-tenant"
      ? `${apiBasePath}/<TENANT_ID>${normalizePath(path)}`
      : `${apiBasePath}${normalizePath(path)}`;
  }, [appInfo, tenantType]);

  const parsedSchema = useMemo(() => {
    if (!schema) return null;
    return {
      ...schema,
      path: formattedRequestPath,
    };
  }, [schema, formattedRequestPath]);

  const titleId = useMemo(() => {
    return `${title.replace(/\s/g, "-").toLowerCase()}-request`;
  }, [title]);

  const brokenLinks = useBrokenLinks();
  brokenLinks.collectAnchor(titleId);

  return (
    <APIRequestContext.Provider
      value={{
        path: formattedRequestPath,
        method,
        title,
        isDetailsModalOpen: showRequestDetails,
        schema: parsedSchema,
        apiName: "fdi",
      }}
    >
      <SideModal.Root open={showRequestDetails} onOpenChange={setShowRequestDetails}>
        <Box p="0" className="api-request-card" asChild>
          <Card mb="4" className="http-request-card">
            <Flex direction="row" pt="4" pb="3" px="4" justify="between">
              <Flex direction="column" gap="2">
                <Heading as="h3" mb="xs" size="6" style={{ scrollMarginTop: "200px" }}>
                  {title}
                  <a className="http-request-card__heading-anchor" id={titleId} />
                </Heading>
                <Flex px="1" gap="2" align="center">
                  <Badge variant="soft" color="orange" size="2" radius="medium">
                    FDI
                  </Badge>

                  <Code weight="bold" variant="soft" color="gray" size="2">
                    {`${method.toUpperCase()} ${formattedRequestPath}`}
                  </Code>
                </Flex>
              </Flex>

              <SideModal.Trigger>
                <Button variant="solid" color="gray" highContrast disabled={!schema}>
                  <InfoIcon /> View Details
                </Button>
              </SideModal.Trigger>
            </Flex>

            <Box px="4" pb="4">
              <APIRequestLanguageSegmentedControl />
            </Box>
          </Card>
        </Box>

        {schema && <APIRequestDetailsModalContent />}
      </SideModal.Root>
    </APIRequestContext.Provider>
  );
}

function APIRequestLanguageSegmentedControl() {
  const language = useDocPageData("apiRequestExampleLanguage");

  return (
    <Flex direction="column" gap="4">
      <SegmentedControl.Root
        defaultValue="shell"
        value={language}
        onValueChange={(value) => docPageStore.updateValue("apiRequestExampleLanguage", value)}
      >
        <SegmentedControl.Item value="shell">Shell</SegmentedControl.Item>
        <SegmentedControl.Item value="nodejs">NodeJS</SegmentedControl.Item>
        <SegmentedControl.Item value="python">Python</SegmentedControl.Item>
        <SegmentedControl.Item value="go">Go</SegmentedControl.Item>
      </SegmentedControl.Root>
      <CodeSnippetSection environment="shell" />
      <CodeSnippetSection environment="nodejs" />
      <CodeSnippetSection environment="python" />
      <CodeSnippetSection environment="go" />
    </Flex>
  );
}

function CodeSnippetSection({ environment }: { environment: RequestEnvironment }) {
  const { schema } = useContext(APIRequestContext);
  const tenantType = useDocPageData("tenantType");
  const apiRequestExampleLanguage = useDocPageData("apiRequestExampleLanguage");

  const title = useMemo(() => {
    if (environment === "shell") return "Curl Example";
    if (environment === "nodejs") return "Fetch Example";
    if (environment === "python") return "Requests Example";
    if (environment === "go") return "HTTP Example";
  }, [environment]);

  const language = useMemo(() => {
    if (environment === "shell") return "bash";
    if (environment === "nodejs") return "typescript";
    if (environment === "python") return "python";
    if (environment === "go") return "go";
  }, [environment]);

  const snippet = useMemo(() => {
    if (!schema) return null;
    return generateCodeSnippetFromAPIRequest("<API_DOMAIN>", schema, environment);
  }, [schema, environment]);

  if (!schema) return null;
  if (environment !== apiRequestExampleLanguage) return null;

  return (
    <Flex direction="column" gap="2">
      <Flex direction="row" justify="between" align="center">
        <Text color="gray" size="3" weight="bold">
          {title}
        </Text>
        <Select.Root
          value={tenantType}
          onValueChange={(value) => docPageStore.updateValue("tenantType", value as "single-tenant" | "multi-tenant")}
        >
          <Select.Trigger variant="ghost" color="gray" mr="xs" />
          <Select.Content>
            <Select.Item value="single-tenant">Single Tenant</Select.Item>
            <Select.Item value="multi-tenant">Multi Tenant</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>
      <CodeBlock language={language}>{snippet}</CodeBlock>
    </Flex>
  );
}

function APIRequestDetailsModalContent() {
  const { title, method, path, schema } = useContext(APIRequestContext);

  return (
    <ScrollArea type="auto" style={{ height: "100%" }}>
      <SideModal.Content style={{ paddingTop: "0", paddingBottom: "0", width: "100%" }}>
        <Flex direction="column" px="4" pt="6" position="relative">
          <Flex direction="row" align="center" asChild>
            <Heading as="h1" color="orange" align="center" size="7" asChild>
              <SideModal.Title>
                {title}
                <Badge ml="2" variant="soft" color="orange" size="3" radius="medium">
                  FDI
                </Badge>
              </SideModal.Title>
            </Heading>
          </Flex>
          {schema.description && (
            <Text color="gray" size="3">
              {schema.description}
            </Text>
          )}
          <SideModal.Close>
            <Button
              variant="solid"
              color="gray"
              highContrast
              size="2"
              style={{ position: "absolute", top: 30, right: 20 }}
            >
              Close
            </Button>
          </SideModal.Close>
          <Separator size="4" mt="4" mb="2" />
        </Flex>

        <Flex direction="row" gap="7" px="4" pb="6" position="relative">
          <Flex direction="column" flexGrow="1">
            <Heading as="h2" size="6" mb="0">
              Request
            </Heading>

            <Flex px="2" style={{ alignSelf: "flex-start" }} mt="3" asChild>
              <Code weight="bold" variant="ghost" color="gray" size="5">
                {method.toUpperCase()} {path}
              </Code>
            </Flex>

            <APIRequestDetailsModalPathParameters />

            <APIRequestDetailsModalQueryParameters />

            <APIRequestDetailsModalRequestHeaders />

            <APIRequestDetailsModalBody />

            <Separator size="4" mt="6" mb="4" />

            <Heading as="h2" size="6" mb="1">
              Response
            </Heading>

            {schema.responses && Object.keys(schema.responses).length > 0 && (
              <>
                {Object.entries(schema.responses).map(([statusCode, response]) => (
                  <APIRequestResponse key={statusCode} statusCode={statusCode} response={response} />
                ))}
              </>
            )}
          </Flex>
          <Flex direction="column" gap="2" style={{ width: "40%" }}>
            <Box style={{ position: "sticky", top: 20 }}>
              <APIRequestLanguageSegmentedControl />

              <APIRequestResponsePreview />
            </Box>
          </Flex>
        </Flex>
      </SideModal.Content>
    </ScrollArea>
  );
}

function APIRequestDetailsModalPathParameters() {
  const { schema } = useContext(APIRequestContext);

  const pathParameters = useMemo(() => {
    if (!schema.parameters) return null;
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

function APIRequestDetailsModalQueryParameters() {
  const { schema } = useContext(APIRequestContext);

  const queryParameters = useMemo(() => {
    if (!schema.parameters) return null;
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

function APIRequestDetailsModalBody() {
  const { schema } = useContext(APIRequestContext);

  if (!schema.body.schema || Object.keys(schema.body.schema).length === 0) return null;

  const jsonSchema = schema.body.schema["application/json"];
  if (!jsonSchema) return null;

  if (Array.isArray(jsonSchema)) {
    return (
      <Flex direction="column" gap="2" mt="5">
        <Heading as="h3" size="3" mb="1">
          Body Schema
        </Heading>
        <Text size="3" color="gray">
          One of the following schemas apply:
        </Text>
        <Flex direction="column" gap="2">
          {jsonSchema.map((schemaOption, index) => (
            <APIRequestSchemaCard key={index} schema={schemaOption} />
          ))}
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="2" mt="5">
      <Heading as="h3" size="4" mb="1">
        Body
      </Heading>
      <APIRequestSchemaCard schema={jsonSchema} />
    </Flex>
  );
}

function APIRequestDetailsModalRequestHeaders() {
  const { schema } = useContext(APIRequestContext);

  const headerParameters = useMemo(() => {
    if (!schema.parameters) return null;
    return Object.keys(schema.parameters).reduce((acc, param) => {
      if (schema.parameters[param].in === "header") {
        acc[param] = schema.parameters[param];
      }
      return acc;
    }, {});
  }, [schema]);

  if (!schema.parameters || Object.keys(headerParameters).length === 0) return null;

  return (
    <Flex direction="column" gap="2" mt="5">
      <Heading as="h3" size="4" mb="1">
        Headers
      </Heading>
      <APIRequestParametersCard parameters={headerParameters} />
    </Flex>
  );
}

function APIRequestParametersCard({ parameters }: { parameters: APIRequest["parameters"] }) {
  const propertiesNames = Object.keys(parameters);

  return (
    <Box p="0" asChild>
      <Card>
        {propertiesNames.map((propName, index) => (
          <>
            <Box px="4" py="3">
              <Flex direction="column" gap="2">
                <Flex gap="1" align="center">
                  <Text size="3" weight="bold">
                    {propName}
                  </Text>
                  {parameters[propName].required && (
                    <Text size="2" color="red">
                      required
                    </Text>
                  )}
                </Flex>
                {parameters[propName].description && (
                  <Text size="3" color="gray">
                    {parameters[propName].description}
                  </Text>
                )}
              </Flex>
            </Box>
            {index + 1 < propertiesNames.length ? <Separator size="4" /> : null}
          </>
        ))}
      </Card>
    </Box>
  );
}

function APIRequestSchemaCard({
  schema,
  name = "",
  nestingLevel = 0,
}: {
  schema: APIRequestSchema;
  name?: string;
  nestingLevel?: number;
}) {
  const properties = schema.properties;
  const propertiesNames = Object.keys(schema.properties);

  if (nestingLevel > 4) {
    throw new Error("Nesting level too deep. Use a different UI element for this.");
  }

  if (name && nestingLevel > 0) {
    return (
      <Box p="0" asChild>
        <Card asChild>
          <Flex p="0" direction="column" gap="0" align="stretch" asChild>
            <RadixAccordion.Root type="multiple">
              <RadixAccordion.Item value={name}>
                <Flex asChild>
                  <Heading size="2" as="h4" mb="0" asChild>
                    <RadixAccordion.Header>
                      <Flex justify="between" align="center" px="3" py="2" asChild flexGrow="1">
                        <RadixAccordion.Trigger className="api-request-card__accordion-trigger">
                          {name}
                          <ChevronDownIcon className="api-request-card__accordion-trigger-icon" aria-hidden />
                        </RadixAccordion.Trigger>
                      </Flex>
                    </RadixAccordion.Header>
                  </Heading>
                </Flex>
                <RadixAccordion.Content>
                  <SchemaPropertiesCard schema={schema} nestingLevel={nestingLevel} />
                </RadixAccordion.Content>
              </RadixAccordion.Item>
            </RadixAccordion.Root>
          </Flex>
        </Card>
      </Box>
    );
  }

  return (
    <Box p="0" asChild>
      <Card>
        <SchemaPropertiesCard schema={schema} nestingLevel={nestingLevel} />
      </Card>
    </Box>
  );
}

function isRequired(schema: APIRequestSchema, propName: string) {
  if (schema.required && schema.required.includes(propName)) return true;
  return schema.properties[propName].required;
}

function SchemaPropertiesCard({ schema, nestingLevel }: { schema: APIRequestSchema; nestingLevel: number }) {
  const properties = schema.properties;
  const propertiesNames = Object.keys(schema.properties);

  return (
    <>
      {propertiesNames.map((propName, index) => {
        return (
          <>
            <Box px="4" py="3">
              <Flex direction="column" gap="2">
                <Flex align="center" justify="between">
                  <Flex align="center" gap="1">
                    <Text size="3" weight="bold">
                      {propName}
                    </Text>
                    <Code size="2" color="gray">
                      {properties[propName].type}
                    </Code>
                    {isRequired(schema, propName) ? (
                      <Text size="2" color="red">
                        required
                      </Text>
                    ) : null}
                  </Flex>
                  <PropertyExample schema={properties[propName]} propName={propName} />
                </Flex>
                {properties[propName].description && (
                  <Text size="3" color="gray">
                    {properties[propName].description}
                  </Text>
                )}
                {properties[propName].type === "object" && properties[propName].properties ? (
                  <APIRequestSchemaCard
                    schema={properties[propName]}
                    nestingLevel={nestingLevel + 1}
                    name={properties[propName].title || propName}
                  />
                ) : null}
                {properties[propName].type === "array" && properties[propName].items.type === "object" ? (
                  <APIRequestSchemaCard
                    schema={properties[propName].items}
                    nestingLevel={nestingLevel + 1}
                    name="Array Items"
                  />
                ) : null}
              </Flex>
            </Box>
            {index + 1 < propertiesNames.length ? <Separator size="4" /> : null}
          </>
        );
      })}
    </>
  );
}

function PropertyExample({ schema, propName }: { schema: APIRequestSchema; propName: string }) {
  if (!schema.properties) return null;
  const propertySchema = schema.properties[propName];
  if (propertySchema.type === "object" || propertySchema.type === "array") return null;

  if (propertySchema.enum && propertySchema.enum.length > 1) {
    return (
      <Select.Root defaultValue={propertySchema.enum[0]}>
        <Select.Trigger variant="ghost" color="gray" mr="xs" />
        <Select.Content>
          {propertySchema.enum.map((value, index) => (
            <Select.Item key={index} value={value}>
              {value}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    );
  }

  let value = propertySchema.example || propertySchema.default || "";
  if (propertySchema.enum) value = propertySchema.enum[0];

  if (!value) return null;
  return <TextField.Root defaultValue={value} disabled />;
}

function formatLabel(label: string) {
  const snakeCaseConverted = label.replace(/_([a-z])/g, (_, letter) => ` ${letter.toUpperCase()}`);
  const camelCaseConverted = snakeCaseConverted.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return camelCaseConverted
    .split(" ")
    .map((word, index) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();
}

function APIRequestResponse({
  statusCode,
  response,
}: {
  statusCode: string;
  response: APIRequest["responses"][string];
}) {
  const statusCodeColor = useMemo(() => {
    if (statusCode.startsWith("2")) return "green";
    if (statusCode.startsWith("4") || statusCode.startsWith("5")) return "red";
    return "gray";
  }, [statusCode]);

  const hasContent = response.content && Object.keys(response.content).length > 0;
  const hasHeaders = response?.headers && Object.keys(response.headers).length > 0;
  const firstContentType = Object.keys(response.content)[0];
  const hasApplicationJsonContent = firstContentType === "application/json";
  const content = hasContent ? response.content[firstContentType] : null;
  const schema = content?.schema;

  return (
    <Box mb="4" mt="4">
      <Flex direction="row" align="center" gap="2">
        <Code size="4" color={statusCodeColor}>
          {statusCode}
        </Code>
        <Box mb="0" asChild>
          <Heading as="h4" size="4">
            {response.description}
          </Heading>
        </Box>
      </Flex>
      {hasContent && schema && (
        <Box mt="2">
          <Code size="3" color="gray">
            {firstContentType}
          </Code>
        </Box>
      )}

      {schema && Array.isArray(schema) && hasApplicationJsonContent ? (
        <>
          <Box mb="1">
            <Text size="3" color="gray">
              One of the following response schemas will be returned:
            </Text>
          </Box>
          <Flex direction="column" gap="2">
            {schema.map((schemaOption, index) => (
              <Box mb="3">
                <APIRequestSchemaCard key={index} schema={schemaOption} />
              </Box>
            ))}
          </Flex>
        </>
      ) : null}

      {schema && !Array.isArray(schema) && hasApplicationJsonContent ? <APIRequestSchemaCard schema={schema} /> : null}

      {hasHeaders && (
        <Flex direction="column" gap="2">
          <Heading as="h3" size="4" mb="1" mt="2">
            Headers
          </Heading>
          <APIRequestParametersCard parameters={response.headers} />
        </Flex>
      )}
    </Box>
  );
}

function APIRequestResponsePreview() {
  const { schema } = useContext(APIRequestContext);

  const jsonSnippet = useMemo(() => {
    if (!schema) return null;

    return generateJSONSnippetFromAPIRequestResponse(schema.responses);
  }, [schema]);

  if (!jsonSnippet) return null;

  return (
    <Box p="0" asChild>
      <Card>
        <Flex px="4" py="3" justify="between">
          <Heading as="h3" size="5" mb="0">
            Response
          </Heading>
        </Flex>
        <CodeBlock language="json">{jsonSnippet}</CodeBlock>
      </Card>
    </Box>
  );
}
