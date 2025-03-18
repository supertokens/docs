import { useDocPageData, useLoadOpenApiSchema } from "@site/src/hooks";
import { Select } from "@radix-ui/themes";
import { APIRequest, APIRequestMethod, APIRequestSchema } from "@site/src/types";
import React, { useState, useMemo, useContext, createContext } from "react";
import {
  Flex,
  Box,
  Heading,
  SegmentedControl,
  Code,
  Badge,
  Card,
  Button,
  Text,
  Separator,
  ScrollArea,
} from "@radix-ui/themes";
import CodeBlock from "@theme/CodeBlock";
import useBrokenLinks from "@docusaurus/useBrokenLinks";
import { SideModal } from "../Modal";
import InfoIcon from "/img/icons/info.svg";

import "../Cards/HTTPRequestCard.scss";
import { docPageStore, generateCodeSnippetFromAPIRequest, normalizePath } from "@site/src/lib";
import { DocItemContext } from "@site/src/context";

type RequestEnvironment = "shell" | "nodejs" | "python" | "go";

type APIRequestContextType = {
  environment: RequestEnvironment;
  path: string;
  method: APIRequestMethod;
  title: string;
  isDetailsModalOpen: boolean;
  schema: APIRequest | null;
  apiName: "fdi" | "cdi";
};

const APIRequestContext = createContext<APIRequestContextType>({} as APIRequestContextType);

const FDIPathsWithoutTenantId = [
  "/totp/device",
  "/totp/device/remove",
  "/totp/device/verify",
  "/totp/verify",
  "/mfa/info",
  "/jwt/jwks.json",
  "/totp/device/list",
  "/user/email/verify",
  "/.well-known_openid-configuration",
];

export function FDIRequestCard({ method, path, title }: { path: string; method: APIRequestMethod; title: string }) {
  const { appInfo } = useContext(DocItemContext);

  const tenantType = useDocPageData("tenantType");
  const openApiRequestPath = useMemo(() => {
    const normalizedPath = normalizePath(path);
    if (FDIPathsWithoutTenantId.includes(normalizedPath)) return `{apiBasePath}${normalizedPath}`;
    return `{apiBasePath}/<tenantId>${normalizedPath}`;
  }, [path]);

  const schema = useLoadOpenApiSchema("fdi", openApiRequestPath, method);
  const [selectedEnvironment, setSelectedEnvironment] = useState<RequestEnvironment>("shell");
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
        environment: selectedEnvironment,
        path: formattedRequestPath,
        method,
        title,
        isDetailsModalOpen: showRequestDetails,
        schema: parsedSchema,
        apiName: "fdi",
      }}
    >
      <SideModal.Root open={showRequestDetails} onOpenChange={setShowRequestDetails}>
        <Box p="0" asChild>
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
                <Button variant="solid" color="gray" highContrast>
                  <InfoIcon /> View Details
                </Button>
              </SideModal.Trigger>
            </Flex>
            <Flex px="4" direction="column" gap="4" pb="4">
              <SegmentedControl.Root
                defaultValue="shell"
                value={selectedEnvironment}
                onValueChange={(value) => setSelectedEnvironment(value as RequestEnvironment)}
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
          </Card>
        </Box>

        {schema && (
          <DetailsModal>
            {schema.parameters && Object.keys(schema.parameters).length > 0 && (
              <Section title="Request Parameters">
                <ParametersTable parameters={schema.parameters} />
              </Section>
            )}

            {schema.headers && Object.keys(schema.headers).length > 0 && (
              <Section title="Request Headers">
                <HeadersTable headers={schema.headers} />
              </Section>
            )}

            {schema.body.schema && Object.keys(schema.body.schema).length > 0 && (
              <Section title="Request Body">
                <SchemaCard schema={schema.body.schema["application/json"]} />
              </Section>
            )}

            {schema.responses && Object.keys(schema.responses).length > 0 && (
              <Section title="Responses">
                {Object.entries(schema.responses).map(([statusCode, response]) => (
                  <ResponseSection key={statusCode} statusCode={statusCode} response={response} />
                ))}
              </Section>
            )}
          </DetailsModal>
        )}
      </SideModal.Root>
    </APIRequestContext.Provider>
  );
}

function CodeSnippetSection({ environment }: { environment: RequestEnvironment }) {
  const { schema, environment: activeEnvironment } = useContext(APIRequestContext);
  const tenantType = useDocPageData("tenantType");

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
  if (environment !== activeEnvironment) return null;

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

function DetailsModal({ children }: { children: React.ReactNode }) {
  const { title, method, path, schema } = useContext(APIRequestContext);

  return (
    <ScrollArea type="auto" style={{ height: "100%" }}>
      <SideModal.Content style={{ paddingTop: "0", paddingBottom: "0" }} className="http-request-card-details-modal">
        <Flex
          direction="column"
          pt="6"
          gap="1"
          style={{
            position: "sticky",
            top: 0,
            background: "var(--color-panel-solid)",
            zIndex: 10,
          }}
        >
          <Heading as="h1" color="orange" asChild>
            <SideModal.Title>{title}</SideModal.Title>
          </Heading>
          <Flex px="1" style={{ alignSelf: "flex-start" }} mb="3" asChild>
            <Code weight="bold" variant="ghost" color="gray" size="3">
              {method.toUpperCase()} {path}
            </Code>
          </Flex>

          {schema.description && (
            <Text color="gray" size="3">
              {schema.description}
            </Text>
          )}

          <Separator size="4" mt="3" />
        </Flex>

        <Flex direction="column" gap="4" flexGrow="1">
          {children}
        </Flex>

        <Flex
          direction="row"
          align="center"
          justify="end"
          pb="6"
          pt="3"
          style={{
            position: "sticky",
            zIndex: 10,
            bottom: 0,
            background: "var(--color-panel-solid)",
          }}
        >
          <SideModal.Close>
            <Button variant="solid" color="gray" highContrast size="2">
              Close
            </Button>
          </SideModal.Close>
        </Flex>
      </SideModal.Content>
    </ScrollArea>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Flex direction="column" gap="2">
      <Heading as="h2" size="5" mb="1">
        {title}
      </Heading>
      {children}
    </Flex>
  );
}

function SchemaCard({ schema, nestingLevel = 0 }: { schema: APIRequestSchema; nestingLevel?: number }) {
  const properties = schema.properties;
  const propertiesNames = Object.keys(schema.properties);
  return (
    <Box p="0" asChild>
      <Card>
        {propertiesNames.map((propName, index) => (
          <>
            <Box px="4" py="3">
              <Flex direction="column" gap="2">
                <Flex gap="1" align="center">
                  <Text size="3">{propName}</Text>
                  <Code size="2" color="gray">
                    {properties[propName].type}
                  </Code>
                  <Text size="2" color="red">
                    required
                  </Text>
                </Flex>
                {properties[propName].description && (
                  <Text size="3" color="gray" weight="bold">
                    {properties[propName].description}
                  </Text>
                )}
              </Flex>
              {index + 1 < propertiesNames.length ? <Separator /> : null}
            </Box>
          </>
        ))}
      </Card>
    </Box>
  );
}

function ParametersTable({ parameters }: { parameters: APIRequest["parameters"] }) {
  if (!parameters) return null;

  return (
    <Box style={{ overflowX: "auto" }}>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(parameters).map(([name, param]) => (
            <tr key={name}>
              <td>
                <Code>{name}</Code>
              </td>
              <td>{param.schema?.type || "string"}</td>
              <td>{param.required ? "Yes" : "No"}</td>
              <td>{param.description || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}

function HeadersTable({ headers }: { headers: APIRequest["headers"] }) {
  return (
    <Box style={{ overflowX: "auto" }}>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(headers).map(([name, header]) => (
            <tr key={name}>
              <td>
                <Code>{name}</Code>
              </td>
              <td>{header.required ? "Yes" : "No"}</td>
              <td>{header.description || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}

function BodySection({ body }: { body: APIRequest["body"] }) {
  if (!body.schema) return null;

  // Get the first content type schema (usually application/json)
  const firstContentType = Object.keys(body.schema)[0];
  const schema = body.schema[firstContentType];

  // Create example from schema if available
  let example = {};
  if (schema.properties) {
    Object.entries(schema.properties).forEach(([prop, details]) => {
      if (details.example) {
        example[prop] = details.example;
      } else if (details.type === "string") {
        example[prop] = "string";
      } else if (details.type === "number") {
        example[prop] = 0;
      } else if (details.type === "boolean") {
        example[prop] = false;
      } else if (details.type === "array") {
        example[prop] = [];
      } else if (details.type === "object") {
        example[prop] = {};
      }
    });
  }

  return (
    <Flex direction="column" gap="3">
      <Text size="3" color="gray">
        Content Type: <Code>{firstContentType}</Code>
      </Text>

      {schema.properties && (
        <>
          <Text weight="bold" size="3">
            Properties:
          </Text>
          <Box style={{ overflowX: "auto" }}>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Required</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(schema.properties).map(([name, prop]) => (
                  <tr key={name}>
                    <td>
                      <Code>{name}</Code>
                    </td>
                    <td>{prop.type}</td>
                    <td>{schema.required?.includes(name) ? "Yes" : "No"}</td>
                    <td>{prop.description || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          <Text weight="bold" size="3">
            Example:
          </Text>
          <CodeBlock language="json">{JSON.stringify(example, null, 2)}</CodeBlock>
        </>
      )}
    </Flex>
  );
}

function ResponseSection({ statusCode, response }: { statusCode: string; response: APIRequest["responses"][string] }) {
  // Get the first content type schema (usually application/json)
  const hasContent = response.content && Object.keys(response.content).length > 0;
  const firstContentType = hasContent ? Object.keys(response.content!)[0] : null;
  const schema = firstContentType ? response.content![firstContentType].schema : null;

  return (
    <Box mb="4">
      <Flex direction="row" align="center" gap="2">
        <Code
          color={
            statusCode.startsWith("2")
              ? "green"
              : statusCode.startsWith("4") || statusCode.startsWith("5")
                ? "red"
                : "gray"
          }
        >
          {statusCode}
        </Code>
        <Text size="3">{response.description}</Text>
      </Flex>

      {hasContent && schema && (
        <Box mt="2">
          <Text size="3" color="gray">
            Content Type: <Code>{firstContentType}</Code>
          </Text>

          {schema.properties && (
            <>
              <Text weight="bold" size="3" mt="2">
                Properties:
              </Text>
              <Box style={{ overflowX: "auto" }}>
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(schema.properties).map(([name, prop]) => (
                      <tr key={name}>
                        <td>
                          <Code>{name}</Code>
                        </td>
                        <td>{prop.type}</td>
                        <td>{prop.description || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </>
          )}
        </Box>
      )}

      {response.headers && Object.keys(response.headers).length > 0 && (
        <Box mt="2">
          <Text weight="bold" size="3">
            Headers:
          </Text>
          <Box style={{ overflowX: "auto" }}>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(response.headers).map(([name, header]) => (
                  <tr key={name}>
                    <td>
                      <Code>{name}</Code>
                    </td>
                    <td>{header.description || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      )}
    </Box>
  );
}
