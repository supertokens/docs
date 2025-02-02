import Tabs, { Props as TabsProps } from "@theme/Tabs";
import TabItem from "@theme/TabItem";

const FrontendCustomUITabOptions = [
  { label: "Web", value: "web" },
  { label: "Mobile", value: "mobile" },
];

const FrontendCustomUIGroupId = "frontend-custom-ui";

type FrontendCustomUIProps = Omit<TabsProps, "values" | "groupId">;

function FrontendCustomUIRoot(props: FrontendCustomUIProps) {
  const { children, ...rest } = props;

  return (
    <Tabs values={FrontendCustomUITabOptions} groupId={FrontendCustomUIGroupId} {...rest}>
      {children}
    </Tabs>
  );
}

export const FrontendCustomUITabs = Object.assign(FrontendCustomUIRoot, {
  TabItem,
});
