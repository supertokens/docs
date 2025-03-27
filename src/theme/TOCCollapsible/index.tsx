import React from "react";
import clsx from "clsx";
import { useCollapsible, Collapsible } from "@docusaurus/theme-common";
import TOCItems from "@theme/TOCItems";
import CollapseButton from "@theme/TOCCollapsible/CollapseButton";
import type { Props } from "@theme/TOCCollapsible";

import styles from "./styles.module.css";
import useFilteredTocItems from "@site/src/hooks/useFilteredTocItems";

export default function TOCCollapsible({ toc, className, minHeadingLevel, maxHeadingLevel }: Props): JSX.Element {
  const { collapsed, toggleCollapsed } = useCollapsible({
    initialState: true,
  });
  const filteredToc = useFilteredTocItems(toc);
  return (
    <div className={clsx(styles.tocCollapsible, !collapsed && styles.tocCollapsibleExpanded, className)}>
      <CollapseButton collapsed={collapsed} onClick={toggleCollapsed} />
      <Collapsible lazy className={styles.tocCollapsibleContent} collapsed={collapsed}>
        <TOCItems toc={filteredToc} minHeadingLevel={minHeadingLevel} maxHeadingLevel={maxHeadingLevel} />
      </Collapsible>
    </div>
  );
}
