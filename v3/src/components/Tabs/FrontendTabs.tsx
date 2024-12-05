import Tabs, { Props as TabsProps } from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { useContext, useMemo } from "react";
import { DocItemContext } from "../DocItemContext";

// TODO: Rename values to items
const PrebuiltUITabValues = [
	{ label: "ReactJS", value: "reactjs" },
	{ label: "Angular", value: "angular" },
	{ label: "Vue", value: "vue" },
	{ label: "Mobile", value: "mobile" },
];

const CustomUITabValues = [
	{ label: "Web", value: "web" },
	{ label: "Mobile", value: "mobile" },
];

const FrontendTabsGroupIdPrefix = "frontend-tabs";

type FrontendTabsProps = Omit<TabsProps, "values" | "groupId"> & {
	exclude?: string[];
	uiType?: string;
};

function FrontendTabsRoot(props: FrontendTabsProps) {
	const { children, exclude, uiType: propsUiType, ...rest } = props;
	const { uiType: contextUiType } = useContext(DocItemContext);
	const uiType = propsUiType || contextUiType;
	const groupId = useMemo(() => {
		return `${FrontendTabsGroupIdPrefix}-${uiType}`;
	}, [uiType]);
	const baseTabValues = useMemo(() => {
		if (uiType === "prebuilt") return PrebuiltUITabValues;
		return CustomUITabValues;
	}, [uiType]);

	const values = useMemo(() => {
		if (!exclude) return baseTabValues;
		return baseTabValues.filter(
			(tabValue) => !exclude.includes(tabValue.value),
		);
	}, [exclude, baseTabValues]);

	return (
		<Tabs values={values} groupId={groupId} {...rest}>
			{children}
		</Tabs>
	);
}

export const FrontendTabs = Object.assign(FrontendTabsRoot, {
	Tab: TabItem,
});
