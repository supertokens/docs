import React, { useContext } from "react";
import type { Props } from "@theme/TabItem";

import { Tabs as RadixTabs } from "@radix-ui/themes";

import { TabsContext } from "@site/src/context";

import "./styles.scss";

export default function TabItem({ children, value }: Props): JSX.Element {
	const { tabValues } = useContext(TabsContext);

	if (!tabValues.find((v) => v.value === value)) {
		throw new Error(`Invalid tab value ${value}`);
	}

	return (
		<RadixTabs.Content className="tab-item" value={value}>
			{children}
		</RadixTabs.Content>
	);
}
