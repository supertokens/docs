import Tabs, { Props as TabsProps } from "@theme/Tabs";
import TabItem from "@theme/TabItem";

const ReactRouterVersionTabItems = [
	{ label: "react-router-dom >= v6", value: "v6" },
	{ label: "react-router-dom <= v5", value: "v5" },
];

const ReactRouterVersionTabsGroupId = "react-router-version";

type ReactRouterVersionTabsProps = Omit<TabsProps, "values" | "groupId">;

function ReactRouterVersionTabsRoot(props: ReactRouterVersionTabsProps) {
	const { children, ...rest } = props;

	return (
		<Tabs
			values={ReactRouterVersionTabItems}
			groupId={ReactRouterVersionTabsGroupId}
			{...rest}
		>
			{children}
		</Tabs>
	);
}

export const ReactRouterVersionTabs = Object.assign(
	ReactRouterVersionTabsRoot,
	{
		Tab: TabItem,
		TabItem,
	},
);
