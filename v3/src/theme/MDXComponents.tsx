import React from "react";
// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents";
import { DocItemContextValue } from "../components/DocItemContext";

import { Table } from "@radix-ui/themes";

const TableRoot = ({ children }) => {
	return (
		<Table.Root mb="4" variant="surface">
			{children}
		</Table.Root>
	);
};

export default {
	// Re-use the default mapping
	...MDXComponents,
	table: TableRoot,
	thead: Table.Header,
	tbody: Table.Body,
	th: Table.ColumnHeaderCell,
	td: Table.Cell,
	tr: Table.Row,

	DocItemContextValue,
};
