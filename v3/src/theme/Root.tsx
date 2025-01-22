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
    const controller = new AbortController();
    const handleBeforeUnload = () => {
      trackPageExit("app-close");
    };
    window.addEventListener("beforeunload", handleBeforeUnload, { signal: controller.signal });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const handleVisibilityChange = () => {
      trackPageExit("visibility-change", document.visibilityState);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange, { signal: controller.signal });
    return () => controller.abort();
  }, []);

  return (
    <Theme accentColor="orange" grayColor="gray" appearance="dark" className="theme-root">
      <DocItemContextProvider>{children}</DocItemContextProvider>
    </Theme>
  );
}
