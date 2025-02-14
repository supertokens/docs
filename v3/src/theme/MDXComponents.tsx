import MDXComponents from "@theme-original/MDXComponents";
import {
  OSTabs,
  DocItemContextValue,
  UIType,
  NextjsRouterTypeSelect,
  DescriptionText,
  ConditionalContent,
  ReferenceCard,
} from "@site/src/components";
import { Separator } from "@radix-ui/themes";

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

export default {
  ...MDXComponents,
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
  ReferenceCard,
};
