import { Box, Text, Card, Flex, Code } from "@radix-ui/themes";
import { OpenAPIV3 } from "@scalar/openapi-types";

export function APIRequestParametersCard({ parameters }: { parameters: OpenAPIV3.ParameterObject[] }) {
  return (
    <Box className="api-request-parameters-card">
      {parameters.map((param, index) => {
        const propName = param.name;
        return (
          <Box key={`${propName}-${index}`} px="0" py="2" className="api-request-parameters-card__parameter">
            <Flex direction="column" gap="1">
              <Flex gap="1" align="center">
                <Code size="4" variant="ghost" asChild>
                  <span>{propName}</span>
                </Code>
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
    </Box>
  );
}
