import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { useThemeConfig, type NavbarLogo } from "@docusaurus/theme-common";
import ThemedImage from "@theme/ThemedImage";
import type { Props } from "@theme/Logo";
import { useTheme } from "@site/src/lib";

function LogoThemedImage({ logo, alt, imageClassName }: { logo: NavbarLogo; alt: string; imageClassName?: string }) {
  const sources = {
    light: useBaseUrl(logo.src),
    dark: useBaseUrl(logo.srcDark || logo.src),
  };
  const themedImage = (
    <ThemedImage
      className={logo.className}
      sources={sources}
      height={logo.height}
      width={logo.width}
      alt={alt}
      style={logo.style}
    />
  );

  // Is this extra div really necessary?
  // introduced in https://github.com/facebook/docusaurus/pull/5666
  return imageClassName ? <div className={imageClassName}>{themedImage}</div> : themedImage;
}

export default function Logo(props: Props): JSX.Element {
  const { theme } = useTheme();

  const src = theme === "dark" ? "/img/logos/supertokens-light.svg" : "/img/logos/supertokens-dark.svg";

  return (
    <Link to="https://supertokens.com" target="_blank" className="navbar__brand">
      <img src={src} className="navbar__logo" alt="SuperTokens" />
    </Link>
  );
}
