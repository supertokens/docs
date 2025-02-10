import React, { useCallback } from "react";
import { useTabs } from "@docusaurus/theme-common/internal";
import useIsBrowser from "@docusaurus/useIsBrowser";
import type { Props } from "@theme/Tabs";
import { Box, Card, Tabs as RadixTabs } from "@radix-ui/themes";

import { TabsContextProvider } from "@site/src/context";

import styles from "./styles.module.css";
function TabsComponent(props: Props & { onChange?: (value: string) => void }): JSX.Element {
  const { onChange, ...rest } = props;
  const tabs = useTabs(rest);
  const { selectedValue, selectValue, tabValues } = tabs;
  const onValueChange = useCallback(
    (value: string) => {
      selectValue(value);
      if (onChange) {
        onChange(value);
      }
    },
    [onChange],
  );
  return (
    // @ts-expect-error
    <TabsContextProvider tabValues={tabValues}>
      <RadixTabs.Root mb="6" value={selectedValue} onValueChange={onValueChange}>
        <Box asChild p="0">
          <Card asChild>
            <RadixTabs.List wrap="wrap" className={styles.tabList}>
              {tabValues.map(({ value, label, attributes }) => (
                <RadixTabs.Trigger value={value} key={value} className={styles.tabItem} {...attributes}>
                  {label}
                </RadixTabs.Trigger>
              ))}
            </RadixTabs.List>
          </Card>
        </Box>
        <Box>{props.children}</Box>
      </RadixTabs.Root>
    </TabsContextProvider>
  );
}

export default function Tabs(props: Props): JSX.Element {
  const isBrowser = useIsBrowser();
  return (
    <TabsComponent
      // Remount tabs after hydration
      // Temporary fix for https://github.com/facebook/docusaurus/issues/5653
      key={String(isBrowser)}
      {...props}
    >
      {props.children}
    </TabsComponent>
  );
}
