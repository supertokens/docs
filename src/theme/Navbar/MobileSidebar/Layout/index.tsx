import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import GitHubLogo from "/img/logos/github.svg";
import { useNavbarSecondaryMenu } from "@docusaurus/theme-common/internal";
import type { Props } from "@theme/Navbar/MobileSidebar/Layout";
import { Search, ColorModeToggle } from "@site/src/components";
import { useLocation } from "@docusaurus/router";
import { useNavbarMobileSidebar } from "@docusaurus/theme-common/internal";
import { Select, Flex, Text, Box } from "@radix-ui/themes";

import "./index.scss";

export default function NavbarMobileSidebarLayout({ header, primaryMenu, secondaryMenu }: Props): JSX.Element {
  const { shown: secondaryMenuShown } = useNavbarSecondaryMenu();
  return (
    <div className="navbar-sidebar">
      {header}
      <Box mb="4" px="3">
        <NavbarTabsSelect />
      </Box>
      <Flex gap="3" mb="2" px="3" mr={{ initial: "0", md: "5" }} align="center">
        <Search.Button />
        <div className="navbar-sidebar__action-item">
          <ColorModeToggle />
        </div>
        <Flex className="navbar-sidebar__action-item navbar-sidebar__action-item--hoverable" gap="2" asChild>
          <Text color="gray" size="4" asChild>
            <a href="https://github.com/supertokens/supertokens-core" target="_blank" className="reset-link">
              <GitHubLogo width="1.2rem" />
            </a>
          </Text>
        </Flex>
      </Flex>
      <div
        className={clsx("navbar-sidebar__items", {
          "navbar-sidebar__items--show-secondary": secondaryMenuShown,
        })}
      >
        <div className="navbar-sidebar__item menu">{primaryMenu}</div>
        <div className="navbar-sidebar__item menu">{secondaryMenu}</div>
      </div>
    </div>
  );
}

interface TabOption {
  value: string;
  label: string;
  href: string;
}

const tabs: TabOption[] = [
  { value: "documentation", label: "Documentation", href: "/docs" },
  { value: "references", label: "References", href: "/docs/references" },
];

function NavbarTabsSelect(): JSX.Element {
  const { pathname } = useLocation();
  const mobileSidebar = useNavbarMobileSidebar();

  const currentTab = pathname.startsWith("/docs/references") ? "references" : "documentation";

  const handleValueChange = (value: string) => {
    const selectedTab = tabs.find((tab) => tab.value === value);
    if (selectedTab) {
      mobileSidebar.toggle();
    }
  };

  return (
    <Select.Root size="3" value={currentTab}>
      <Select.Trigger color="gray" variant="ghost" />
      <Select.Content color="gray">
        {tabs.map((tab) => (
          <Select.Item key={tab.value} value={tab.value}>
            <Link href={tab.href} onClick={() => handleValueChange(tab.value)} className="reset-link">
              <Text weight="medium" size="5">
                {tab.label}
              </Text>
            </Link>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
