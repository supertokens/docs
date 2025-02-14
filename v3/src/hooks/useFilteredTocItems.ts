import { useContext, useState, useLayoutEffect } from "react";
import { DocItemContext } from "@site/src/context";
import type { Props } from "@theme/TOC";

/**
 * The TOC component does not support dynamic headings.
 * We use this abstraction, parsedTocItems, to show only the items that
 * are currently visible in the page.
 *
 * ATM this only covers the uiType switcher but we should also extend it
 * to allow dynamic headings based on tab selection.
 */
export default function useFilteredTocItems(toc: Props["toc"]) {
  const { uiType, tenantType } = useContext(DocItemContext);

  const [filteredTocItems, setFilteredTocItems] = useState<Props["toc"]>([]);

  useLayoutEffect(() => {
    const mainContentElement = document.querySelector(`main`);
    const hiddenElements: Element[] = [];
    const hiddenUiType = uiType === "custom" ? "prebuilt" : "custom";
    const hiddenUiTypeContainer = document.querySelector(`[data-heading-filter="${hiddenUiType}"]`);
    if (hiddenUiTypeContainer) hiddenElements.push(hiddenUiTypeContainer);
    const hiddenTenantType = tenantType === "single" ? "multi" : "single";
    const hiddenTenantTypeContainer = document.querySelector(`[data-heading-filter="${hiddenTenantType}"]`);
    if (hiddenTenantTypeContainer) hiddenElements.push(hiddenTenantTypeContainer);

    if (!mainContentElement || !hiddenElements.length) {
      setFilteredTocItems(toc);
      return;
    }

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
    setFilteredTocItems(
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

  return filteredTocItems;
}
