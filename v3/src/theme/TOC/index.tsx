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

	return (
		<div className={clsx(styles.tableOfContents, "thin-scrollbar", className)}>
			<div id={TOC_UI_TYPE_SWITCH_ID} />
			<TOCItems
				{...props}
				toc={filteredTocItems}
				linkClassName={LINK_CLASS_NAME}
				linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
			/>
		</div>
	);
}
