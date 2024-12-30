import Tabs, { Props as TabsProps } from "@theme/Tabs";
import { Children, cloneElement, isValidElement, ReactElement } from "react";
import type { Props as TabItemProps } from "@theme/TabItem";
import TabItem from "@theme/TabItem";

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
	let parsedChildren = children;
	const childrenArray = Children.toArray(children);
	const vueTabItem = childrenArray.find(
		(child): child is ReactElement<TabItemProps> =>
			isValidElement(child) && child.props.value === "vue",
	);
	const angularTabItem = childrenArray.find(
		(child): child is ReactElement<TabItemProps> =>
			isValidElement(child) && child.props.value === "angular",
	);

	if (!vueTabItem && angularTabItem) {
		parsedChildren = [
			// @ts-expect-error - TODO: Can't figure out the proper type here
			...childrenArray,
			// @ts-expect-error
			cloneElement(angularTabItem, { key: `vue-tab-item`, value: "vue" }),
		];
	}

	return (
		<Tabs
			values={FrontendPrebuiltUITabOptions}
			groupId={FrontendPrebuiltUIGroupId}
			{...rest}
		>
			{parsedChildren}
		</Tabs>
	);
}

export const FrontendPrebuiltUITabs = Object.assign(FrontendPrebuiltUIRoot, {
	TabItem,
});
