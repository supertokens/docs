import Tabs, { Props as TabsProps } from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { useMemo } from "react";

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
		<Tabs values={tabOptions} groupId={SelfHostingTabsGroupId} {...rest}>
			{children}
		</Tabs>
	);
}

export const SelfHostingTabs = Object.assign(SelfHostingTabsRoot, {
	Tab: TabItem,
	TabItem,
});
