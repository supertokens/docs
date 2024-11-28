import Tabs, { Props as TabsProps } from "@theme/Tabs";
import TabItem, { Props as TabItemProps } from "@theme/TabItem";
import { createContext, useContext, useMemo } from "react";
import { DocItemContext } from "../DocItemContext";
import { TabsContextProvider, TabsContext } from "./TabsContex";

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
};

type FrontendTabsContextType = {
	values: { value: string; label: string }[];
};

const FrontendTabsContext = createContext({} as FrontendTabsContextType);

function FrontendTabsRoot(props: FrontendTabsProps) {
	const { children, exclude, ...rest } = props;
	const { uiType, frontend } = useContext(DocItemContext);
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
		<FrontendTabsContext.Provider value={{ values }}>
			<Tabs values={values} groupId={groupId} {...rest}>
				{children}
			</Tabs>
		</FrontendTabsContext.Provider>
	);
}

function FrontendTab({ children, value, ...rest }: TabItemProps) {
	const { values } = useContext(FrontendTabsContext);

	if (!values.find((v) => v.value === value)) {
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

export const FrontendTabs = Object.assign(FrontendTabsRoot, {
	Tab: FrontendTab,
});

const ReactRouterVersionTabItems = [
	{ label: "react-router-dom >= v6", value: "v6" },
	{ label: "react-router-dom <= v5", value: "v5" },
];

const ReactRouterVersionTabsGroupId = "react-router-group-id";

type ReactRouterVersionTabsProps = Omit<TabsProps, "values" | "groupId">;

function ReactRouterVersionTabsRoot(props: ReactRouterVersionTabsProps) {
	const { children, ...rest } = props;

	return (
		<TabsContextProvider tabItems={ReactRouterVersionTabItems}>
			<Tabs
				values={ReactRouterVersionTabItems}
				groupId={ReactRouterVersionTabsGroupId}
				{...rest}
			>
				{children}
			</Tabs>
		</TabsContextProvider>
	);
}

function ReactRouterVersionTab({ children, value, ...rest }: TabItemProps) {
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

export const ReactRouterVersionTabs = Object.assign(
	ReactRouterVersionTabsRoot,
	{
		Tab: ReactRouterVersionTab,
	},
);
