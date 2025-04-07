import React, { useCallback } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { isActiveSidebarItem } from "@docusaurus/plugin-content-docs/client";
import Link from "@docusaurus/Link";
import isInternalUrl from "@docusaurus/isInternalUrl";
import IconExternalLink from "@theme/Icon/ExternalLink";
import type { Props } from "@theme/DocSidebarItem/Link";

import styles from "./styles.module.scss";
import { AnalyticsEventNames, trackButtonClick } from "@site/src/lib/analytics";
import { Badge } from "@radix-ui/themes";

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
        {label}
        {!isInternalLink && <IconExternalLink />}

        <Badge radius="full" color="blue">
          POST
        </Badge>
      </Link>
    </li>
  );
}
