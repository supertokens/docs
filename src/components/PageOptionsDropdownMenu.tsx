import React, { useCallback, useMemo, useState } from "react";
import { Flex, DropdownMenu, Button } from "@radix-ui/themes";

import ExternalLinkIcon from "/img/icons/external-link.svg";
import T3ChatIcon from "/img/logos/t3-chat.svg";
import ChatGPTIcon from "/img/logos/chatgpt.svg";
import AnthropicIcon from "/img/logos/anthropic.svg";
import GitHubIcon from "/img/logos/github.svg";

function openInNewTab(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function PageOptionsDropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const currentUrl = window.location.href;

  const searchQuery = useMemo(() => {
    const currentUrl = window.location.href;
    return `Read the following documentation page "${currentUrl}.md". I want to ask questions about it.`;
  }, []);

  const onClickGithub = useCallback(() => {}, [searchQuery]);

  const onClickChatGPT = useCallback(() => {
    openInNewTab(`https://chatgpt.com/?hints=search&q=${encodeURIComponent(searchQuery)}`);
  }, [searchQuery]);

  const onClickClaude = useCallback(() => {
    openInNewTab(`https://claude.ai/new?q=${encodeURIComponent(searchQuery)}`);
  }, [searchQuery]);

  const onClickT3Chat = useCallback(() => {
    openInNewTab(`https://t3.chat/new?q=${encodeURIComponent(searchQuery)}`);
  }, [searchQuery]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="soft" color="gray" size="2">
          Open
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={onClickGithub}>
          <GitHubIcon width="15px" />
          Open in Github
          <Flex ml="auto" style={{ minWidth: "60px" }} justify="end">
            <ExternalLinkIcon width="15px" />
          </Flex>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={onClickChatGPT}>
          <ChatGPTIcon width="15px" />
          Open in ChatGPT
          <Flex ml="auto">
            <ExternalLinkIcon width="15px" />
          </Flex>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={onClickClaude}>
          <AnthropicIcon width="15px" />
          Open in Claude
          <Flex ml="auto">
            <ExternalLinkIcon width="15px" />
          </Flex>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={onClickT3Chat}>
          <T3ChatIcon width="15px" />
          Open in T3 Chat
          <Flex ml="auto">
            <ExternalLinkIcon width="15px" />
          </Flex>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
