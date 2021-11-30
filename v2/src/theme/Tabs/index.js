/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState, cloneElement, Children } from 'react';
import useUserPreferencesContext from '@theme/hooks/useUserPreferencesContext';
import clsx from 'clsx';
import styles from './styles.module.css';
import { childContainsTabItemWithValue } from '../../components/tabs/utils';

function isInViewport (element) {
  const { top, left, bottom, right } = element.getBoundingClientRect();
  const { innerHeight, innerWidth } = window;
  return top >= 0 && right <= innerWidth && bottom <= innerHeight && left >= 0;
}

const keys = {
  left: 37,
  right: 39,
};

function Tabs (props) {
  const { lazy, block, defaultValue, values, groupId, className } = props;
  const isSubTab = props.isSubTab === true;
  const { tabGroupChoices, setTabGroupChoices } = useUserPreferencesContext();
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const children = Children.toArray(props.children);
  const tabRefs = [];

  if (groupId != null) {
    const relevantTabGroupChoice = tabGroupChoices[groupId];

    if (
      relevantTabGroupChoice != null &&
      relevantTabGroupChoice !== selectedValue &&
      values.some((value) => value.value === relevantTabGroupChoice)
    ) {
      setSelectedValue(relevantTabGroupChoice);
    }
  }

  const handleTabChange = (event) => {
    const selectedTab = event.currentTarget;
    const selectedTabIndex = tabRefs.indexOf(selectedTab);
    const selectedTabValue = values[selectedTabIndex].value;
    setSelectedValue(selectedTabValue);

    if (groupId != null) {
      setTabGroupChoices(groupId, selectedTabValue);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('docs-tab-change'));
      }
      setTimeout(() => {
        if (isInViewport(selectedTab)) {
          return;
        }

        selectedTab.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        });
        selectedTab.classList.add(styles.tabItemActive);
        setTimeout(
          () => selectedTab.classList.remove(styles.tabItemActive),
          2000,
        );
      }, 150);
    }
  };

  const handleKeydown = (event) => {
    let focusElement;

    switch (event.keyCode) {
      case keys.right: {
        const nextTab = tabRefs.indexOf(event.target) + 1;
        focusElement = tabRefs[nextTab] || tabRefs[0];
        break;
      }

      case keys.left: {
        const prevTab = tabRefs.indexOf(event.target) - 1;
        focusElement = tabRefs[prevTab] || tabRefs[tabRefs.length - 1];
        break;
      }

      default:
        break;
    }

    focusElement?.focus();
  };

  const getAlternateOrDefaultTabContent = () => {
    const { alternateTabContent, defaultTabContent } = props

    if (alternateTabContent && Object.keys(alternateTabContent).includes(selectedValue)) {
      return alternateTabContent[selectedValue]();
    } else if (defaultTabContent && Object.keys(defaultTabContent).includes(selectedValue)) {
      return defaultTabContent[selectedValue]();
    }

    return;
  };

  return (
    <>
      <div
        className={clsx(
          'tabs-container',
          {
            'sub-tab': isSubTab
          }
        )}
      >
        <ul
          style={{
            borderTopLeftRadius: !isSubTab ? "10px" : undefined,
            borderTopRightRadius: !isSubTab ? "10px" : undefined,
          }}
          role="tablist"
          aria-orientation="horizontal"
          className={clsx(
            'tabs',
            {
              'tabs--block': block,
            },
            className,
          )}>
          {values.map(({ value, label }) => (
            <li
              style={isSubTab ? {
                padding: "10px",
                borderWidth: "0px",
                fontWeight: "normal"
              } : {}}
              role="tab"
              tabIndex={selectedValue === value ? 0 : -1}
              aria-selected={selectedValue === value}
              className={clsx('tabs__item', styles.tabItem, {
                'tabs__item--active': selectedValue === value,
              })}
              key={value}
              ref={(tabControl) => tabRefs.push(tabControl)}
              onKeyDown={handleKeydown}
              onFocus={handleTabChange}
              onClick={handleTabChange}>
              {label}
            </li>
          ))}
        </ul>

        {lazy ? (
          cloneElement(
            children.filter(
              (tabItem) => tabItem.props.value === selectedValue,
            )[0],
            {
              className: 'margin-vert--md',
            },
          )
        ) : (
          <div>
            {children.map((tabItem, i) =>
              cloneElement(tabItem, {
                key: i,
                hidden: tabItem.props.value !== selectedValue,
              }),
            )}
          </div>
        )}
      </div>
      {!childContainsTabItemWithValue(selectedValue, props.children) && getAlternateOrDefaultTabContent()}
    </>
  );
}

export default Tabs;
