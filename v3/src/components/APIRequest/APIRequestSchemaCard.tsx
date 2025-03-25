import { Box, Text, Flex, Code, Separator, Select, TextField, Card, Heading } from "@radix-ui/themes";
import * as RadixAccordion from "@radix-ui/react-accordion";
import ChevronDownIcon from "/img/icons/chevron-down.svg";
import { APIRequestSchema } from "@site/src/types";

export function APIRequestSchemaCard({
  schema,
  name = "",
  nestingLevel = 0,
}: {
  schema: APIRequestSchema;
  name?: string;
  nestingLevel?: number;
}) {
  if (nestingLevel > 4) {
    throw new Error("Nesting level too deep. Use a different UI element for this.");
  }

  if (name && nestingLevel > 0) {
    return (
      <Box p="0" asChild>
        <Card asChild>
          <Flex p="0" direction="column" gap="0" align="stretch" asChild>
            <RadixAccordion.Root type="multiple">
              <RadixAccordion.Item value={name}>
                <Flex asChild>
                  <Heading size="2" as="h4" mb="0" asChild>
                    <RadixAccordion.Header>
                      <Flex justify="between" align="center" px="3" py="2" asChild flexGrow="1">
                        <RadixAccordion.Trigger className="api-request-card__accordion-trigger">
                          {name}
                          <ChevronDownIcon className="api-request-card__accordion-trigger-icon" aria-hidden />
                        </RadixAccordion.Trigger>
                      </Flex>
                    </RadixAccordion.Header>
                  </Heading>
                </Flex>
                <RadixAccordion.Content>
                  <SchemaPropertiesList schema={schema} nestingLevel={nestingLevel} />
                </RadixAccordion.Content>
              </RadixAccordion.Item>
            </RadixAccordion.Root>
          </Flex>
        </Card>
      </Box>
    );
  }

  return (
    <Box p="0" asChild>
      <Card>
        <SchemaPropertiesList schema={schema} nestingLevel={nestingLevel} />
      </Card>
    </Box>
  );
}

function SchemaPropertiesList({ schema, nestingLevel }: { schema: APIRequestSchema; nestingLevel: number }) {
  const properties = schema.properties;
  const propertiesNames = Object.keys(schema.properties);

  return (
    <>
      {propertiesNames.map((propName, index) => {
        return (
          <>
            <Box px="4" py="3">
              <Flex direction="column" gap="2">
                <Flex align="center" justify="between">
                  <Flex align="center" gap="1">
                    <Text size="3" weight="bold">
                      {propName}
                    </Text>
                    <Code size="2" color="gray">
                      {properties[propName].type}
                    </Code>
                    {isRequired(schema, propName) ? (
                      <Text size="2" color="red">
                        required
                      </Text>
                    ) : null}
                  </Flex>
                  <PropertyExample schema={schema} propName={propName} />
                </Flex>
                {properties[propName].description && (
                  <Text size="3" color="gray">
                    {properties[propName].description}
                  </Text>
                )}
                {properties[propName].type === "object" && properties[propName].properties ? (
                  <APIRequestSchemaCard
                    schema={properties[propName]}
                    nestingLevel={nestingLevel + 1}
                    name={properties[propName].title || propName}
                  />
                ) : null}
                {properties[propName].type === "array" && properties[propName].items.type === "object" ? (
                  <APIRequestSchemaCard
                    schema={properties[propName].items}
                    nestingLevel={nestingLevel + 1}
                    name="Array Items"
                  />
                ) : null}
              </Flex>
            </Box>
            {index + 1 < propertiesNames.length ? <Separator size="4" /> : null}
          </>
        );
      })}
    </>
  );
}

function PropertyExample({ schema, propName }: { schema: APIRequestSchema; propName: string }) {
  if (!schema.properties) return null;
  const propertySchema = schema.properties[propName];
  if (propertySchema.type === "object" || propertySchema.type === "array") return null;

  if (propertySchema.enum && propertySchema.enum.length > 1) {
    return (
      <Select.Root defaultValue={propertySchema.enum[0]}>
        <Select.Trigger variant="ghost" color="gray" mr="xs" />
        <Select.Content>
          {propertySchema.enum.map((value, index) => (
            <Select.Item key={index} value={value}>
              {value}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    );
  }

  let value = propertySchema.example || propertySchema.default || "";
  if (propertySchema.enum) value = propertySchema.enum[0];

  if (!value) return null;
  return <TextField.Root defaultValue={value} disabled />;
}

function isRequired(schema: APIRequestSchema, propName: string) {
  if (schema.required && schema.required.includes(propName)) return true;
  return schema.properties[propName].required;
}
