import React, { useCallback, useEffect, useState, type ReactNode } from "react";
import { useThemeConfig, ErrorCauseBoundary } from "@docusaurus/theme-common";
import clsx from "clsx";
import { User } from "lucide-react";
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
import DiscordLogo from "/img/logos/discord.svg";

import { Search, ColorModeToggle } from "@site/src/components";

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
        <>
          <Flex gap="3" mr={{ initial: "0", md: "5" }} align="center">
            <div className={styles.navbarActionItem}>
              <Search.Button />
            </div>
            <div className={styles.navbarActionItem}>
              <ColorModeToggle />
            </div>
            <Flex className={clsx(styles.navbarActionItem, styles.navbarActionItemHoverable)} gap="2" asChild>
              <Text color="gray" size="4" asChild>
                <a href="https://github.com/supertokens/supertokens-core" target="_blank" className="reset-link">
                  <GitHubLogo width="1.2rem" />
                </a>
              </Text>
            </Flex>
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
    <Button asChild color="orange">
      <a
        // prevent content realignment after the navbar renders and the session state gets fetched
        style={{ paddingRight: "var(--space-3)", width: "110px" }}
        onClick={onClick}
        href="/auth"
        target="_blank"
        className={styles.signUpButtonLink}
      >
        <User width="20px" />
        {label}
      </a>
    </Button>
  );
}
