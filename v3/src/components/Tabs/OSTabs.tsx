import Tabs, { Props as TabsProps } from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { useMemo } from "react";

const OSTabsOptions = [
	{ value: "linux", label: "Linux" },
	{ value: "mac", label: "macOS" },
	{ value: "windows", label: "Windows" },
];

const OSTabsGroupId = "os";

type OSTabsProps = Omit<TabsProps, "values" | "groupId"> & {
	exclude?: string[];
};

function OSTabsRoot(props: OSTabsProps) {
	const { children, exclude, ...rest } = props;

	const tabOptions = useMemo(() => {
		if (exclude) return OSTabsOptions.filter((v) => !exclude.includes(v.value));
		return OSTabsOptions;
	}, [exclude]);

	return (
		<Tabs values={tabOptions} groupId={OSTabsGroupId} {...rest}>
			{children}
		</Tabs>
	);
}

export const OSTabs = Object.assign(OSTabsRoot, {
	Tab: TabItem,
	TabItem,
});
