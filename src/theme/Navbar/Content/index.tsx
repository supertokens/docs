import React, { useCallback, useEffect, useState, type ReactNode } from "react";
import { useThemeConfig, ErrorCauseBoundary } from "@docusaurus/theme-common";
import { splitNavbarItems, useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import NavbarItem, { type Props as NavbarItemConfig } from "@theme/NavbarItem";
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle";
import SearchBar from "@theme/SearchBar";
import NavbarMobileSidebarToggle from "@theme/Navbar/MobileSidebar/Toggle";
import NavbarLogo from "@theme/Navbar/Logo";
import supertokens from "supertokens-website";
import NavbarSearch from "@theme/Navbar/Search";
import { Button, Text, Card, Flex } from "@radix-ui/themes";
import GitHubLogo from "/img/logos/github.svg";

import { Search } from "@site/src/components";

import styles from "./styles.module.css";
import { AnalyticsEventNames, trackButtonClick } from "@site/src/lib/analytics";

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

function NavbarItems({ items }: { items: NavbarItemConfig[] }): JSX.Element {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error) =>
            new Error(
              `A theme navbar item failed to render.
Please double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:
${JSON.stringify(item, null, 2)}`,
              { cause: error },
            )
          }
        >
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  );
}

function NavbarContentLayout({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className={`navbar__inner ${styles.navbarInnerCustom}`}>
      <div className={"navbar__items"}>{left}</div>
      <div className="navbar__items navbar__items--right">{right}</div>
    </div>
  );
}

export default function NavbarContent(): JSX.Element {
  const mobileSidebar = useNavbarMobileSidebar();

  const items = useNavbarItems();
  const [leftItems, rightItems] = splitNavbarItems(items);

  const searchBarItem = items.find((item) => item.type === "search");

  return (
    <NavbarContentLayout
      left={
        // TODO stop hardcoding items?
        <>
          {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
          <div className={styles.navbarLogoContainer}>
            <NavbarLogo />
          </div>
          <NavbarItems items={leftItems} />
        </>
      }
      right={
        // TODO stop hardcoding items?
        // Ask the user to add the respective navbar items => more flexible
        <>
          <Flex gap="4" mr={{ initial: "0", md: "5" }} align="center">
            <Search.Button />
            <Flex className={styles.navbarActionItem} gap="2" asChild>
              <Text color="gray" size="4" asChild>
                <a href="https://github.com/supertokens/supertokens-core" target="_blank" className="reset-link">
                  <GitHubLogo width="18px" />
                  GitHub
                </a>
              </Text>
            </Flex>
            <Text className={styles.navbarActionItem} color="gray" size="4" asChild>
              <a href="/blog" target="_blank" className="reset-link">
                Blog
              </a>
            </Text>
            <Text className={styles.navbarActionItem} color="gray" size="4" asChild>
              <a href="https://supertokens.com/discord" target="_blank" className="reset-link">
                Discord
              </a>
            </Text>
          </Flex>

          <SignUpButton />
        </>
      }
    />
  );
}

function SignUpButton() {
  const [label, setLabel] = useState("Sign Up");

  const onClick = useCallback(() => {
    const eventName =
      label === "Dashboard" ? AnalyticsEventNames.buttonHeaderViewDashboard : AnalyticsEventNames.buttonHeaderSignup;
    trackButtonClick(eventName, "v1");
  }, [label]);

  const updateButtonLabel = useCallback(async () => {
    if (await supertokens.doesSessionExist()) {
      setLabel("Dashboard");
    }
  }, []);

  useEffect(() => {
    updateButtonLabel();
  }, []);

  return (
    <Button className={styles.navbarActionItem} asChild color="orange">
      <a
        style={{ paddingRight: "var(--space-3)" }}
        onClick={onClick}
        href="/auth"
        target="_blank"
        className={styles.signUpButtonLink}
      >
        {label}
      </a>
    </Button>
  );
}
