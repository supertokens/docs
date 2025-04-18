import { Box, HoverCard, Text, Flex, Code, Separator, Select, TextField, Card, Heading } from "@radix-ui/themes";
import * as RadixAccordion from "@radix-ui/react-accordion";
import ChevronDownIcon from "/img/icons/chevron-down.svg";
import CopyIcon from "/img/icons/copy.svg";
import CheckIcon from "/img/icons/check.svg";
import CodeBlock from "@site/src/theme/CodeBlock";
import type { OpenAPIV3 } from "@scalar/openapi-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getExampleFromSchema } from "@site/src/lib";
import { normalizeOpenAPIObject } from "@site/src/lib/normalizeOpenAPIObject";

export function APIRequestSchemaCard({
  schema,
  name = "",
  nestingLevel = 0,
}: {
  schema: OpenAPIV3.SchemaObject;
  name?: string;
  nestingLevel?: number;
}) {
  if (nestingLevel > 9) {
    throw new Error("Nesting level too deep. Use a different UI element for this.");
  }

  const parsedSchema = useMemo(() => {
    return normalizeOpenAPIObject(schema);
  }, [schema]);

  if (parsedSchema.oneOf || parsedSchema.anyOf) {
    const oneOfSchemas = parsedSchema.oneOf || parsedSchema.anyOf;

    const label = parsedSchema.oneOf
      ? "One of the following schemas can be used:"
      : "Any of the following schemas can be used:";

    if (parsedSchema.name) {
      return (
        <Box p="0" mt="1" asChild>
          <Card variant="classic" asChild>
            <Flex p="0" direction="column" gap="0" align="stretch" asChild>
              <RadixAccordion.Root type="multiple" className="api-request-accordion">
                <RadixAccordion.Item value={parsedSchema.name} className="api-request-accordion__item">
                  <Flex asChild>
                    <Heading size="2" as="h4" mb="0" asChild>
                      <RadixAccordion.Header>
                        <Flex gap="2" align="center" px="3" py="2" asChild flexGrow="1">
                          <RadixAccordion.Trigger className="api-request-accordion__trigger">
                            <ChevronDownIcon className="api-request-accordion__icon" aria-hidden />
                            {parsedSchema.name}
                          </RadixAccordion.Trigger>
                        </Flex>
                      </RadixAccordion.Header>
                    </Heading>
                  </Flex>
                  <RadixAccordion.Content className="api-request-accordion__content">
                    <Box px="3" py="2">
                      <Text size="3" color="gray">
                        {label}
                      </Text>
                    </Box>
                    <Separator size="4" />

                    <Flex direction="column" gap="2" px="2">
                      {oneOfSchemas.map((itemSchema, index) => {
                        const typedSchema = itemSchema as OpenAPIV3.SchemaObject;
                        return (
                          <Box key={`${itemSchema.type}-${index}`}>
                            <APIRequestSchemaCard
                              key={index}
                              name={itemSchema.name || ""}
                              nestingLevel={nestingLevel + 1}
                              schema={typedSchema}
                            />
                            {index !== oneOfSchemas.length - 1 && (
                              <Flex gap="2" mb="2" mt="3" align="center">
                                <Separator size="4" />
                                <Text size="2" color="gray">
                                  OR
                                </Text>
                                <Separator size="4" />
                              </Flex>
                            )}
                          </Box>
                        );
                      })}
                    </Flex>
                  </RadixAccordion.Content>
                </RadixAccordion.Item>
              </RadixAccordion.Root>
            </Flex>
          </Card>
        </Box>
      );
    }

    return (
      <>
        <Text size="3" color="gray">
          {label}
        </Text>

        <Flex direction="column" gap="2" px="2">
          {oneOfSchemas.map((itemSchema, index) => {
            const typedSchema = itemSchema as OpenAPIV3.SchemaObject;
            return (
              <Box key={`${itemSchema.type}-${index}`}>
                <APIRequestSchemaCard
                  key={index}
                  name={itemSchema.name || ""}
                  nestingLevel={nestingLevel + 1}
                  schema={typedSchema}
                />
                {index !== oneOfSchemas.length - 1 && (
                  <Flex gap="2" mb="2" mt="3" align="center">
                    <Separator size="4" />
                    <Text size="2" color="gray">
                      OR
                    </Text>
                    <Separator size="4" />
                  </Flex>
                )}
              </Box>
            );
          })}
        </Flex>
      </>
    );
  }

  if (name && nestingLevel > 0) {
    return (
      <Box p="0" mt="1" asChild>
        <Card variant="classic" asChild>
          <Flex p="0" direction="column" gap="0" align="stretch" asChild>
            <RadixAccordion.Root type="multiple" className="api-request-accordion">
              <RadixAccordion.Item value={name} className="api-request-accordion__item">
                <Flex asChild>
                  <Heading size="2" as="h4" mb="0" asChild>
                    <RadixAccordion.Header>
                      <Flex gap="2" align="center" px="3" py="2" asChild flexGrow="1">
                        <RadixAccordion.Trigger className="api-request-accordion__trigger">
                          <ChevronDownIcon className="api-request-accordion__icon" aria-hidden />
                          {name}
                        </RadixAccordion.Trigger>
                      </Flex>
                    </RadixAccordion.Header>
                  </Heading>
                </Flex>
                <RadixAccordion.Content className="api-request-accordion__content">
                  <SchemaPropertiesList schema={parsedSchema} nestingLevel={nestingLevel} />
                </RadixAccordion.Content>
              </RadixAccordion.Item>
            </RadixAccordion.Root>
          </Flex>
        </Card>
      </Box>
    );
  }

  return <SchemaPropertiesList schema={schema} nestingLevel={nestingLevel} />;
}

function SchemaPropertiesList({ schema, nestingLevel }: { schema: OpenAPIV3.SchemaObject; nestingLevel: number }) {
  if (!schema.properties) return null;
  const properties = schema.properties as { [name: string]: OpenAPIV3.SchemaObject };

  const propertiesNames = Object.keys(schema.properties);

  return (
    <>
      {propertiesNames.map((propName, index) => {
        return (
          <>
            <Box py="3">
              <Flex direction="column" px={nestingLevel > 0 ? "3" : "0"} gap="1">
                <Flex align="center" justify="between">
                  <Flex align="center" gap="1">
                    <Code size="3" weight="bold" variant="ghost" asChild>
                      <span>{propName}</span>
                    </Code>
                    <Code size="2" color="gray">
                      {properties[propName].type}
                    </Code>
                    {isRequired(schema, propName) ? (
                      <Code size="2" color="red">
                        required
                      </Code>
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
                    name="Properties"
                  />
                ) : null}
                {properties[propName].type === "array" &&
                properties[propName].items.type === "object" &&
                properties[propName].items.properties ? (
                  <APIRequestSchemaCard
                    schema={properties[propName].items}
                    nestingLevel={nestingLevel + 1}
                    name="Array item properties"
                  />
                ) : null}
                {properties[propName].type === "array" && properties[propName].items.anyOf ? (
                  <APIRequestSchemaCard
                    schema={properties[propName].items}
                    nestingLevel={nestingLevel + 1}
                    name="Array item properties"
                  />
                ) : null}
                {properties[propName].type === "array" && properties[propName].items.oneOf ? (
                  <APIRequestSchemaCard
                    schema={properties[propName].items}
                    nestingLevel={nestingLevel + 1}
                    name="Array item properties"
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

function PropertyExample({ schema, propName }: { schema: OpenAPIV3.SchemaObject; propName: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hoverCardIsEnabled, setHoverCardIsEnabled] = useState(false);
  const [hoverCardIsVisible, setHoverCardIsVisible] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const IconComponent = hasCopied ? CheckIcon : CopyIcon;

  const parsedPropertySchema = useMemo<{ value: string; formattedValue: string; options: string[] }>(() => {
    if (!schema.properties) return null;

    const propertySchema = schema.properties[propName] as OpenAPIV3.SchemaObject;

    if (propertySchema.enum && propertySchema.enum.length > 1) {
      return { value: propertySchema.enum[0], formattedValue: propertySchema.enum[0], options: propertySchema.enum };
    }

    let value = propertySchema.example || propertySchema.default || "";
    let formattedValue = propertySchema.example || propertySchema.default || "";
    if (propertySchema.type === "object" || propertySchema.type === "array") {
      value = JSON.stringify(getExampleFromSchema(propertySchema));
      formattedValue = JSON.stringify(getExampleFromSchema(propertySchema), null, 2);
    }

    if (propertySchema.enum) {
      value = propertySchema.enum[0];
      formattedValue = propertySchema.enum[0];
    }

    return { value, formattedValue, options: [] };
  }, [schema, propName]);

  const onOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!hoverCardIsEnabled) return;
      setHoverCardIsVisible(isOpen);
    },
    [hoverCardIsEnabled],
  );

  const copyToClipboard = useCallback(() => {
    if (!parsedPropertySchema) return;
    navigator.clipboard.writeText(parsedPropertySchema.value);
    setHasCopied(true);
  }, [parsedPropertySchema]);

  const onSelect = useCallback((selectedValue) => {
    if (!selectedValue) return;
    navigator.clipboard.writeText(selectedValue);
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      setHoverCardIsEnabled(inputRef.current.scrollWidth > inputRef.current.clientWidth);
    }
  }, []);

  if (!parsedPropertySchema || !parsedPropertySchema.value) return null;

  if (parsedPropertySchema.options.length > 1) {
    return (
      <Box className="api-request-property-example">
        <Select.Root defaultValue={parsedPropertySchema.value} onValueChange={onSelect}>
          <Select.Trigger className="api-request-property-example__input" variant="surface" color="gray" mr="xs" />
          <Select.Content>
            {parsedPropertySchema.options.map((value, index) => (
              <Select.Item key={index} value={value} onClick={copyToClipboard}>
                {value}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Box>
    );
  }

  return (
    <Box position="relative" className="api-request-property-example">
      <HoverCard.Root open={hoverCardIsVisible} onOpenChange={onOpenChange}>
        <HoverCard.Trigger>
          <TextField.Root
            ref={inputRef}
            onMouseLeave={() => setHasCopied(false)}
            onClick={copyToClipboard}
            readOnly
            defaultValue={parsedPropertySchema.value}
            className="api-request-property-example__input"
          />
        </HoverCard.Trigger>
        <Box p="0" className="api-request-property-example__hover-card" asChild>
          <HoverCard.Content maxWidth="400px">
            <CodeBlock language="json">{parsedPropertySchema.formattedValue}</CodeBlock>
          </HoverCard.Content>
        </Box>
      </HoverCard.Root>
      <IconComponent className="api-request-property-example__icon" />
    </Box>
  );
}

function isRequired(schema: OpenAPIV3.SchemaObject, propName: string) {
  if (schema.required && schema.required.includes(propName)) return true;
  return schema.properties[propName].required;
}
