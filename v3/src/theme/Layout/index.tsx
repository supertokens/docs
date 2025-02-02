import React from "react";
import clsx from "clsx";
import ErrorBoundary from "@docusaurus/ErrorBoundary";
import { PageMetadata, SkipToContentFallbackId, ThemeClassNames } from "@docusaurus/theme-common";
import { useKeyboardNavigation } from "@docusaurus/theme-common/internal";
import SkipToContent from "@theme/SkipToContent";
import AnnouncementBar from "@theme/AnnouncementBar";
import Navbar from "@theme/Navbar";
import Footer from "@theme/Footer";
import LayoutProvider from "@theme/Layout/Provider";
import ErrorPageContent from "@theme/ErrorPageContent";
import supertokens from "supertokens-website";
import type { Props } from "@theme/Layout";
import styles from "./styles.module.css";

if (typeof window !== "undefined") {
  const isProdEnv =
    window.location.hostname === "supertokens.com" || window.location.hostname === "www.supertokens.com";
  const apiDomain = isProdEnv ? "https://api.supertokens.com" : "https://dev.api.supertokens.com";
  const apiBasePath = "/0/auth";
  let sessionExpiredStatusCode = 401;
  supertokens.init({
    apiDomain,
    apiBasePath,
    sessionExpiredStatusCode,
    preAPIHook: async (context) => {
      return {
        ...context,
        requestInit: {
          ...context.requestInit,
          "api-version": "0",
        },
      };
    },
  });
}

export default function Layout(props: Props): JSX.Element {
  const {
    children,
    noFooter,
    wrapperClassName,
    // Not really layout-related, but kept for convenience/retro-compatibility
    title,
    description,
  } = props;

  useKeyboardNavigation();

  return (
    <LayoutProvider>
      <PageMetadata title={title} description={description} />

      <SkipToContent />

      <AnnouncementBar />

      <Navbar />

      <div
        id={SkipToContentFallbackId}
        className={clsx(ThemeClassNames.wrapper.main, styles.mainWrapper, wrapperClassName)}
      >
        <ErrorBoundary fallback={(params) => <ErrorPageContent {...params} />}>{children}</ErrorBoundary>
      </div>

      {!noFooter && <Footer />}
    </LayoutProvider>
  );
}
