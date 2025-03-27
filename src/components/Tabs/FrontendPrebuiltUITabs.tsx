import Tabs, { Props as TabsProps } from "@theme/Tabs";
import { Children, cloneElement, isValidElement, ReactElement, useMemo } from "react";
import type { Props as TabItemProps } from "@theme/TabItem";
import TabItem from "@theme/TabItem";

const FrontendPrebuiltUITabOptions = [
  { label: "ReactJS", value: "reactjs" },
  { label: "Angular", value: "angular" },
  { label: "Vue", value: "vue" },
];

const FrontendPrebuiltUIGroupId = "frontend-prebuilt-ui";

type FrontendPrebuiltUIProps = Omit<TabsProps, "values" | "groupId"> & {
  additionalValues?: { label: string; value: string }[];
  exclude?: string[];
};

function FrontendPrebuiltUIRoot(props: FrontendPrebuiltUIProps) {
  const { children, exclude, additionalValues, ...rest } = props;
  let parsedChildren = children;
  const childrenArray = Children.toArray(children);
  const vueTabItem = childrenArray.find(
    (child): child is ReactElement<TabItemProps> => isValidElement(child) && child.props.value === "vue",
  );
  const angularTabItem = childrenArray.find(
    (child): child is ReactElement<TabItemProps> => isValidElement(child) && child.props.value === "angular",
  );

  const tabOptions = useMemo(() => {
    const allOptions = additionalValues
      ? [...FrontendPrebuiltUITabOptions, ...additionalValues]
      : FrontendPrebuiltUITabOptions;
    if (exclude) return allOptions.filter((tabItem) => !exclude.includes(tabItem.value));
    return allOptions;
  }, [FrontendPrebuiltUITabOptions, exclude, additionalValues]);

  if (!vueTabItem && angularTabItem) {
    parsedChildren = [
      // @ts-expect-error - TODO: Can't figure out the proper type here
      ...childrenArray,
      // @ts-expect-error
      cloneElement(angularTabItem, { key: `vue-tab-item`, value: "vue" }),
    ];
  }

  return (
    <Tabs values={tabOptions} groupId={FrontendPrebuiltUIGroupId} {...rest}>
      {parsedChildren}
    </Tabs>
  );
}

export const FrontendPrebuiltUITabs = Object.assign(FrontendPrebuiltUIRoot, {
  TabItem,
});
