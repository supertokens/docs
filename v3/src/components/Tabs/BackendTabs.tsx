import Tabs, { Props as TabsProps } from "@theme/Tabs";
import TabItem, { Props as TabItemProps } from "@theme/TabItem";
import { useContext, useMemo } from "react";
import { TabsContextProvider, TabsContext } from "./TabsContex";

const BackendLanguagesTabOptions = [
	{ label: "NodeJS", value: "nodejs" },
	{ label: "GoLang", value: "go" },
	{ label: "Python", value: "python" },
	// { label: "Other Frameworks", value: "otherFrameworks" },
];

const BackendTabsGroupId = "frontend-tabs";

type BackendTabsProps = Omit<TabsProps, "values" | "groupId"> & {
	exclude?: string[];
	// TODO: Remove this.
	// Temporary solution for places where we show stuff like "Dashboard" and "cURL"
	additionalValues?: { label: string; value: string }[];
};

function BackendTabsRoot(props: BackendTabsProps) {
	const { children, exclude, additionalValues, ...rest } = props;

	const tabOptions = useMemo(() => {
		const allOptions = additionalValues
			? [...BackendLanguagesTabOptions, ...additionalValues]
			: BackendLanguagesTabOptions;
		if (exclude)
			return allOptions.filter((tabItem) => !exclude.includes(tabItem.value));
		return allOptions;
	}, [BackendLanguagesTabOptions, exclude, additionalValues]);

	return (
		<TabsContextProvider tabItems={tabOptions}>
			<Tabs values={tabOptions} groupId={BackendTabsGroupId} {...rest}>
				{children}
			</Tabs>
		</TabsContextProvider>
	);
}

function BackendTab({ children, value, ...rest }: TabItemProps) {
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

export const BackendTabs = Object.assign(BackendTabsRoot, {
	Tab: BackendTab,
});
