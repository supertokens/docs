import React from "react";
import clsx from "clsx";
import { useDocsSidebar } from "@docusaurus/plugin-content-docs/client";
import type { Props } from "@theme/DocRoot/Layout/Main";

import styles from "./styles.module.css";
import { useLocation } from "@docusaurus/router";

export default function DocRootLayoutMain({ hiddenSidebarContainer, children }: Props): JSX.Element {
  const sidebar = useDocsSidebar();
  const { pathname } = useLocation();

  const isApiReferencePath =
    pathname.includes("/references/fdi") ||
    (pathname.includes("/references/cdi") && !pathname.includes("introduction"));

  return (
    <main
      className={clsx(styles.docMainContainer, (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced)}
    >
      <div
        className={clsx(
          "container padding-top--md padding-bottom--lg",
          styles.docItemWrapper,
          hiddenSidebarContainer && styles.docItemWrapperEnhanced,
        )}
        data-page-type={isApiReferencePath ? "api-reference" : ""}
      >
        {children}
      </div>
    </main>
  );
}
