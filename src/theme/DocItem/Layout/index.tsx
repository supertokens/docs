import React, { JSX, useMemo } from "react";
import clsx from "clsx";
import { useWindowSize } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import DocItemPaginator from "@theme/DocItem/Paginator";
import DocVersionBanner from "@theme/DocVersionBanner";
import DocVersionBadge from "@theme/DocVersionBadge";
import DocItemFooter from "@theme/DocItem/Footer";
import Head from "@docusaurus/Head";
import DocItemTOCMobile from "@theme/DocItem/TOC/Mobile";
import DocItemTOCDesktop from "@theme/DocItem/TOC/Desktop";
import BrowserOnly from "@docusaurus/BrowserOnly";
import DocItemContent from "@theme/DocItem/Content";
import DocBreadcrumbs from "@theme/DocBreadcrumbs";
import ContentVisibility from "@theme/ContentVisibility";
import type { Props } from "@theme/DocItem/Layout";

import styles from "./styles.module.css";
import { Flex, Grid, Box, Text } from "@radix-ui/themes";
import { API_REFERENCE_PAGE_TITLE_ID, CopyPageContentButton, PageOptionsDropdownMenu } from "@site/src/components";

/**
 * Decide if the toc should be rendered, on mobile or desktop viewports
 */
function useDocTOC() {
  const { frontMatter, toc } = useDoc();
  const windowSize = useWindowSize();

  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;

  const mobile = canRender ? <DocItemTOCMobile /> : undefined;

  const desktop = canRender && (windowSize === "desktop" || windowSize === "ssr") ? <DocItemTOCDesktop /> : undefined;

  return {
    hidden,
    mobile,
    desktop,
  };
}

export default function DocItemLayout({ children }: Props): JSX.Element {
  const docTOC = useDocTOC();
  const { metadata, frontMatter } = useDoc();
  const keywords = useMemo(() => {
    let baseTags = `${frontMatter["page_type"]}, ${frontMatter["category"]}, authentication, SuperTokens, open source`;
    const recipe = frontMatter["recipe"];
    return recipe ? `${baseTags}, ${recipe}` : baseTags;
  }, [frontMatter]);
  const pageType = frontMatter["page_type"] || "";
  const category = frontMatter["category"] || "";

  const parsedPageType = useMemo(() => {
    return formatLabel(pageType);
  }, [pageType]);
  const parsedCategory = useMemo(() => {
    return formatLabel(category);
  }, [category]);

  if (frontMatter["page_type"] === "api-reference") {
    return (
      <DocItemContent>
        <Head>
          <meta name="keywords" content={keywords} />
        </Head>
        <div id={API_REFERENCE_PAGE_TITLE_ID} />
        <Flex direction={{ initial: "column", md: "row" }} gap="8" width="100%">
          {children}
        </Flex>
      </DocItemContent>
    );
  }

  return (
    <div className="row">
      <Head>
        <meta name="keywords" content={keywords} />
      </Head>
      <div className={clsx("col", !docTOC.hidden && styles.docItemCol)}>
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {docTOC.mobile}
            <BrowserOnly>
              {() => (
                <Flex
                  align={{
                    initial: "start",
                    xs: "center",
                  }}
                  justify="between"
                  mb="4"
                  direction={{ initial: "column", xs: "row" }}
                >
                  <Text size="4" weight="bold" color="orange" mb="2" mt="2">
                    {parsedCategory}
                  </Text>
                  {pageType !== "overview" && (
                    <Flex gap="2" ml={{ initial: "0", xs: "auto" }}>
                      <CopyPageContentButton />
                      <PageOptionsDropdownMenu />
                    </Flex>
                  )}
                </Flex>
              )}
            </BrowserOnly>
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      {docTOC.desktop && <div className="col col--3">{docTOC.desktop}</div>}
    </div>
  );
}

function formatLabel(label: string) {
  return label
    .split("-")
    .map((word) => {
      if (word === "sdk") return "SDK";
      if (word === "cdi") return "CDI";
      if (word === "fdi") return "FDI";
      if (word === "ai") return "AI";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
