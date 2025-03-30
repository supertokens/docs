import { Theme, Card, Text, Flex, Button, Box } from "@radix-ui/themes";

import { DocItemContextProvider } from "@site/src/context";
import { getCookieConsent, setCookieConsent, trackPageExit, trackPageView } from "@site/src/lib/analytics";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "@docusaurus/router";

export default function Root({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (localStorage.getItem("analytics-consent") === "true") {
      trackPageView();
    }
  }, [pathname]);

  useEffect(() => {
    const controller = new AbortController();
    const handleBeforeUnload = () => {
      if (localStorage.getItem("analytics-consent") === "true") {
        trackPageExit("app-close");
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload, { signal: controller.signal });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const handleVisibilityChange = () => {
      if (localStorage.getItem("analytics-consent") === "true") {
        trackPageExit("visibility-change", document.visibilityState);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange, { signal: controller.signal });
    return () => controller.abort();
  }, []);

  return (
    <Theme accentColor="orange" grayColor="gray" appearance="dark" className="theme-root">
      <DocItemContextProvider>{children}</DocItemContextProvider>
      <AnalyticsConsentBanner />
    </Theme>
  );
}

function AnalyticsConsentBanner() {
  const [showConsentBanner, setShowConsentBanner] = useState(() => {
    const consent = getCookieConsent();
    console.log(consent);

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

  console.log(showConsentBanner);

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
      width={{ initial: "auto", sm: "500px" }}
      style={{ boxShadow: "var(--shadow-4)" }}
      asChild
    >
      <Card size="2">
        <Flex direction="column">
          <Text as="p" size="3">
            We use cookies and similar technologies to help personalize content, analyze site usage, and provide a
            better experience. By clicking "Accept" you consent to our use of cookies. Visit our{" "}
            <a href="https://supertokens.com/legal/privacy-policy" target="_blank">
              Privacy Policy
            </a>{" "}
            for more information.
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
