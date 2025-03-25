import { Box, Text, Card, Flex, Separator } from "@radix-ui/themes";
import { APIRequest } from "@site/src/types";

export function APIRequestParametersCard({ parameters }: { parameters: APIRequest["parameters"] }) {
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
