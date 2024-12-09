import Tabs, { Props as TabsProps } from "@theme/Tabs";
import TabItem from "@theme/TabItem";

const FrontendPrebuiltUITabOptions = [
	{ label: "ReactJS", value: "reactjs" },
	{ label: "Angular", value: "angular" },
	{ label: "Vue", value: "vue" },
	{ label: "Mobile", value: "mobile" },
];

const FrontendPrebuiltUIGroupId = "frontend-prebuilt-ui";

type FrontendPrebuiltUIProps = Omit<TabsProps, "values" | "groupId">;

function FrontendPrebuiltUIRoot(props: FrontendPrebuiltUIProps) {
	const { children, ...rest } = props;

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
