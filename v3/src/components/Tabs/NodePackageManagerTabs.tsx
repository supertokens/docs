import Tabs, { Props as TabsProps } from "@theme/Tabs";
import TabItem, { Props as TabItemProps } from "@theme/TabItem";
import { useContext } from "react";
import { TabsContext, TabsContextProvider } from "./TabsContex";
import { SubTabs } from "../SubTabs";

const PackageManagerTabItems = [
  { label: "Via NPM>=7", value: "npm7+" },
  { label: "Via NPM6", value: "npm6" },
  { label: "Via Yarn", value: "yarn" },
];

const NodePackageManagerTabsGroupId = "node-package-manager";

type NodePackageManagerTabsProps = Omit<TabsProps, "values" | "groupId">;

function NodePackageManagerSubTabsRoot(props: NodePackageManagerTabsProps) {
  const { children, ...rest } = props;

  return (
    <SubTabs defaultValue="npm7+">
      <SubTabs.List size="1" radius="none">
        <SubTabs.Tab value="npm7+">{`NPM>=7`}</SubTabs.Tab>
        <SubTabs.Tab value="npm6">NPM6</SubTabs.Tab>
        <SubTabs.Tab value="yarn">Yarn</SubTabs.Tab>
      </SubTabs.List>
      {children}
    </SubTabs>
  );
}

function NodePackageManagerTabContent({
  children,
  value,
  ...rest
}: TabItemProps) {
  // const { tabItems } = useContext(TabsContext);
  //
  // if (!tabItems.find((v) => v.value === value)) {
  //   throw new Error("Invalid tab value");
  // }

  return <SubTabs.Content value={value}>{children}</SubTabs.Content>;
}

export const NodePackageManagerSubTabs = Object.assign(
  NodePackageManagerSubTabsRoot,
  {
    TabContent: NodePackageManagerTabContent,
  },
);
