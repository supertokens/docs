import React, { JSX, useCallback } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { isActiveSidebarItem } from "@docusaurus/plugin-content-docs/client";
import Link from "@docusaurus/Link";
import isInternalUrl from "@docusaurus/isInternalUrl";
import IconExternalLink from "@theme/Icon/ExternalLink";
import type { Props } from "@theme/DocSidebarItem/Link";

import styles from "./styles.module.scss";
import { AnalyticsEventNames, trackButtonClick } from "@site/src/lib/analytics";
import { APIRequestMethodBadge } from "@site/src/components/APIRequest/APIRequest";
import { APIRequestMethod } from "@site/src/types";
import { MenuItemIcon } from "@site/src/components/MenuItemIcon";
import { NewBadge } from "@site/src/components/NewBadge";
import { BetaBadge } from "@site/src/components/BetaBadge";

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: Props): JSX.Element {
  const { href, label, className, autoAddBaseUrl } = item;

  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);
  const onClick = useCallback(() => {
    trackButtonClick(AnalyticsEventNames.buttonSidebarLink, "v1", {
      linkLabel: item.label,
      linkHref: item.href,
      linkLevel: level,
    });
    if (isInternalLink && onItemClick) {
      onItemClick(item);
    }
  }, [onItemClick, item, isInternalLink]);
  const isAPIReferenceLink = (href.includes("/cdi/") || href.includes("/fdi/")) && !href.includes("introduction");
  const [method, ...rest] = label.split(" ");
  const isDeprecated = label.includes("(deprecated)");

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        "menu__list-item",
        className,
      )}
      key={label}
    >
      <Link
        className={clsx(
          "menu__link",
          styles.menuLinkCustom,
          !isInternalLink && styles.menuExternalLink,
          isActive && styles.menuLinkActive,
          isDeprecated && styles.menuLinkDeprecated,
          {
            "menu__link--active": isActive,
          },
        )}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? "page" : undefined}
        onClick={onClick}
        to={href}
        {...props}
      >
        <MenuItemIcon href={href} className={styles.menuItemIcon} />
        {isAPIReferenceLink ? rest.join(" ") : label}
        {!isInternalLink && <IconExternalLink />}
        {isAPIReferenceLink && method ? (
          <span style={{ marginLeft: "auto" }}>
            <APIRequestMethodBadge method={method as APIRequestMethod} size="1" />
          </span>
        ) : null}
        <NewBadge href={href} label={label} />
        <BetaBadge href={href} label={label} />
      </Link>
    </li>
  );
}
