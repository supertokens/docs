/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { useState, useEffect } from 'react';
import DocPaginator from '@theme/DocPaginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import Seo from '@theme/Seo';
import LastUpdated from '@theme/LastUpdated';
import TOC from '@theme/TOC';
import EditThisPage from '@theme/EditThisPage';
import { MainHeading } from '@theme/Heading';
import clsx from 'clsx';
import styles from './styles.module.css';
import { useActivePlugin, useVersions } from '@theme/hooks/useDocs';
import { useLocation } from '@docusaurus/router';
import { getUIModeFromStorage, updateUIMode } from "../../components/preBuiltOrCustomUISwitcher";

function PreBuiltCustomUISelector({ showUISwitcher }) {
  let [selectedUIMode, setSelectedUIMode] = useState(getUIModeFromStorage())

  const isCustomSelected = selectedUIMode === "custom";

  const onUIModeChanged = () => {
    setSelectedUIMode(getUIModeFromStorage());
  }


  useEffect(() => {
    window.addEventListener("uiModeChanged", onUIModeChanged)
    return () => {
      window.removeEventListener("uiModeChanged", onUIModeChanged);
    }
  }, []);

  const selectedColorString = "var(--ui-selector-active)";
  const selectedBorderColorString = "var(--ui-selector-active-border)";

  const unselectedColorString = "var(--ui-selector-inactive)";
  const unselectedBorderColorString = "var(--ui-selector-inactive-border)";
  let commonStyle = {
    width: "100%",
    // position: "sticky",
    // top: "var(--ifm-navbar-height)",
    marginBottom: 40,
    backgroundColor: "var(--ifm-background-color)",
    // zIndex: 10,
  }
  return (
    <div
      className='ui-selector-mobile'
      style={showUISwitcher ? commonStyle : {
        display: "none",
        ...commonStyle
      }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          paddingTop: 18,
          paddingBottom: 18,
          fontFamily: "Rubik",
          backgroundColor: "var(--ui-selector-background)",
          fontFamily: "Rubik",
          overflow: "clip",
          position: "relative",
          borderRadius: 6
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
            fontWeight: "700",
            fontSize: 18,
            marginLeft: 17,
            marginRight: 5,
          }}>
          Which UI do you use?
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 22,
          }}>
          <div
            onClick={() => {
              updateUIMode("custom")
            }}
            style={{
              display: "flex",
              backgroundColor: isCustomSelected ? selectedColorString : unselectedColorString,
              borderColor: isCustomSelected ? selectedBorderColorString : unselectedBorderColorString,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              MozBoxSizing: "border-box",
              WebkitBoxSizing: "border-box",
              borderRadius: 6,
              borderWidth: 1,
              borderStyle: "solid",
              fontWeight: "700",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 5,
              paddingBottom: 5,
              marginLeft: 17,
              cursor: "pointer",
              fontSize: 13,
            }}>
            {isCustomSelected && <img src="/img/ui-switcher-check.svg" style={{
              marginRight: "8px",
            }} />}
            Custom UI
          </div>

          <div
            onClick={() => {
              updateUIMode("prebuilt")
            }}
            style={{
              display: "flex",
              backgroundColor: !isCustomSelected ? selectedColorString : unselectedColorString,
              borderColor: !isCustomSelected ? selectedBorderColorString : unselectedBorderColorString,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              MozBoxSizing: "border-box",
              WebkitBoxSizing: "border-box",
              borderRadius: 6,
              borderWidth: 1,
              borderStyle: "solid",
              fontWeight: "700",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 5,
              paddingBottom: 5,
              marginLeft: 24,
              marginRight: 5,
              cursor: "pointer",
              fontSize: 13,
            }}>
            {!isCustomSelected && <img src="/img/ui-switcher-check.svg" style={{
              marginRight: "8px",
            }} />}
            Pre built UI
          </div>
        </div>
      </div>
    </div>
  );
}

function DocItem(props) {
  const location = useLocation();
  const { content: DocContent, versionMetadata } = props;
  const { metadata, frontMatter } = DocContent;
  const {
    image,
    keywords,
    hide_title: hideTitle,
    hide_table_of_contents: hideTableOfContents,
  } = frontMatter;
  const {
    description,
    title,
    editUrl,
    lastUpdatedAt,
    formattedLastUpdatedAt,
    lastUpdatedBy,
  } = metadata;
  const { pluginId } = useActivePlugin({
    failfast: true,
  });
  const versions = useVersions(pluginId); // If site is not versioned or only one version is included
  // we don't show the version badge
  // See https://github.com/facebook/docusaurus/issues/3362

  const showVersionBadge = versions.length > 1; // We only add a title if:
  // - user asks to hide it with frontmatter
  // - the markdown content does not already contain a top-level h1 heading

  const shouldAddTitle =
    !hideTitle && typeof DocContent.contentTitle === 'undefined';
  return (
    <>
      <Seo
        {...{
          title,
          description,
          keywords,
          image,
        }}
      />

      <div className="row">
        <div
          className={clsx('col', {
            [styles.docItemCol]: !hideTableOfContents,
          })}>
          <DocVersionBanner versionMetadata={versionMetadata} />
          <div className={styles.docItemContainer}>
            <article>
              {showVersionBadge && (
                <span className="badge badge--secondary">
                  Version: {versionMetadata.label}
                </span>
              )}

              {location.pathname.startsWith("/docs/contribute/") ?
                <>
                  <div className="admonition admonition-caution alert alert--warning"><div className="admonition-heading"><h5><span className="admonition-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"></path></svg></span>important</h5></div><div className="admonition-content"><p>This is a contributors guide and NOT a user guide. Please visit <a href="/docs/community/introduction">these docs</a> if you are using or evaluating SuperTokens.</p></div></div>
                </> : null}

              <div className="markdown">
                <PreBuiltCustomUISelector showUISwitcher={props.content.frontMatter.show_ui_switcher === true} />

                {/*
                 Title can be declared inside md content or declared through frontmatter and added manually
                 To make both cases consistent, the added title is added under the same div.markdown block
                 See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120
                 */}
                {shouldAddTitle && <MainHeading>{title}</MainHeading>}

                <DocContent />
              </div>

              {(editUrl || lastUpdatedAt || lastUpdatedBy) && (
                <footer className="row docusaurus-mt-lg">
                  <div className="col">
                    {editUrl && <EditThisPage editUrl={editUrl} />}
                  </div>

                  <div className={clsx('col', styles.lastUpdated)}>
                    {(lastUpdatedAt || lastUpdatedBy) && (
                      <LastUpdated
                        lastUpdatedAt={lastUpdatedAt}
                        formattedLastUpdatedAt={formattedLastUpdatedAt}
                        lastUpdatedBy={lastUpdatedBy}
                      />
                    )}
                  </div>
                </footer>
              )}
            </article>

            <DocPaginator metadata={metadata} />
          </div>
        </div>
        {!hideTableOfContents && DocContent.toc && (
          <div className="col col--3">
            <TOC toc={DocContent.toc} showUISwitcher={props.content.frontMatter.show_ui_switcher === true} />
          </div>
        )}
      </div>
    </>
  );
}

export default DocItem;