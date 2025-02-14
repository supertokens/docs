import MDXComponents from "@theme-original/MDXComponents";
import {
  OSTabs,
  DocItemContextValue,
  UIType,
  NextjsRouterTypeSelect,
  DescriptionText,
  ConditionalContent,
  ReferenceCard,
  PaidFeatureCallout,
  Steps,
} from "@site/src/components";
import { Separator, Heading } from "@radix-ui/themes";

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

import { Table } from "@radix-ui/themes";

function HR() {
  return <Separator size="4" mt="5" mb="3" />;
}

const TableRoot = ({ children }) => {
  return (
    <Table.Root mb="4" variant="surface">
      {children}
    </Table.Root>
  );
};

const H1 = ({ children, ...props }) => {
  return (
    <Heading as="h1" size="8" mb="4" {...props}>
      {children}
    </Heading>
  );
};

const H2 = ({ children, ...props }) => {
  return (
    <Heading as="h2" size="7" mb="4" {...props}>
      {children}
    </Heading>
  );
};

const H3 = ({ children, ...props }) => {
  return (
    <Heading as="h3" size="6" mb="4" {...props}>
      {children}
    </Heading>
  );
};

const H4 = ({ children, ...props }) => {
  return (
    <Heading as="h4" size="6" mb="4" {...props}>
      {children}
    </Heading>
  );
};

export default {
  ...MDXComponents,
  h1: H1,
  table: TableRoot,
  thead: Table.Header,
  tbody: Table.Body,
  UIType,
  NextjsRouterTypeSelect,
  ConditionalContent,
  OSTabs,
  th: Table.ColumnHeaderCell,
  td: Table.Cell,
  tr: Table.Row,
  hr: HR,
  DescriptionText: DescriptionText,
  DocItemContextValue,
  Tabs,
  TabItem,
  PaidFeatureCallout,
  Steps: ({ children }) => <Steps mode="mdx">{children}</Steps>,
  ReferenceCard,
};
