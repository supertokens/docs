import MDXComponents from "@theme-original/MDXComponents";
import {
  OSTabs,
  Separator,
  DocItemContextValue,
  UIType,
  NextjsRouterTypeSelect,
  DescriptionText,
  ConditionalContent,
} from "@site/src/components";
import { H4, H5, H6 } from "../components/Typography";

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

import { Table } from "@radix-ui/themes";

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
  hr: Separator,
  DescriptionText: DescriptionText,
  DocItemContextValue,
  Tabs,
  TabItem,
};
