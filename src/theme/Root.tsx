import { Theme, Card, Text, Flex, Button, Box } from "@radix-ui/themes";

import { useColorMode, useThemeConfig } from "@docusaurus/theme-common";
import { DocItemContextProvider } from "@site/src/context";
import { init, getCookieConsent, setCookieConsent, trackPageExit, trackPageView } from "@site/src/lib/analytics";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "@docusaurus/router";
import { useTheme } from "../lib";
import useLayoutEffect from "@docusaurus/useIsomorphicLayoutEffect";

export default function Root({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    // This just initializes amplitude in order to start session recording
    // regardless if the user interacts with the page or not
    init();
  }, []);

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
    <Theme accentColor="orange" grayColor="gray" appearance={theme} className="theme-root">
      <DocItemContextProvider>{children}</DocItemContextProvider>
      <AnalyticsConsentBanner />
      <div id="docusaurus-scalar-root" />
    </Theme>
  );
}

function AnalyticsConsentBanner() {
  const [showConsentBanner, setShowConsentBanner] = useState(() => {
    if (typeof window === "undefined") return false;
    const consent = getCookieConsent();

    return consent === "unset";
  });

  const onAccept = useCallback(() => {
    setShowConsentBanner(false);
    setCookieConsent("allow");
  }, []);

  const onDecline = useCallback(() => {
    setShowConsentBanner(false);
    setCookieConsent("deny");
  }, []);

  if (!showConsentBanner) return null;

  return (
    <Box
      position="fixed"
      bottom="16px"
      left="16px"
      right={{
        initial: "16px",
        sm: "auto",
      }}
      width={{ initial: "auto", sm: "370px" }}
      style={{
        boxShadow: "var(--shadow-4)",
        // @ts-ignore
        "--card-background-color": "var(--gray-2)",
      }}
      asChild
    >
      <Card size="2" variant="classic">
        <Flex direction="column">
          <Text as="p" size="3">
            This website uses cookies to improve your experience. Please click decline to disable tracking cookies{" "}
            <a href="https://supertokens.com/legal/privacy-policy" target="_blank">
              Privacy Policy
            </a>
          </Text>
          <Flex gap="3" justify="end">
            <Button variant="soft" onClick={onDecline}>
              Decline
            </Button>
            <Button variant="solid" onClick={onAccept}>
              Accept
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}
