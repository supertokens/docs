import { Theme } from "@radix-ui/themes";

import { DocItemContextProvider } from "@site/src/context";
import { trackPageExit, trackPageView } from "@site/src/lib/analytics";
import { useEffect } from "react";
import { useLocation } from "@docusaurus/router";

export default function Root({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    trackPageView();
  }, [pathname]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      trackPageExit("app-close");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <Theme accentColor="orange" grayColor="gray" appearance="dark" className="theme-root">
      <DocItemContextProvider>{children}</DocItemContextProvider>
    </Theme>
  );
}
