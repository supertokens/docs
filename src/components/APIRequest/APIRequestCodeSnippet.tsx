import {
  Text,
  Flex,
  Select,
  Card,
  Dialog,
  Separator,
  Button,
  Box,
  Grid,
  TextField,
  VisuallyHidden,
} from "@radix-ui/themes";
import { useDocPageData } from "@site/src/hooks";
import { DocPageState, docPageStore, generateCodeSnippetFromAPIRequest } from "@site/src/lib";
import CodeBlock from "@site/src/theme/CodeBlock";
import { useContext, useMemo } from "react";
import { APIRequestContext } from "./APIRequest";
import * as Form from "@radix-ui/react-form";

export function APIRequestCodeSnippetSegmentedControl() {
  const language = useDocPageData("apiRequestExampleLanguage");

  const title = useMemo(() => {
    if (language === "shell") return "Curl Example";
    if (language === "nodejs") return "Fetch Example";
    if (language === "python") return "Requests Example";
    if (language === "go") return "HTTP Example";
  }, [language]);

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
      </Card>
    </Flex>
  );
}

function CodeSnippetSection({ language }: { language: DocPageState["apiRequestExampleLanguage"] }) {
  const { operation, security, method, path, apiName } = useContext(APIRequestContext);
  // const tenantType = useDocPageData("tenantType");
  // const hasTenantRequirement = useMemo(() => {
  //   return path.includes("{tenantId}");
  // }, [path]);
  const apiRequestExampleLanguage = useDocPageData("apiRequestExampleLanguage");
  const codeBlockLanguage = useMemo(() => {
    if (language === "shell") return "bash";
    if (language === "nodejs") return "typescript";
    if (language === "python") return "python";
    if (language === "go") return "go";
  }, [language]);

  const apiDomain = useMemo(() => {
    if (apiName === "fdi") return "{backendAPIDomain}";
    return "{coreAPIDomain}";
  }, [apiName]);

  const snippet = useMemo(() => {
    if (!operation) return null;
    return generateCodeSnippetFromAPIRequest({
      host: apiDomain,
      operation,
      environment: language,
      method,
      security,
      path,
    });
  }, [operation, method, path, language]);

  if (!operation) return null;
  if (language !== apiRequestExampleLanguage) return null;

  return <CodeBlock language={codeBlockLanguage}>{snippet}</CodeBlock>;
}
