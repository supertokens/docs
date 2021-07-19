/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import LocaleDropdownNavbarItem from '@theme/NavbarItem/LocaleDropdownNavbarItem';
import SearchNavbarItem from '@theme/NavbarItem/SearchNavbarItem';
import { useLocation } from '@docusaurus/router';
import {
  useVersions,
} from '@theme/hooks/useDocs';

const NavbarItemComponents = {
  default: () => DefaultNavbarItem,
  localeDropdown: () => LocaleDropdownNavbarItem,
  search: () => SearchNavbarItem,
  // Need to lazy load these items as we don't know for sure the docs plugin is loaded
  // See https://github.com/facebook/docusaurus/issues/3360
  docsVersion: () =>
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    require('@theme/NavbarItem/DocsVersionNavbarItem').default,
  docsVersionDropdown: () =>
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    require('@theme/NavbarItem/DocsVersionDropdownNavbarItem').default,
  doc: () =>
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    require('@theme/NavbarItem/DocNavbarItem').default,
};

const getNavbarItemComponent = (type = 'default') => {
  const navbarItemComponent = NavbarItemComponents[type];

  if (!navbarItemComponent) {
    throw new Error(`No NavbarItem component found for type "${type}".`);
  }

  return navbarItemComponent();
};

export default function NavbarItem({ type, ...props }) {

  let newProps = { ...props };

  const { docsPluginId } = props
  const ourDocsPluginId = docsPluginId === "default" ? "community" : docsPluginId;
  const { pathname } = useLocation()

  const currDocs = pathname.split("/")[2];

  // show only version if applies to current docs.
  if (type === 'docsVersionDropdown') {
    if (ourDocsPluginId !== currDocs) {
      return null;
    }

    // we show the version only if there is more than one version to show.
    const versions = useVersions(docsPluginId)
    if (versions.length === 1) {
      return null;
    }
  }


  // change github href link based on current docs being viewed.
  if (props.label !== undefined && props.label === "GitHub") {
    if (DO_NOT_SHOW_GITHUB_BUTTON.filter(i => i === currDocs).length > 0) {
      return null;
    }
    let toReplace = currDocs === "community" ? "core" : currDocs;
    newProps = {
      ...props,
      href: props.href.replace("to_replace", toReplace),
    }
  }

  const NavbarItemComponent = getNavbarItemComponent(type);
  return <NavbarItemComponent {...newProps} />;
}

const DO_NOT_SHOW_GITHUB_BUTTON = ["emailpassword", "thirdparty", "thirdpartyemailpassword", "session"];