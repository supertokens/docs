import React, { useMemo } from "react";
import { Info } from "lucide-react";
import Link from "@docusaurus/Link";
import {
  Card,
  Flex,
  Heading,
  Text,
  Badge,
  Separator,
  Table,
  Box,
  Code,
  Tooltip,
  Link as RLink,
} from "@radix-ui/themes";

import "./SDKReference.scss";

type Props = {
  type: string;
  description: string;
  name: string;
  namespace: string;
  filePath: string;
  line: number;
  repository: string;
  properties: {
    name: string;
    description?: string;
    required: boolean;
    defaultValue?: string;
    type: string | [string, string];
  }[];
  children: React.ReactNode;
};

export function SDKReference(reference: Props) {
  const anchorId = useMemo(() => {
    return `${slugify(reference.namespace)}-${slugify(reference.name)}}`;
  }, [reference]);

  const tableDescription = useMemo(() => {
    if (reference.type === "function") {
      return "PARAMETERS";
    } else if (reference.type === "class") {
      return "PROPERTIES";
    } else if (reference.type === "interface") {
      return "PROPERTIES";
    } else if (reference.type === "type") {
      return "PROPERTIES";
    }

    return "";
  }, [reference]);

  return (
    <section id={anchorId} className="sdk-reference-section">
      <Box px="4" py="5" asChild>
        <Card size="3" variant="surface">
          <Flex direction="column" gap="3">
            <Flex align="center" wrap="nowrap" className="sdk-reference-section__title-container">
              {reference.children}
              <Box ml="auto">
                <Badge color="orange" variant="outline" size="3">
                  {capitalize(reference.type)}
                </Badge>
              </Box>
            </Flex>

            <Text size="2" color="gray">
              {reference.description}
            </Text>
          </Flex>
          <Separator size="4" mt="4" mb="3" />
          <Box>
            <Text size="1" weight="light" className="px-4 pt-3 uppercase tracking-wide">
              {tableDescription}
            </Text>
            <Box pt="2" className="overflow-x-auto">
              <Table.Root variant="surface" size="2">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell width="86px">Required</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {reference.properties.map((row, idx) => (
                    <Table.Row key={idx}>
                      <Table.Cell>
                        <Flex align="center" gap="2">
                          <Box>
                            <Code variant="soft" size="3" color="blue">
                              {row.name}
                            </Code>
                          </Box>
                          {row.description ? (
                            <Tooltip content={row.description} className="sdk-reference-section__tooltip">
                              <Info className="sdk-reference-section__tooltip-icon" />
                            </Tooltip>
                          ) : null}
                        </Flex>
                      </Table.Cell>

                      <Table.Cell>
                        {Array.isArray(row.type) ? (
                          <Link href={row.type[1]}>
                            <Code color="gray">{row.type[0]}</Code>
                          </Link>
                        ) : (
                          <Code color="gray">{row.type}</Code>
                        )}
                      </Table.Cell>

                      <Table.Cell>
                        {row.required ? (
                          <Flex justify="center">
                            <Badge color="gray" variant="outline" radius="small" className="px-2">
                              Yes
                            </Badge>
                          </Flex>
                        ) : (
                          <Flex justify="center">
                            <Text color="gray">-</Text>
                          </Flex>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>
        </Card>
      </Box>
    </section>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
