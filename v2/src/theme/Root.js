import React from "react";

import { useLocation } from "@docusaurus/router";

import { GuidePageContextProvider } from "../components/guides/GuidePageContext";

// This is used mainly to wrap the guide pages and customize stuff:
// - prevent showing the pagination buttons (doesn't work from the remark config)
// - add the guide context provider
export default function Root({ children }) {
  const location = useLocation();

  if (location.pathname === "/docs/guides") {
    return <div className="guide-page-wrapper">{children}</div>;
  }

  if (location.pathname.startsWith("/docs/guides/")) {
    return (
      <GuidePageContextProvider>
        <div className="guide-page-wrapper">{children}</div>
      </GuidePageContextProvider>
    );
  }

  return <>{children}</>;
}
