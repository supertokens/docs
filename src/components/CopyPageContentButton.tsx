import { useState, useEffect, useCallback } from "react";
import { Button } from "@radix-ui/themes";
import CopyIcon from "/img/icons/copy.svg";
import CheckIcon from "/img/icons/check.svg";

import "./CopyPageContentButton.scss";

export function CopyPageContentButton() {
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchMarkdownContent = async () => {
      try {
        const currentUrl = window.location.pathname;
        const markdownUrl = `${currentUrl}.md`;
        const response = await fetch(markdownUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch markdown content: ${response.status}`);
        }

        const content = await response.text();
        setMarkdownContent(content);
      } catch (err) {
        console.error("Error fetching markdown content:", err);
      }
    };

    fetchMarkdownContent();
  }, []);

  const handleCopyToClipboard = useCallback(async () => {
    if (!markdownContent) return;

    try {
      await navigator.clipboard.writeText(markdownContent);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  }, [markdownContent]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isApple =
        navigator.platform.startsWith("Mac") || navigator.platform === "iPhone" || navigator.platform === "iPad";

      const isKeyComboPressed = isApple
        ? event.metaKey && event.altKey && event.code === "KeyC"
        : event.ctrlKey && event.altKey && event.code === "KeyC";
      if (isKeyComboPressed) {
        handleCopyToClipboard();
      }
    },
    [handleCopyToClipboard],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <Button
      className="copy-page-content-button"
      onClick={handleCopyToClipboard}
      disabled={!markdownContent}
      data-state={isCopied ? "copied" : "idle"}
      size="2"
      color="gray"
      variant="soft"
    >
      <span className="copy-page-content-button__icon">
        <CheckIcon className="copy-page-content-button__icon-check" width="14px" />
        <CopyIcon className="copy-page-content-button__icon-copy" width="14px" />
      </span>
      Copy Markdown
    </Button>
  );
}
