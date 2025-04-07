import { Badge, Box, Card, Flex, Heading, Text, Select } from "@radix-ui/themes";
import { generateExampleFromAPIRequestSchema, getExampleFromSchema } from "@site/src/lib";
import CodeBlock from "@site/src/theme/CodeBlock";
import { useContext, useMemo, useState } from "react";
import { APIRequestContext } from "./APIRequest";
import { APIRequestSchema } from "@site/src/types";
import type { OpenAPIV3 } from "@scalar/openapi-types";

export function APIRequestResponsePreview() {
  const { operation } = useContext(APIRequestContext);
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);
  const normalizedResponses = useMemo(() => {
    if (!operation || !operation.responses) return [];
    const result: { id: string; statusCode: string; contentType: string; schema: OpenAPIV3.SchemaObject | null }[] = [];
    let index = 0;
    for (const statusCode in operation.responses) {
      const response = operation.responses[statusCode] as OpenAPIV3.ResponseObject;
      if (!response.content) {
        result.push({
          id: `statusCode-${index++}`,
          statusCode,
          contentType: "application/json",
          schema: null,
        });
        continue;
      }

      const contentType = Object.keys(operation.responses[statusCode].content)[0];
      const currentSchema = operation.responses[statusCode].content[contentType].schema as OpenAPIV3.SchemaObject;
      if (currentSchema.oneOf) {
        for (const schemaItem of currentSchema.oneOf) {
          result.push({
            id: `statusCode-${index++}`,
            statusCode,
            contentType,
            schema: schemaItem as OpenAPIV3.SchemaObject,
          });
        }
      } else {
        result.push({
          id: `statusCode-${index++}`,
          statusCode,
          contentType,
          schema: currentSchema,
        });
      }
    }
    return result;
  }, [operation]);

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
    <Box py="0" px="4" asChild>
      <Card>
        <Flex py="3" justify="between">
          <Heading as="h3" size="5" mb="0">
            Response
          </Heading>
          <Select.Root
            value={selectedResponseId || normalizedResponses[0]?.id}
            onValueChange={(value) => setSelectedResponseId(value)}
          >
            <Select.Trigger variant="ghost" color="gray" mr="xs" />
            <Select.Content color="gray">
              {normalizedResponses.map((response) => (
                <Select.Item key={response.id} value={response.id}>
                  <Flex align="center">
                    <Badge
                      variant="soft"
                      color={response.statusCode.startsWith("2") ? "green" : "red"}
                      size="2"
                      radius="medium"
                    >
                      {response.statusCode}
                    </Badge>
                    {response?.schema?.title ? <Text ml="1">Success</Text> : null}
                  </Flex>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
        {jsonSnippet ? <CodeBlock language="json">{jsonSnippet}</CodeBlock> : null}
      </Card>
    </Box>
  );
}
