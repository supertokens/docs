import { Text, Flex, Button, Select, Card, Separator } from "@radix-ui/themes";
import { useDocPageData, useLoadOpenApiDocument } from "@site/src/hooks";
import {
  DocPageState,
  docPageStore,
  generateCodeSnippetFromAPIRequest,
  replaceVariablesForScalar,
  replaceVariablesInApiPath,
} from "@site/src/lib";
import CodeBlock from "@site/src/theme/CodeBlock";
import { useCallback, useContext, useMemo } from "react";
import { useApiClientModal } from "@scalar/api-client-react";
import { APIRequestContext } from "./APIRequest";
import * as z from "zod";
import { APIRequestClient } from "./APIRequestClient";
import { APIRequestEditParametersModal } from "./APIRequestEditParametersModal";
import { Play, Edit } from "lucide-react";

export function APIRequestCodeSnippetSegmentedControl() {
  const language = useDocPageData("apiRequestExampleLanguage");
  const { apiName } = useContext(APIRequestContext);
  const apiDomain = useDocPageData("apiDomain");
  const coreDomain = useDocPageData("coreDomain");
  const apiDocument = useLoadOpenApiDocument(apiName);

  const { path, method } = useContext(APIRequestContext);
  const apiClient = useApiClientModal();

  const title = useMemo(() => {
    if (language === "shell") return "Curl Example";
    if (language === "nodejs") return "Fetch Example";
    if (language === "python") return "Requests Example";
    if (language === "go") return "HTTP Example";
  }, [language]);

  const shouldConfigureServer = useMemo(() => {
    const server = apiName === "fdi" ? apiDomain : coreDomain;
    return !z.string().url().safeParse(server).success;
  }, [apiName, apiDomain, coreDomain]);

  const onEditConfigurationSuccess = useCallback(
    async (data) => {
      if (!apiClient) return;
      await apiClient.updateConfig({
        content: replaceVariablesForScalar(apiDocument, apiName, data),
      });
      if (!shouldConfigureServer) return;
      apiClient.open({ path: replaceVariablesInApiPath(path, data), method });
    },
    [shouldConfigureServer, apiClient, path, method, apiDocument, apiName],
  );

  return (
    <Flex direction="column" gap="4" p="0" asChild>
      <Card className="api-request-code-snippet">
        <Flex direction="row" justify="between" align="center" px="3" py="2">
          <Text color="gray" size="3" weight="bold">
            {title}
          </Text>

          <Select.Root
            value={language}
            onValueChange={(value) =>
              docPageStore.updateValue("apiRequestExampleLanguage", value as DocPageState["apiRequestExampleLanguage"])
            }
          >
            <Select.Trigger variant="ghost" color="gray" mr="xs" />
            <Select.Content>
              <Select.Item value="shell">Shell</Select.Item>
              <Select.Item value="nodejs">Javascript</Select.Item>
              <Select.Item value="python">Python</Select.Item>
              <Select.Item value="go">Go</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
        <Separator size="4" />
        <CodeSnippetSection language="shell" />
        <CodeSnippetSection language="nodejs" />
        <CodeSnippetSection language="python" />
        <CodeSnippetSection language="go" />
        <Flex justify="end" px="3" py="2" gap="2">
          <APIRequestEditParametersModal.Root onSuccess={onEditConfigurationSuccess}>
            <APIRequestEditParametersModal.Trigger>
              <Button color="gray" highContrast variant="outline" size="1">
                <Edit width="12px" /> Configure Server
              </Button>
            </APIRequestEditParametersModal.Trigger>
            {shouldConfigureServer ? (
              <APIRequestEditParametersModal.Trigger>
                <Button variant="solid" highContrast color="gray" size="1">
                  <Play width="12px" /> Test Request
                </Button>
              </APIRequestEditParametersModal.Trigger>
            ) : (
              <APIRequestClient.Trigger>
                <Button variant="solid" highContrast color="gray" size="1">
                  <Play width="12px" /> Test Request
                </Button>
              </APIRequestClient.Trigger>
            )}
          </APIRequestEditParametersModal.Root>
        </Flex>
      </Card>
    </Flex>
  );
}

function CodeSnippetSection({ language }: { language: DocPageState["apiRequestExampleLanguage"] }) {
  const { operation, security, method, path, apiName } = useContext(APIRequestContext);
  const apiRequestExampleLanguage = useDocPageData("apiRequestExampleLanguage");
  const apiDomain = useDocPageData("apiDomain");
  const coreDomain = useDocPageData("coreDomain");
  const apiBasePath = useDocPageData("apiBasePath");
  const tenantId = useDocPageData("tenantId");
  const appId = useDocPageData("appId");
  const codeBlockLanguage = useMemo(() => {
    if (language === "shell") return "bash";
    if (language === "nodejs") return "typescript";
    if (language === "python") return "python";
    if (language === "go") return "go";
  }, [language]);
  const parsedPath = useMemo(() => {
    return replaceVariablesInApiPath(path, { apiBasePath, tenantId, appId });
  }, [path, apiBasePath, tenantId, appId]);

  const host = useMemo(() => {
    const url = apiName === "fdi" ? apiDomain : coreDomain;
    return url.endsWith("/") ? url.slice(0, -1) : url;
  }, [apiName, apiDomain, coreDomain]);

  const snippet = useMemo(() => {
    if (!operation) return null;
    return generateCodeSnippetFromAPIRequest({
      host,
      operation,
      environment: language,
      method,
      security,
      path: parsedPath,
    });
  }, [operation, method, path, language]);

  if (!operation) return null;
  if (language !== apiRequestExampleLanguage) return null;

  return <CodeBlock language={codeBlockLanguage}>{snippet}</CodeBlock>;
}
