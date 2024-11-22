import Tabs, { Props as TabsProps } from "@theme/Tabs";
import TabItem, { Props as TabItemProps } from "@theme/TabItem";
import { useContext } from "react";
import { TabsContext, TabsContextProvider } from "./TabsContex";

const PackageManagerTabItems = [
  { label: "Via NPM>=7", value: "npm7+" },
  { label: "Via NPM6", value: "npm6" },
  { label: "Via Yarn", value: "yarn" },
];

const NodePackageManagerTabsGroupId = "node-package-manager";

type NodePackageManagerTabsProps = Omit<TabsProps, "values" | "groupId">;

function NodePackageManagerTabsRoot(props: NodePackageManagerTabsProps) {
  const { children, ...rest } = props;

  return (
    <TabsContextProvider tabItems={PackageManagerTabItems}>
      <Tabs
        values={PackageManagerTabItems}
        groupId={NodePackageManagerTabsGroupId}
        {...rest}
      >
        {children}
      </Tabs>
    </TabsContextProvider>
  );
}

function NodePackageManagerTab({ children, value, ...rest }: TabItemProps) {
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

export const NodePackageManagerTabs = Object.assign(
  NodePackageManagerTabsRoot,
  {
    Tab: NodePackageManagerTab,
  },
);
