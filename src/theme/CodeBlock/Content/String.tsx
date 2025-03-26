import React, { useContext, useReducer } from "react";
import clsx from "clsx";
import { useThemeConfig, usePrismTheme } from "@docusaurus/theme-common";
import {
  parseCodeBlockTitle,
  parseLanguage,
  parseLines,
  containsLineNumbers,
  useCodeWordWrap,
} from "@docusaurus/theme-common/internal";
import { Highlight, type Language } from "prism-react-renderer";

import EyeIcon from "/img/icons/eye.svg";
import CodeIcon from "/img/icons/code.svg";
import Line from "@theme/CodeBlock/Line";
import CopyButton from "@theme/CodeBlock/CopyButton";
import WordWrapButton from "@theme/CodeBlock/WordWrapButton";
import Container from "@theme/CodeBlock/Container";
import type { Props } from "@theme/CodeBlock/Content/String";

import { AppTypeSelect } from "@site/src/components/Select/AppTypeSelect";

import { Box, Button, Flex, SegmentedControl } from "@radix-ui/themes";

import styles from "./styles.module.css";

// Prism languages are always lowercase
// We want to fail-safe and allow both "php" and "PHP"
// See https://github.com/facebook/docusaurus/issues/9012
function normalizeLanguage(language: string | undefined): string | undefined {
  return language?.toLowerCase();
}

type CodeBlockContextType = {
  metastring: string;
  showPreview: boolean;
  toggleShowPreview: () => boolean;
};

const CodeBlockContext = React.createContext<CodeBlockContextType>({} as CodeBlockContextType);

export default function CodeBlockString({
  children,
  className: blockClassName = "",
  metastring,
  title: titleProp,
  showLineNumbers: showLineNumbersProp,
  language: languageProp,
}: Props): JSX.Element {
  const {
    prism: { defaultLanguage, magicComments },
  } = useThemeConfig();
  const [showPreview, toggleShowPreview] = useReducer((state) => !state, false);
  const language = normalizeLanguage(languageProp ?? parseLanguage(blockClassName) ?? defaultLanguage);

  const prismTheme = usePrismTheme();
  const wordWrap = useCodeWordWrap();

  const showAppTypeSelect = metastring?.includes("showAppTypeSelect") || false;

  // We still parse the metastring in case we want to support more syntax in the
  // future. Note that MDX doesn't strip quotes when parsing metastring:
  // "title=\"xyz\"" => title: "\"xyz\""
  const title = parseCodeBlockTitle(metastring) || titleProp;
  const previewImage = parseCodeBlockPreview(metastring);

  const { lineClassNames, code } = parseLines(children, {
    metastring,
    language,
    magicComments,
  });
  const showLineNumbers = showLineNumbersProp ?? containsLineNumbers(metastring);

  return (
    <CodeBlockContext.Provider value={{ metastring, showPreview, toggleShowPreview }}>
      <Container
        as="div"
        className={clsx(
          blockClassName,
          language && !blockClassName.includes(`language-${language}`) && `language-${language}`,
        )}
      >
        <CodeBlockHeader />
        <div className={styles.codeBlockContent}>
          {!showPreview ? (
            <>
              <Highlight theme={prismTheme} code={code} language={(language ?? "text") as Language}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre
                    /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
                    tabIndex={0}
                    ref={wordWrap.codeBlockRef}
                    className={clsx(className, styles.codeBlock, "thin-scrollbar")}
                    style={style}
                  >
                    <code
                      className={clsx(styles.codeBlockLines, showLineNumbers && styles.codeBlockLinesWithNumbering)}
                    >
                      {tokens.map((line, i) => (
                        <Line
                          key={i}
                          line={line}
                          getLineProps={getLineProps}
                          getTokenProps={getTokenProps}
                          classNames={lineClassNames[i]}
                          showLineNumbers={showLineNumbers}
                        />
                      ))}
                    </code>
                  </pre>
                )}
              </Highlight>
              <div className={styles.buttonGroup}>
                {(wordWrap.isEnabled || wordWrap.isCodeScrollable) && (
                  <WordWrapButton
                    className={styles.codeButton}
                    onClick={() => wordWrap.toggle()}
                    isEnabled={wordWrap.isEnabled}
                  />
                )}
                <CopyButton className={styles.codeButton} code={code} />
              </div>
            </>
          ) : (
            <div className={styles.codeBlockImageContainer}>
              <img src={previewImage} />
            </div>
          )}
        </div>
      </Container>
    </CodeBlockContext.Provider>
  );
}

function CodeBlockHeader() {
  const { metastring, toggleShowPreview } = useContext(CodeBlockContext);

  const showAppTypeSelect = metastring?.includes("showAppTypeSelect") || false;
  const title = parseCodeBlockTitle(metastring);
  const previewImage = parseCodeBlockPreview(metastring);

  const showHeader = title || showAppTypeSelect || previewImage;
  if (!showHeader) return null;

  return (
    <div className={styles.codeBlockTitle}>
      {title}
      <Flex gap="2" ml="auto">
        {showAppTypeSelect ? <AppTypeSelect /> : null}
        {previewImage ? (
          <SegmentedControl.Root defaultValue="code" onValueChange={toggleShowPreview} radius="large" size="2">
            <SegmentedControl.Item value="code">
              <Flex gap="1" align="center">
                <CodeIcon width="25" height="25" /> Code
              </Flex>
            </SegmentedControl.Item>
            <SegmentedControl.Item value="preview">
              <Flex gap="2" align="center">
                <EyeIcon width="20" height="20" />
                Preview
              </Flex>
            </SegmentedControl.Item>
          </SegmentedControl.Root>
        ) : null}
      </Flex>
    </div>
  );
}

const codeBlockPreviewRegex = /preview=(?<quote>["'])(?<preview>.*?)\1/;

export function parseCodeBlockPreview(metastring?: string): string {
  return metastring?.match(codeBlockPreviewRegex)?.groups!.preview ?? "";
}
