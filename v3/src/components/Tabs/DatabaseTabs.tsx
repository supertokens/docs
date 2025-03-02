import Tabs, { Props as TabsProps } from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { useMemo } from "react";

const DatabaseTabsOptions = [
  { label: "MySQL", value: "mysql" },
  { label: "PostgreSQL", value: "postgresql" },
];

const DatabaseTabsGroupId = "database";

type DatabaseTabsProps = Omit<TabsProps, "values" | "groupId"> & {
  exclude?: string[];
};

function DatabaseTabsRoot(props: DatabaseTabsProps) {
  const { children, exclude, ...rest } = props;

  const tabOptions = useMemo(() => {
    if (exclude) return DatabaseTabsOptions.filter((v) => !exclude.includes(v.value));
    return DatabaseTabsOptions;
  }, [exclude]);

  return (
    <Tabs values={tabOptions} groupId={DatabaseTabsGroupId} {...rest}>
      {children}
    </Tabs>
  );
}

export const DatabaseTabs = Object.assign(DatabaseTabsRoot, {
  Tab: TabItem,
  TabItem,
});
