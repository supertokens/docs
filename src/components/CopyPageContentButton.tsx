import { useState, useEffect } from "react";
import { Button } from "@radix-ui/themes";
import CopyIcon from "/img/icons/copy.svg";
import CheckIcon from "/img/icons/check.svg";

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

  const handleCopyToClipboard = async () => {
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
  };

  return (
    <Button onClick={handleCopyToClipboard} disabled={!markdownContent} size="2" color="gray" variant="soft">
      {isCopied ? <CheckIcon width="14px" /> : <CopyIcon width="14px" />}
      Copy Markdown
    </Button>
  );
}
