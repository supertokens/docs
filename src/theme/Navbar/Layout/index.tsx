import React, { useEffect, type ComponentProps } from "react";
import clsx from "clsx";
import { useThemeConfig } from "@docusaurus/theme-common";
import { useHideableNavbar, useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import { translate } from "@docusaurus/Translate";
import NavbarMobileSidebar from "@theme/Navbar/MobileSidebar";
import type { Props } from "@theme/Navbar/Layout";
import { useLocation } from "@docusaurus/router";
import { TabNav, Box } from "@radix-ui/themes";
import Link from "@docusaurus/Link";

import styles from "./styles.module.scss";

function NavbarBackdrop(props: ComponentProps<"div">) {
  return <div role="presentation" {...props} className={clsx("navbar-sidebar__backdrop", props.className)} />;
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
      className={clsx(
        "navbar",
        styles.navbarCustom,
        "navbar--fixed-top",
        hideOnScroll && [styles.navbarHideable, !isNavbarVisible && styles.navbarHidden],
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
    <Box mt="auto">
      <TabNav.Root className={styles.navbarTabs} size="2">
        <TabNav.Link active={!pathname.startsWith("/docs/references")} href="/docs" asChild>
          <Link className={styles.navbarTab}>Documentation</Link>
        </TabNav.Link>
        <TabNav.Link active={pathname.startsWith("/docs/references")} href="/docs/references" asChild>
          <Link className={styles.navbarTab}>References</Link>
        </TabNav.Link>
      </TabNav.Root>
    </Box>
  );
}
