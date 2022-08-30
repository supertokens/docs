/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import useTOCHighlight from '@theme/hooks/useTOCHighlight';
import styles from './styles.module.css';
import { getUIModeFromStorage, updateUIMode } from "../../components/preBuiltOrCustomUISwitcher";
const LINK_CLASS_NAME = 'table-of-contents__link';
const ACTIVE_LINK_CLASS_NAME = 'table-of-contents__link--active';
const TOP_OFFSET = 100;
/* eslint-disable jsx-a11y/control-has-associated-label */

function Headings({ toc, isChild }) {
  if (!toc.length) {
    return null;
  }

  return (
    <ul
      className={
        isChild ? '' : 'table-of-contents table-of-contents__left-border'
      }>
      {toc.map((heading) => {
        if (heading.visible === false) {
          return <div key={heading.id} style={{ display: "none" }} />
        }

        return (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={LINK_CLASS_NAME} // Developer provided the HTML, so assume it's safe.
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: heading.value,
              }}
            />
            <Headings isChild toc={heading.children} />
          </li>
        );
      })}
    </ul>
  );
}

function TOC({ toc }) {
  let [selectedUIMode, setSelectedUIMode] = useState(getUIModeFromStorage())

  useTOCHighlight(LINK_CLASS_NAME, ACTIVE_LINK_CLASS_NAME, TOP_OFFSET);

  const isCustomSelected = selectedUIMode === "custom";

  const onUIModeChanged = () => {
    setSelectedUIMode(getUIModeFromStorage());
  }

  window.addEventListener("uiModeChanged", onUIModeChanged)

  useEffect(() => {
    return () => {
      window.removeEventListener("uiModeChanged", onUIModeChanged);
    }
  }, []);

  function getTOCWithoutUIPostfix(contentTitle) {
    // Check if the title contains [[...]]
    if (contentTitle.value.includes("[[")) {
      // This means that the title should only be displayed for either custom or prebuilt ui
      if (contentTitle.value.includes("[[pre]]") && !isCustomSelected) {
        return {
          ...contentTitle,
          value: contentTitle.value.replace("[[pre]]", "").trim(),
          visible: true,
        };
      } else if (contentTitle.value.includes("[[cust]]") && isCustomSelected) {
        return {
          ...contentTitle,
          value: contentTitle.value.replace("[[cust]]", "").trim(),
          visible: true,
        };
      }

      return {
        ...contentTitle,
        visible: false,
      };
    }

    return {
      ...contentTitle,
    };
  }

  let _toc = [];

  for (let i = 0; i < toc.length; i++) {
    let contentTitle = {
      ...toc[i],
    }

    if (contentTitle.children && contentTitle.children.length) {
      contentTitle.children = contentTitle.children.map(child => {
        return getTOCWithoutUIPostfix(child);
      })
    }

    _toc.push(getTOCWithoutUIPostfix(contentTitle))
  }

  const selectedColorString = "var(--ui-selector-active)";
  const selectedBorderColorString = "var(--ui-selector-active-border)";

  const unselectedColorString = "var(--ui-selector-inactive)";
  const unselectedBorderColorString = "var(--ui-selector-inactive-border)";

  return (
    <div className={clsx(styles.tableOfContents, 'thin-scrollbar')}>
      <div
        style={{
          width: "100%",
          backgroundColor: "var(--ui-selector-bacgkground)",
          padding: 18,
          paddingLeft: 24,
          marginBottom: 18,
          display: "none", // "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          MozBoxSizing: "border-box",
          WebkitBoxSizing: "border-box",
          borderRadius: 6,
          fontFamily: "Rubik",
          overflow: "clip",
          position: "relative",
        }}>
        <div style={{
          width: 6,
          backgroundColor: selectedColorString,
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
        }} />
        <span
          style={{
            color: "white",
            fontWeight: "500",
            fontSize: 16,
          }}>
          What type of UI do you plan to use?
        </span>
        <div
          onClick={() => {
            updateUIMode("custom")
          }}
          style={{
            marginTop: 24,
            width: "100%",
            cursor: isCustomSelected ? "default" : "pointer",
            backgroundColor: isCustomSelected ? selectedColorString : unselectedColorString,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
            MozBoxSizing: "border-box",
            WebkitBoxSizing: "border-box",
            borderRadius: 6,
            borderWidth: 1,
            borderColor: isCustomSelected ? selectedBorderColorString : unselectedBorderColorString,
            borderStyle: "solid",
          }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: "500",
              marginTop: 6,
              marginBottom: 6,
            }}>
            Custom UI
          </span>
        </div>
        <div
          onClick={() => {
            updateUIMode("prebuilt")
          }}
          style={{
            marginTop: 12,
            width: "100%",
            cursor: !isCustomSelected ? "default" : "pointer",
            backgroundColor: !isCustomSelected ? selectedColorString : unselectedColorString,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
            MozBoxSizing: "border-box",
            WebkitBoxSizing: "border-box",
            borderRadius: 6,
            borderWidth: 1,
            borderColor: !isCustomSelected ? selectedBorderColorString : unselectedBorderColorString,
            borderStyle: "solid",
          }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: "500",
              marginTop: 6,
              marginBottom: 6,
            }}>
            Pre built UI
          </span>
        </div>
      </div>
      <Headings toc={_toc} />
    </div>
  );
}

export default TOC;
