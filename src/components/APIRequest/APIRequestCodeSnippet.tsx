import { Text, SegmentedControl, Flex, Select } from "@radix-ui/themes";
import { useDocPageData } from "@site/src/hooks";
import { DocPageState, docPageStore, generateCodeSnippetFromAPIRequest } from "@site/src/lib";
import CodeBlock from "@site/src/theme/CodeBlock";
import { useContext, useMemo } from "react";
import { APIRequestContext } from "./APIRequest";

export function APIRequestCodeSnippetSegmentedControl() {
  const language = useDocPageData("apiRequestExampleLanguage");

  return (
    <Flex direction="column" gap="4">
      <SegmentedControl.Root
        defaultValue="shell"
        value={language}
        onValueChange={(value) =>
          docPageStore.updateValue("apiRequestExampleLanguage", value as DocPageState["apiRequestExampleLanguage"])
        }
      >
        <SegmentedControl.Item value="shell">Shell</SegmentedControl.Item>
        <SegmentedControl.Item value="nodejs">NodeJS</SegmentedControl.Item>
        <SegmentedControl.Item value="python">Python</SegmentedControl.Item>
        <SegmentedControl.Item value="go">Go</SegmentedControl.Item>
      </SegmentedControl.Root>
      <CodeSnippetSection language="shell" />
      <CodeSnippetSection language="nodejs" />
      <CodeSnippetSection language="python" />
      <CodeSnippetSection language="go" />
    </Flex>
  );
}

function CodeSnippetSection({ language }: { language: DocPageState["apiRequestExampleLanguage"] }) {
  const { schema } = useContext(APIRequestContext);
  const tenantType = useDocPageData("tenantType");
  const apiRequestExampleLanguage = useDocPageData("apiRequestExampleLanguage");

  const title = useMemo(() => {
    if (language === "shell") return "Curl Example";
    if (language === "nodejs") return "Fetch Example";
    if (language === "python") return "Requests Example";
    if (language === "go") return "HTTP Example";
  }, [language]);

  const codeBlockLanguage = useMemo(() => {
    if (language === "shell") return "bash";
    if (language === "nodejs") return "typescript";
    if (language === "python") return "python";
    if (language === "go") return "go";
  }, [language]);

  const snippet = useMemo(() => {
    if (!schema) return null;
    return generateCodeSnippetFromAPIRequest("<API_DOMAIN>", schema, language);
  }, [schema, language]);

  if (!schema) return null;
  if (language !== apiRequestExampleLanguage) return null;

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
      <CodeBlock language={codeBlockLanguage}>{snippet}</CodeBlock>
    </Flex>
  );
}
