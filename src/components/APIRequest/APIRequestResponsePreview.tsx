import { Tabs, Badge, Box, Card, Flex, Heading, Text, Select } from "@radix-ui/themes";
import { generateExampleFromAPIRequestSchema, getExampleFromSchema } from "@site/src/lib";
import CodeBlock from "@site/src/theme/CodeBlock";
import { useContext, useMemo, useState } from "react";
import { APIRequestContext } from "./APIRequest";
import { APIRequestSchema } from "@site/src/types";
import type { OpenAPIV3 } from "@scalar/openapi-types";

export function APIRequestResponsePreview() {
  const { operation } = useContext(APIRequestContext);
  const normalizedResponses = useMemo(() => {
    if (!operation || !operation.responses) return [];
    const result: { id: string; statusCode: string; contentType: string; schema: OpenAPIV3.SchemaObject | null }[] = [];
    for (const statusCode in operation.responses) {
      const response = operation.responses[statusCode] as OpenAPIV3.ResponseObject;
      if (!response.content) {
        result.push({
          id: `statusCode-${statusCode}`,
          statusCode,
          contentType: "application/json",
          schema: null,
        });
        continue;
      }

      const contentType = Object.keys(operation.responses[statusCode].content)[0];
      const currentSchema = operation.responses[statusCode].content[contentType].schema as OpenAPIV3.SchemaObject;
      if (currentSchema.oneOf) {
        // TODO: Figure out a proper way to show/inform that there are multiple schemas
        result.push({
          id: `statusCode-${statusCode}`,
          statusCode,
          contentType,
          schema: currentSchema.oneOf[0] as OpenAPIV3.SchemaObject,
        });
      } else {
        result.push({
          id: `statusCode-${statusCode}`,
          statusCode,
          contentType,
          schema: currentSchema,
        });
      }
    }
    return result;
  }, [operation]);

  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);

  const jsonSnippet = useMemo(() => {
    if (!normalizedResponses.length) return null;
    let selectedResponse = normalizedResponses[0];
    if (selectedResponseId) {
      selectedResponse = normalizedResponses.find((response) => response.id === selectedResponseId);
    }
    if (!selectedResponse) return null;
    if (!selectedResponse.schema) return null;
    return JSON.stringify(getExampleFromSchema(selectedResponse.schema), null, 2);
  }, [normalizedResponses, selectedResponseId]);

  return (
    <Box p="0" asChild>
      <Card className="api-request-response-preview">
        <Tabs.Root
          value={selectedResponseId || normalizedResponses[0]?.id}
          onValueChange={(value) => setSelectedResponseId(value)}
        >
          <Tabs.List size="2">
            {normalizedResponses.map((response) => (
              <Tabs.Trigger key={response.id} value={response.id}>
                {response.statusCode}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

        {/* <Select.Root */}
        {/*   value={selectedResponseId || normalizedResponses[0]?.id} */}
        {/*   onValueChange={(value) => setSelectedResponseId(value)} */}
        {/* > */}
        {/*   <Select.Trigger variant="ghost" color="gray" mr="xs" /> */}
        {/*   <Select.Content color="gray"> */}
        {/*     {normalizedResponses.map((response) => ( */}
        {/*       <Select.Item key={response.id} value={response.id}> */}
        {/*         <Flex align="center"> */}
        {/*           <Badge */}
        {/*             variant="soft" */}
        {/*             color={response.statusCode.startsWith("2") ? "green" : "red"} */}
        {/*             size="2" */}
        {/*             radius="medium" */}
        {/*           > */}
        {/*             {response.statusCode} */}
        {/*           </Badge> */}
        {/*           {response?.schema?.title ? <Text ml="1">Success</Text> : null} */}
        {/*         </Flex> */}
        {/*       </Select.Item> */}
        {/*     ))} */}
        {/*   </Select.Content> */}
        {/* </Select.Root> */}
        {jsonSnippet ? (
          <CodeBlock language="json">{jsonSnippet}</CodeBlock>
        ) : (
          <Flex align="center" justify="center" height="300px">
            <Text color="gray" size="6">
              Empty Body
            </Text>
          </Flex>
        )}
      </Card>
    </Box>
  );
}
