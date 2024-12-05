import Tabs, { Props as TabsProps } from "@theme/Tabs";
import TabItem, { Props as TabItemProps } from "@theme/TabItem";
import { useContext, useMemo } from "react";
import { TabsContextProvider, TabsContext } from "./TabsContex";

const SelfHostingTabsOptions = [
	{ label: "With Docker", value: "with-docker" },
	{ label: "Without Docker", value: "without-docker" },
];

const SelfHostingTabsGroupId = "self-hosting";

type SelfHostingTabsProps = Omit<TabsProps, "values" | "groupId"> & {
	exclude?: string[];
};

function SelfHostingTabsRoot(props: SelfHostingTabsProps) {
	const { children, exclude, ...rest } = props;

	const tabOptions = useMemo(() => {
		if (exclude)
			return SelfHostingTabsOptions.filter((v) => !exclude.includes(v.value));
		return SelfHostingTabsOptions;
	}, [exclude]);

	return (
		<TabsContextProvider tabItems={tabOptions}>
			<Tabs values={tabOptions} groupId={SelfHostingTabsGroupId} {...rest}>
				{children}
			</Tabs>
		</TabsContextProvider>
	);
}

function SelfHostingTab({ children, value, ...rest }: TabItemProps) {
	const { tabItems } = useContext(TabsContext);

	if (!tabItems.find((v) => v.value === value)) {
		throw new Error(`Invalid tab value ${value}`);
	}

	return (
		<TabItem value={value} {...rest}>
			{children}
		</TabItem>
	);
}

export const SelfHostingTabs = Object.assign(SelfHostingTabsRoot, {
	Tab: SelfHostingTab,
});
