/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import clsx from 'clsx';
import {
  useThemeConfig,
  isSamePath,
  usePrevious,
  useAnnouncementBar,
} from '@docusaurus/theme-common';
import useLockBodyScroll from '@theme/hooks/useLockBodyScroll';
import useWindowSize, { windowSizes } from '@theme/hooks/useWindowSize';
import useScrollPosition from '@theme/hooks/useScrollPosition';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import Logo from '@theme/Logo';
import IconArrow from '@theme/IconArrow';
import IconMenu from '@theme/IconMenu';
import IconExternalLink from '@theme/IconExternalLink';
import { translate } from '@docusaurus/Translate';
import styles from './styles.module.css';
const MOBILE_TOGGLE_SIZE = 24;

const isActiveSidebarItem = (item, activePath) => {
  if (item.type === 'link') {
    return isSamePath(item.href, activePath);
  }

  if (item.type === 'category') {
    return item.items.some((subItem) =>
      isActiveSidebarItem(subItem, activePath),
    );
  }

  return false;
}; // Optimize sidebar at each "level"
// TODO this item should probably not receive the "activePath" props
// TODO this triggers whole sidebar re-renders on navigation

const DocSidebarItems = memo(function DocSidebarItems({ items, ...props }) {
  return items.map((item, index) => (
    <DocSidebarItem
      key={index} // sidebar is static, the index does not change
      item={item}
      {...props}
    />
  ));
});

function DocSidebarItem(props) {
  const depth = props.depth + 1;
  switch (props.item.type) {
    case 'category':
      return <DocSidebarItemCategory {...props} depth={depth} />;

    case 'link':
    default:
      return <DocSidebarItemLink {...props} depth={depth} />;
  }
}

function DocSidebarItemCategory({
  item,
  onItemClick,
  collapsible,
  activePath,
  depth,
  isInGroup,
  ...props
}) {
  const { items, label } = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const wasActive = usePrevious(isActive); // active categories are always initialized as expanded
  // the default (item.collapsed) is only used for non-active categories

  const [collapsed, setCollapsed] = useState(() => {
    if (!collapsible) {
      return false;
    }

    return isActive ? false : item.collapsed;
  });
  const menuListRef = useRef(null);
  const [menuListHeight, setMenuListHeight] = useState(undefined);

  const handleMenuListHeight = (calc = true) => {
    setMenuListHeight(
      calc ? `${menuListRef.current?.scrollHeight}px` : undefined,
    );
  }; // If we navigate to a category, it should automatically expand itself

  useEffect(() => {
    const justBecameActive = isActive && !wasActive;

    if (justBecameActive && collapsed) {
      setCollapsed(false);
    }
  }, [isActive, wasActive, collapsed]);
  const handleItemClick = useCallback(
    (e) => {
      e.preventDefault();

      if (!menuListHeight) {
        handleMenuListHeight();
      }

      setTimeout(() => setCollapsed((state) => !state), 100);
    },
    [menuListHeight],
  );

  if (items.length === 0) {
    return null;
  }
  let labelStyle = depth > 0 ? {
    marginLeft: `${depth * 16}px`,
  } : {};
  if (item.customProps && item.customProps.superColour === true) {
    labelStyle = {
      ...labelStyle,
      background: "linear-gradient(to right, #FF9933, #DD5500)",
      color: "#000000",
      fontWeight: "bold",
      marginRight: "6px",
      paddingTop: "3px",
      paddingBottom: "3px",
      paddingLeft: "8px",
      marginLeft: "-8px",
      paddingRight: "8px",
      borderRadius: "20px",
    }
  }

  let containerStyle = {};
  let _depth = depth;
  let menuLinkAdditionalClass = "";
  let isGrouped = item.customProps !== undefined && item.customProps.highlightGroup === true;
  let _collapsible = collapsible;

  if (isGrouped) {
    containerStyle = {
      borderWidth: "1px",
      boxSizing: "border-box",
      MozBoxSizing: "border-box",
      WebkitBoxSizing: "border-box",
      borderColor: "#FF9933",
      borderStyle: "solid",
      borderRadius: 12,
      marginLeft: 9,
      marginRight: 9,
      boxShadow: "0px 0px 8px rgba(255, 153, 51, 0.5)",
      paddingBottom: 12,
    }

    _depth = _depth - 1;

    labelStyle = {
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 2,
      paddingBottom: 2,
      borderRadius: 15,
      background: "linear-gradient(90.08deg, #ED8E2F -0.59%, #B54414 99.94%)",
      color: "white",
      fontWeight: "500",
      fontSize: 11,
      lineHeight: "16px",
    }

    menuLinkAdditionalClass = "menu__link--sublist-grouped"
    _collapsible = false;
  }

  if (_depth <= 0) {
    containerStyle = {
      ...containerStyle,
      marginTop: 12,
    }
  }

  let menuLinkAfterIconClass = "";

  // if (item.customProps !== undefined && item.customProps.categoryIcon !== undefined) {
  //   const iconName = item.customProps.categoryIcon;

  //   menuLinkAfterIconClass = "menu__link--after-" + iconName;
  // }

  let showIconAfter = true;

  // if (item.customProps !== undefined && item.customProps.hideCategoryIcon === true) {
  //   menuLinkAfterIconClass = "menu__link--after-no-icon";
  //   showIconAfter = false;
  // }

  let textStyle = {};

  if (isInGroup) {
    textStyle = {
      textTransform: "uppercase",
      fontSize: 11,
    }
  }

  return (
    <li
      className={clsx('menu__list-item', {
        'menu__list-item--collapsed': collapsed,
      })}
      style={containerStyle}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        className={clsx('menu__link', menuLinkAdditionalClass, menuLinkAfterIconClass, styles.sidebarMenuItemLink, {
          'menu__link--sublist': _collapsible,
          'menu__link--active': _collapsible && isActive,
          [styles.menuLinkText]: !_collapsible,
        })}
        onClick={_collapsible ? handleItemClick : undefined}
        href={_collapsible ? '#' : undefined}
        {...props}
        data-depth={_depth}
        style={textStyle}
      >
        <span
          className={styles.sidebarMenuItemLinkLabel}
          style={labelStyle}
        >{label}</span>
        {
          !showIconAfter && <div className={styles.spacer}></div>
        }
        {item.customProps &&
          item.customProps.logoUrl &&
          typeof item.customProps.logoUrl === "string" &&
          (
            <img
              className={styles.sidebarItemLogo}
              src={item.customProps.logoUrl}
              title={label + ' logo'}
              alt={label + " logo"}
            />
          )}
        {
          item.customProps &&
          item.customProps.logoUrl &&
          Array.isArray(item.customProps.logoUrl) &&
          (
            <div style={{
              display: "flex",
              flexFlow: "row wrap",
              flexWrap: "wrap",
              rowGap: "8px",
              marginRight: "2px",
              marginLeft: "-12px"
            }}>
              {
                Array.from(item.customProps.logoUrl).map(logoInfo => {
                  return (
                    <img
                      className={styles.sidebarItemLogo}
                      src={logoInfo.url}
                      title={logoInfo.label + ' logo'}
                      alt={logoInfo.label + " logo"}
                      key={logoInfo.label + " logo"}
                      style={{
                        marginLeft: "8px",
                        width: "20px",
                        objectFit: "contain",
                      }}
                    />
                  );
                })
              }
            </div>
          )
        }
        {
          showIconAfter && <div className={styles.spacer}></div>
        }
      </a>
      <ul
        className="menu__list"
        ref={menuListRef}
        style={{
          height: menuListHeight,
        }}
        onTransitionEnd={() => {
          if (!collapsed) {
            handleMenuListHeight(false);
          }
        }}>
        <DocSidebarItems
          items={items}
          tabIndex={collapsed ? '-1' : '0'}
          onItemClick={onItemClick}
          collapsible={collapsible}
          activePath={activePath}
          depth={_depth}
          isInGroup={isGrouped}
        />
      </ul>
    </li>
  );
}

function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  collapsible: _collapsible,
  depth,
  isInGroup,
  ...props
}) {
  const { href, label } = item;
  const isActive = isActiveSidebarItem(item, activePath);

  let textStyle = {};
  let containerStyle = {};

  if (isInGroup) {
    textStyle = {
      textTransform: "uppercase",
      fontSize: 11,
    }

    containerStyle = {
      marginTop: 12,
    }
  }

  if (depth > 0) {
    textStyle = {
      ...textStyle,
      marginLeft: `${depth * 16}px`,
    }
  }

  return (
    <li
      className={clsx("menu__list-item")}
      key={label}
      data-depth={depth}
      style={containerStyle}
    >
      <Link
        className={clsx('menu__link', styles.sidebarMenuItemLink, {
          'menu__link--active': isActive,
        })}
        to={href}
        {...(isInternalUrl(href) && {
          isNavLink: true,
          exact: true,
          onClick: onItemClick,
        })}
        {...props}>
        {isInternalUrl(href) ? (
          <span
            className={styles.sidebarMenuItemLinkLabel}
            style={textStyle}
          >
            {label}
          </span>
        ) : (
          <span
            className={styles.sidebarMenuItemLinkLabel}
            style={depth > 0 ? {
              marginLeft: `${depth * 16}px`,
            } : {}}
          >
            {label}
            <IconExternalLink />
          </span>
        )}
        {item.customProps && item.customProps.logoUrl && (
          <img
            className={styles.sidebarItemLogo}
            src={item.customProps.logoUrl}
            title={label + ' logo'}
            alt={label + ' logo'}
          />
        )}
      </Link>
      <div className={styles.spacer}></div>
    </li>
  );
}

function useShowAnnouncementBar() {
  const { isClosed } = useAnnouncementBar();
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(!isClosed);
  useScrollPosition(({ scrollY }) => {
    if (!isClosed) {
      setShowAnnouncementBar(scrollY === 0);
    }
  });
  return showAnnouncementBar;
}

function useResponsiveSidebar() {
  const [showResponsiveSidebar, setShowResponsiveSidebar] = useState(false);
  useLockBodyScroll(showResponsiveSidebar);
  const windowSize = useWindowSize();
  useEffect(() => {
    if (windowSize === windowSizes.desktop) {
      setShowResponsiveSidebar(false);
    }
  }, [windowSize]);
  const closeResponsiveSidebar = useCallback(
    (e) => {
      e.target.blur();
      setShowResponsiveSidebar(false);
    },
    [setShowResponsiveSidebar],
  );
  const toggleResponsiveSidebar = useCallback(() => {
    setShowResponsiveSidebar((value) => !value);
  }, [setShowResponsiveSidebar]);
  return {
    showResponsiveSidebar,
    closeResponsiveSidebar,
    toggleResponsiveSidebar,
  };
}

function HideableSidebarButton({ onClick }) {
  return (
    <button
      type="button"
      title={translate({
        id: 'theme.docs.sidebar.collapseButtonTitle',
        message: 'Collapse sidebar',
        description: 'The title attribute for collapse button of doc sidebar',
      })}
      aria-label={translate({
        id: 'theme.docs.sidebar.collapseButtonAriaLabel',
        message: 'Collapse sidebar',
        description: 'The title attribute for collapse button of doc sidebar',
      })}
      className={clsx(
        'button button--secondary button--outline',
        styles.collapseSidebarButton,
      )}
      onClick={onClick}>
      <IconArrow className={styles.collapseSidebarButtonIcon} />
    </button>
  );
}

function ResponsiveSidebarButton({ responsiveSidebarOpened, onClick }) {
  return (
    <button
      aria-label={
        responsiveSidebarOpened
          ? translate({
            id: 'theme.docs.sidebar.responsiveCloseButtonLabel',
            message: 'Close menu',
            description:
              'The ARIA label for close button of mobile doc sidebar',
          })
          : translate({
            id: 'theme.docs.sidebar.responsiveOpenButtonLabel',
            message: 'Open menu',
            description:
              'The ARIA label for open button of mobile doc sidebar',
          })
      }
      aria-haspopup="true"
      className="button button--secondary button--sm menu__button"
      type="button"
      onClick={onClick}>
      {responsiveSidebarOpened ? (
        <span
          className={clsx(styles.sidebarMenuIcon, styles.sidebarMenuCloseIcon)}>
          &times;
        </span>
      ) : (
        <IconMenu
          className={styles.sidebarMenuIcon}
          height={MOBILE_TOGGLE_SIZE}
          width={MOBILE_TOGGLE_SIZE}
        />
      )}
    </button>
  );
}

function DocSidebar({
  path,
  sidebar,
  sidebarCollapsible = true,
  onCollapse,
  isHidden,
}) {
  const showAnnouncementBar = useShowAnnouncementBar();
  const {
    navbar: { hideOnScroll },
    hideableSidebar,
  } = useThemeConfig();
  const { isClosed: isAnnouncementBarClosed } = useAnnouncementBar();
  const {
    showResponsiveSidebar,
    closeResponsiveSidebar,
    toggleResponsiveSidebar,
  } = useResponsiveSidebar();
  return (
    <div
      className={clsx(styles.sidebar, {
        [styles.sidebarWithHideableNavbar]: hideOnScroll,
        [styles.sidebarHidden]: isHidden,
      })}>
      {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
      <nav
        className={clsx(
          'menu',
          'menu--responsive',
          'thin-scrollbar',
          styles.menu,
          {
            'menu--show': showResponsiveSidebar,
            [styles.menuWithAnnouncementBar]:
              !isAnnouncementBarClosed && showAnnouncementBar,
          },
        )}
        aria-label={translate({
          id: 'theme.docs.sidebar.navAriaLabel',
          message: 'Sidebar navigation',
          description: 'The ARIA label for documentation menu',
        })}>
        <ResponsiveSidebarButton
          responsiveSidebarOpened={showResponsiveSidebar}
          onClick={toggleResponsiveSidebar}
        />

        <ul className="menu__list">
          <DocSidebarItems
            items={sidebar}
            onItemClick={closeResponsiveSidebar}
            collapsible={sidebarCollapsible}
            activePath={path}
            depth={-1}
          />
        </ul>
      </nav>
      {hideableSidebar && <HideableSidebarButton onClick={onCollapse} />}
    </div>
  );
}

export default DocSidebar;