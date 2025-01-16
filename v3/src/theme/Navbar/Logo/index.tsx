import React, { useCallback } from "react";
import Logo from "@theme/Logo";
import { trackButtonClick, AnalyticsEventNames } from "@site/src/lib/analytics";

export default function NavbarLogo(): JSX.Element {
  const onClick = useCallback(() => {
    trackButtonClick(AnalyticsEventNames.buttonHeaderWebsite, "v1");
  }, []);

  return (
    <Logo
      className="navbar__brand"
      imageClassName="navbar__logo"
      titleClassName="navbar__title text--truncate"
      onClick={onClick}
    />
  );
}
