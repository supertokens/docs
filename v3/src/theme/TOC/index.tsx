import React, { useContext, useLayoutEffect, useState } from "react";
import clsx from "clsx";
import TOCItems from "@theme/TOCItems";
import type { Props } from "@theme/TOC";

import { AnimatePresence } from "motion/react";
import styles from "./styles.module.css";
import { DocItemContext } from "@site/src/components/DocItemContext";
import { TOC_UI_TYPE_SWITCH_ID } from "@site/src/lib/constants";

// Using a custom className
// This prevents TOCInline/TOCCollapsible getting highlighted by mistake
const LINK_CLASS_NAME = "table-of-contents__link toc-highlight";
const LINK_ACTIVE_CLASS_NAME = "table-of-contents__link--active";

/**
 * The TOC component does not support dynamic headings.
 * We use this abstraction, parsedTocItems, to show only the items that
 * are currently visible in the page.
 *
 * ATM this only covers the uiType switcher but we should also extend it
 * to allow dynamic headings based on tab selection.
 */
export default function TOC({ className, toc, ...props }: Props): JSX.Element {
	const { uiType, tenantType } = useContext(DocItemContext);

	const [parsedTocItems, setParsedTocItems] = useState<Props["toc"]>(toc);

	useLayoutEffect(() => {
		const mainContentElement = document.querySelector(`main`);
		const hiddenElements: Element[] = [];
		const hiddenUiType = uiType === "custom" ? "prebuilt" : "custom";
		const hiddenUiTypeContainer = document.querySelector(
			`[data-heading-filter="${hiddenUiType}"]`,
		);
		if (hiddenUiTypeContainer) hiddenElements.push(hiddenUiTypeContainer);
		const hiddenTenantType = tenantType === "single" ? "multi" : "single";
		const hiddenTenantTypeContainer = document.querySelector(
			`[data-heading-filter="${hiddenTenantType}"]`,
		);
		if (hiddenTenantTypeContainer)
			hiddenElements.push(hiddenTenantTypeContainer);

		if (!mainContentElement || !hiddenElements.length) return;

		const allPageHeadings = document.querySelectorAll(`h2, h3`);
		const visibleHeadingsIds = Array.from(allPageHeadings)
			.filter((heading) => {
				return hiddenElements.every((hiddenElement) => {
					return !hiddenElement.contains(heading);
				});
			})
			.map((heading) => {
				return heading.id;
			});

		const visibleHeadings: Record<string, boolean> = {};
		setParsedTocItems(
			toc.filter((tocItem) => {
				// Already marked as visible
				if (visibleHeadings[tocItem.id]) return false;
				if (visibleHeadingsIds.find((headingId) => headingId === tocItem.id)) {
					visibleHeadings[tocItem.id] = true;
					return true;
				}
				return false;
			}),
		);
	}, [toc, uiType, tenantType]);

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
