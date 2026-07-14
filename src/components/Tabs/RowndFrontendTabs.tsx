import Tabs, { Props as TabsProps } from "@theme/Tabs";
import TabItem from "@theme/TabItem";

const RowndFrontendTabOptions = [
  { label: "React", value: "react" },
  { label: "WebJS", value: "webjs" },
  { label: "Android", value: "android" },
  { label: "iOS", value: "ios" },
  { label: "Flutter", value: "flutter" },
  { label: "React Native", value: "react-native" },
];

const RowndFrontendTabsGroupId = "rownd-frontend";

type RowndFrontendTabsProps = Omit<TabsProps, "values" | "groupId">;

function RowndFrontendTabsRoot(props: RowndFrontendTabsProps) {
  const { children, ...rest } = props;

  return (
    <Tabs values={RowndFrontendTabOptions} groupId={RowndFrontendTabsGroupId} {...rest}>
      {children}
    </Tabs>
  );
}

export const RowndFrontendTabs = Object.assign(RowndFrontendTabsRoot, {
  TabItem,
});
