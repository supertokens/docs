import React, { useCallback, useMemo, useState } from "react";
import { Flex, DropdownMenu, Button } from "@radix-ui/themes";
import { useDoc } from "@docusaurus/plugin-content-docs/client";

import ExternalLinkIcon from "/img/icons/external-link.svg";
import T3ChatIcon from "/img/logos/t3-chat.svg";
import ChatGPTIcon from "/img/logos/chatgpt.svg";
import AnthropicIcon from "/img/logos/anthropic.svg";
import GitHubIcon from "/img/logos/github.svg";

export function PageOptionsDropdownMenu() {
  const { metadata } = useDoc();
  const { editUrl } = metadata;

  const searchQuery = useMemo(() => {
    const currentUrl = window.location.href;
    return `Read the following documentation page "${currentUrl}.md". I want to ask questions about it. If the content is too long use the \`offset\` and \`limit\` query parameters. With them you can paginate the fetched number of charaters returned by the server.`;
  }, []);

  const chatGPTUrl = useMemo(() => {
    return `https://chatgpt.com/?hints=search&q=${encodeURIComponent(searchQuery)}`;
  }, [searchQuery]);
  const claudeUrl = useMemo(() => {
    return `https://claude.ai/new?q=${encodeURIComponent(searchQuery)}`;
  }, [searchQuery]);
  const t3ChatUrl = useMemo(() => {
    return `https://t3.chat/new?q=${encodeURIComponent(searchQuery)}`;
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
        <DropdownMenu.Item asChild>
          <a href={editUrl} className="reset-link" target="_blank">
            <GitHubIcon width="15px" />
            Open in Github
            <Flex ml="auto" style={{ minWidth: "60px" }} justify="end">
              <ExternalLinkIcon width="15px" />
            </Flex>
          </a>
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild>
          <a href={chatGPTUrl} className="reset-link" target="_blank">
            <ChatGPTIcon width="15px" />
            Open in ChatGPT
            <Flex ml="auto">
              <ExternalLinkIcon width="15px" />
            </Flex>
          </a>
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild>
          <a href={claudeUrl} className="reset-link" target="_blank">
            <AnthropicIcon width="15px" />
            Open in Claude
            <Flex ml="auto">
              <ExternalLinkIcon width="15px" />
            </Flex>
          </a>
        </DropdownMenu.Item>
        <DropdownMenu.Item asChild>
          <a href={t3ChatUrl} className="reset-link" target="_blank">
            <T3ChatIcon width="15px" />
            Open in T3 Chat
            <Flex ml="auto">
              <ExternalLinkIcon width="15px" />
            </Flex>
          </a>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
