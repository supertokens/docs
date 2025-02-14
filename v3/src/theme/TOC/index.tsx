import React from "react";
import clsx from "clsx";
import TOCItems from "@theme/TOCItems";
import type { Props } from "@theme/TOC";

import styles from "./styles.module.css";
import { TOC_UI_TYPE_SWITCH_ID } from "@site/src/lib/constants";
import useFilteredTocItems from "@site/src/hooks/useFilteredTocItems";

// Using a custom className
// This prevents TOCInline/TOCCollapsible getting highlighted by mistake
const LINK_CLASS_NAME = "table-of-contents__link toc-highlight";
const LINK_ACTIVE_CLASS_NAME = "table-of-contents__link--active";

export default function TOC({ className, toc, ...props }: Props): JSX.Element {
  const filteredTocItems = useFilteredTocItems(toc);
  console.log(filteredTocItems);

  // TODO: Removes the "Optional" label set by the custom badge (see remark plugins for more info)
  // This should be updated to search for a value that is not that generic
  const parsedTocItems = filteredTocItems.map((tocItem) => ({
    ...tocItem,
    value: tocItem.value.endsWith("Optional") ? tocItem.value.replace("Optional", "") : tocItem.value,
  }));

  return (
    <div className={clsx(styles.tableOfContents, "thin-scrollbar", className)}>
      <div id={TOC_UI_TYPE_SWITCH_ID} />
      <TOCItems
        {...props}
        toc={parsedTocItems}
        linkClassName={LINK_CLASS_NAME}
        linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
      />
    </div>
  );
}
