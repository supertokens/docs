import Tabs, { Props as TabsProps } from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { useMemo } from "react";

const BackendLanguagesTabOptions = [
	{ label: "NodeJS", value: "nodejs" },
	{ label: "GoLang", value: "go" },
	{ label: "Python", value: "python" },
];

const BackendTabsGroupId = "backend-language";

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
		<Tabs values={tabOptions} groupId={BackendTabsGroupId} {...rest}>
			{children}
		</Tabs>
	);
}

export const BackendTabs = Object.assign(BackendTabsRoot, {
	Tab: TabItem,
	TabItem,
});
