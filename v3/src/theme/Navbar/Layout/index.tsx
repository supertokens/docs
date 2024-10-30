import React, { type ComponentProps } from "react";
import clsx from "clsx";
import { useThemeConfig } from "@docusaurus/theme-common";
import {
  useHideableNavbar,
  useNavbarMobileSidebar,
} from "@docusaurus/theme-common/internal";
import { translate } from "@docusaurus/Translate";
import NavbarMobileSidebar from "@theme/Navbar/MobileSidebar";
import type { Props } from "@theme/Navbar/Layout";
import { useLocation } from "@docusaurus/router";

import "./styles.scss";

function NavbarBackdrop(props: ComponentProps<"div">) {
  return (
    <div
      role="presentation"
      {...props}
      className={clsx("navbar-sidebar__backdrop", props.className)}
    />
  );
}

export default function NavbarLayout({ children }: Props): JSX.Element {
  const {
    navbar: { hideOnScroll, style },
  } = useThemeConfig();
  const mobileSidebar = useNavbarMobileSidebar();
  const { navbarRef, isNavbarVisible } = useHideableNavbar(hideOnScroll);
  return (
    <nav
      ref={navbarRef}
      aria-label={translate({
        id: "theme.NavBar.navAriaLabel",
        message: "Main",
        description: "The ARIA label for the main navigation",
      })}
      data-attribute-hidden={!isNavbarVisible}
      className={clsx(
        "navbar",
        "navbar--fixed-top",
        hideOnScroll && ["navbarHideable", !isNavbarVisible && "navbarHidden"],
        {
          "navbar--dark": style === "dark",
          "navbar--primary": style === "primary",
          "navbar-sidebar--show": mobileSidebar.shown,
        },
      )}
    >
      {children}
      <NavbarBackdrop onClick={mobileSidebar.toggle} />
      <NavbarMobileSidebar />
      <NavbarTabs />
    </nav>
  );
}

function NavbarTabs() {
  const { pathname } = useLocation();

  return (
    <ul className="navbar__tabs">
      <li
        className="navbar__tab"
        data-is-active={pathname.startsWith("/docs/quickstart")}
      >
        <a href="/docs/quickstart/introduction">QuickStart</a>
      </li>
      <li
        className="navbar__tab"
        data-is-active={pathname.startsWith("/docs/guides")}
      >
        <a href="/docs/guides/introduction">Guides</a>
      </li>
      <li
        className="navbar__tab"
        data-is-active={pathname.startsWith("/docs/references")}
      >
        <a href="/docs/references/introduction">References</a>
      </li>
    </ul>
  );
}
