import Tabs, { Props as TabsProps } from "@theme/Tabs";
import TabItem, { Props as TabItemProps } from "@theme/TabItem";
import { useCallback, useContext, useMemo } from "react";
import { TabsContextProvider, TabsContext } from "./TabsContex";
import { DocItemContext } from "../DocItemContext";

const BackendLanguagesTabItems = [
	{ label: "NodeJS", value: "nodejs" },
	{ label: "GoLang", value: "go" },
	{ label: "Python", value: "python" },
	{ label: "Other Frameworks", value: "otherFrameworks" },
];

const BackendTabsGroupId = "frontend-tabs";

type BackendTabsProps = Omit<TabsProps, "values" | "groupId"> & {
	exclude?: string[];
};

function BackendTabsRoot(props: BackendTabsProps) {
	const { children, exclude, ...rest } = props;
	const { onChangeBackendLanguage } = useContext(DocItemContext);

	const tabItems = useMemo(() => {
		if (exclude)
			return BackendLanguagesTabItems.filter(
				(tabItem) => !exclude.includes(tabItem.value),
			);
		return BackendLanguagesTabItems;
	}, [BackendLanguagesTabItems, exclude]);

	return (
		<TabsContextProvider tabItems={tabItems}>
			<Tabs
				// @ts-expect-error
				onChange={onChangeBackendLanguage}
				values={tabItems}
				groupId={BackendTabsGroupId}
				{...rest}
			>
				{children}
			</Tabs>
		</TabsContextProvider>
	);
}

function BackendTab({ children, value, ...rest }: TabItemProps) {
	const { tabItems } = useContext(TabsContext);

	if (!tabItems.find((v) => v.value === value)) {
		throw new Error("Invalid tab value");
	}

	return (
		<TabItem
			value={value}
			{...rest}
			attributes={{ onclick: (val) => console.log(val) }}
		>
			{children}
		</TabItem>
	);
}

export const BackendTabs = Object.assign(BackendTabsRoot, {
	Tab: BackendTab,
});
