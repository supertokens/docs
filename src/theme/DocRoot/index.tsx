import React from "react";
import clsx from "clsx";
import { HtmlClassNameProvider, ThemeClassNames } from "@docusaurus/theme-common";
import { DocsSidebarProvider, useDocRootMetadata } from "@docusaurus/plugin-content-docs/client";
import DocRootLayout from "@theme/DocRoot/Layout";
import NotFoundContent from "@theme/NotFound/Content";
import type { Props } from "@theme/DocRoot";

export default function DocRoot(props: Props): JSX.Element {
  const currentDocRouteMetadata = useDocRootMetadata(props);
  if (!currentDocRouteMetadata) {
    // We only render the not found content to avoid a double layout
    // see https://github.com/facebook/docusaurus/pull/7966#pullrequestreview-1077276692
    return <NotFoundContent />;
  }
  const { docElement, sidebarName, sidebarItems } = currentDocRouteMetadata;
  return (
    <HtmlClassNameProvider className={clsx(ThemeClassNames.page.docsDocPage)}>
      <DocsSidebarProvider name={sidebarName} items={sidebarItems}>
        <DocRootLayout>{docElement}</DocRootLayout>
      </DocsSidebarProvider>
    </HtmlClassNameProvider>
  );
}
