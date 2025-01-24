import MDXComponents from "@theme-original/MDXComponents";
import { DocItemContextValue, UIType, NextjsRouterTypeSelect, ConditionalContent } from "@site/src/components";
import { H4, H5, H6 } from "../components/Typography";

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
  th: Table.ColumnHeaderCell,
  td: Table.Cell,
  tr: Table.Row,

  DocItemContextValue,
};
