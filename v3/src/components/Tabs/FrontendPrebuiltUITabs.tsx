import Tabs, { Props as TabsProps } from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { useMemo } from "react";

const FrontendPrebuiltUITabOptions = [
	{ label: "ReactJS", value: "reactjs" },
	{ label: "Angular", value: "angular" },
	{ label: "Vue", value: "vue" },
	{ label: "Mobile", value: "mobile" },
];

const FrontendPrebuiltUIGroupId = "frontend-prebuilt-ui";

type FrontendPrebuiltUIProps = Omit<TabsProps, "values" | "groupId"> & {
	additionalValues?: { label: string; value: string }[];
};

function FrontendPrebuiltUIRoot(props: FrontendPrebuiltUIProps) {
	const { children, additionalValues, ...rest } = props;

	const tabOptions = useMemo(() => {
		const allOptions = additionalValues
			? [...FrontendPrebuiltUITabOptions, ...additionalValues]
			: FrontendPrebuiltUITabOptions;
		return allOptions;
	}, [FrontendPrebuiltUITabOptions, additionalValues]);

	return (
		<Tabs
			values={FrontendPrebuiltUITabOptions}
			groupId={FrontendPrebuiltUIGroupId}
			{...rest}
		>
			{children}
		</Tabs>
	);
}

export const FrontendPrebuiltUITabs = Object.assign(FrontendPrebuiltUIRoot, {
	TabItem,
});
