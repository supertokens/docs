import { Box, Text, Card, Flex, Code } from "@radix-ui/themes";
import { OpenAPIV3 } from "@scalar/openapi-types";

export function APIRequestParametersCard({ parameters }: { parameters: OpenAPIV3.ParameterObject[] }) {
  return (
    <Box p="0" asChild>
      <Card className="api-request-parameters-card">
        {parameters.map((param, index) => {
          const propName = param.name;
          return (
            <Box px="4" py="3" className="api-request-parameters-card__parameter">
              <Flex direction="column" gap="2">
                <Flex gap="1" align="center">
                  <Text size="3" weight="bold">
                    {propName}
                  </Text>
                  {param.required && (
                    <Code size="2" color="red">
                      required
                    </Code>
                  )}
                </Flex>
                {param.description && (
                  <Text size="3" color="gray">
                    {param.description}
                  </Text>
                )}
              </Flex>
            </Box>
          );
        })}
      </Card>
    </Box>
  );
}
