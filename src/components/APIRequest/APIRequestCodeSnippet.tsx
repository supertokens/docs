import { Text, SegmentedControl, Flex, Select, Card, Separator, Button, Box } from "@radix-ui/themes";
import { useDocPageData } from "@site/src/hooks";
import { DocPageState, docPageStore, generateCodeSnippetFromAPIRequest, getExampleFromSchema } from "@site/src/lib";
import CodeBlock from "@site/src/theme/CodeBlock";
import { useContext, useMemo } from "react";
import { APIRequestContext } from "./APIRequest";
// import { snippetz } from "@scalar/snippetz";
// import { convertToHarRequest } from "@site/src/lib/convertToHarRequest";

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
        <Separator size="4" />
        <Flex direction="row" px="3" py="2">
          <Box ml="auto" asChild>
            <Button variant="outline" color="gray">
              Edit
            </Button>
          </Box>
        </Flex>
      </Card>
    </Flex>
  );
}

function CodeSnippetSection({ language }: { language: DocPageState["apiRequestExampleLanguage"] }) {
  const { operation, method, path } = useContext(APIRequestContext);
  const tenantType = useDocPageData("tenantType");
  const apiRequestExampleLanguage = useDocPageData("apiRequestExampleLanguage");
  const codeBlockLanguage = useMemo(() => {
    if (language === "shell") return "bash";
    if (language === "nodejs") return "typescript";
    if (language === "python") return "python";
    if (language === "go") return "go";
  }, [language]);

  const snippet = useMemo(() => {
    if (!operation) return null;
    const target =
      language === "shell" ? "shell" : language === "nodejs" ? "node" : language === "python" ? "python" : "go";
    const client =
      language === "shell" ? "curl" : language === "nodejs" ? "fetch" : language === "python" ? "requests" : "native";

    // const value = convertToHarRequest({
    //   baseUrl: `https://API-DOMAIN/`,
    //   method,
    //   path,
    //   body: getExampleFromSchema(operation.requestBody),
    //   cookies: [],
    //   headers: [
    //     {
    //       key: "Content-Type",
    //       value: "application/json",
    //       enabled: true,
    //     },
    //   ],
    //   query: [],
    // });

    // return snippetz().print(target, client, value);
    return generateCodeSnippetFromAPIRequest({
      host: "https://API-DOMAIN",
      operation,
      environment: language,
      method,
      path,
    });
  }, [operation, method, path, language]);

  if (!operation) return null;
  if (language !== apiRequestExampleLanguage) return null;

  return <CodeBlock language={codeBlockLanguage}>{snippet}</CodeBlock>;
}
