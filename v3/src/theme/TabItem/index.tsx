import React from "react";
import clsx from "clsx";
import type { Props } from "@theme/TabItem";

import { Tabs as RadixTabs } from "@radix-ui/themes";

import styles from "./styles.module.css";

export default function TabItem({ children, value }: Props): JSX.Element {
  return <RadixTabs.Content value={value}>{children}</RadixTabs.Content>;
}
