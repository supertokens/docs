import React, { useCallback } from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import isInternalUrl from "@docusaurus/isInternalUrl";
import { isRegexpStringMatch } from "@docusaurus/theme-common";
import IconExternalLink from "@theme/Icon/ExternalLink";
import type { Props } from "@theme/NavbarItem/NavbarNavLink";
import { AnalyticsEventNames, trackButtonClick } from "@site/src/lib/analytics";

export default function NavbarNavLink({
  activeBasePath,
  activeBaseRegex,
  to,
  href,
  label,
  html,
  isDropdownLink,
  prependBaseUrlToHref,
  ...props
}: Props): JSX.Element {
  // TODO all this seems hacky
  // {to: 'version'} should probably be forbidden, in favor of {to: '/version'}

  // TODO: These are specific events that should be configured
  // where the actual links are set in order to prevent
  // potential issues when refactoring
  const onClick = useCallback(() => {
    let eventName = "";
    if (href === "/blog") {
      eventName = AnalyticsEventNames.buttonHeaderBlog;
    } else if (href === "https://supertokens.com/discord") {
      eventName = AnalyticsEventNames.buttonHeaderDiscord;
    } else if (href === AnalyticsEventNames.buttonHeaderGithub) {
      eventName = "button_header_github";
    }
    if (!eventName) return;
    trackButtonClick(eventName, "v1");
  }, [href]);

  const toUrl = useBaseUrl(to);
  const activeBaseUrl = useBaseUrl(activeBasePath);
  const normalizedHref = useBaseUrl(href, { forcePrependBaseUrl: true });
  const isExternalLink = label && href && !isInternalUrl(href);

  // Link content is set through html XOR label
  const linkContentProps = html
    ? { dangerouslySetInnerHTML: { __html: html } }
    : {
        children: (
          <>
            {label}
            {isExternalLink && <IconExternalLink {...(isDropdownLink && { width: 12, height: 12 })} />}
          </>
        ),
      };

  if (href) {
    return (
      <Link href={prependBaseUrlToHref ? normalizedHref : href} {...props} {...linkContentProps} onClick={onClick} />
    );
  }

  return (
    <Link
      to={toUrl}
      isNavLink
      {...((activeBasePath || activeBaseRegex) && {
        isActive: (_match, location) =>
          activeBaseRegex
            ? isRegexpStringMatch(activeBaseRegex, location.pathname)
            : location.pathname.startsWith(activeBaseUrl),
      })}
      {...props}
      {...linkContentProps}
    />
  );
}
