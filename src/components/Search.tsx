import { Badge, Inset, Box, Button, Dialog, Flex, Separator, Tabs, Text, TextField } from "@radix-ui/themes";
import { searchClient, SearchResponse } from "@algolia/client-search";
import type { Hit, SnippetResultItem } from "@algolia/client-search";
import Link from "@docusaurus/Link";
import SearchIcon from "/img/icons/search.svg";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import "./Search.scss";

const client = searchClient("SBR5UR2Z16", "d87c41f893c301f365d5bfc62e6631df");

// Debounce function to limit API calls
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced;
}

const TABS = ["all", "tutorial", "guide", "sdk-reference", "api-reference"] as const;
type TabType = (typeof TABS)[number];

async function searchAlgolia(query: string, type?: TabType): Promise<SearchResponse> {
  const response = await client.searchSingleIndex({
    indexName: "supertokens_documentation",
    searchParams: {
      query,
      facets: ["type", "category"],
      facetFilters: type !== "all" ? [`type:${type}`] : undefined,
      offset: 0,
      length: 10,
      highlightPreTag: "<mark>",
      highlightPostTag: "</mark>",
      snippetEllipsisText: "…",
      attributesToSnippet: ["content:20"],
    },
  });
  return response;
}

const SearchButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modifierKey, setModifierKey] = useState("⌘");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMac = window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      setModifierKey(isMac ? "⌘" : "Ctrl");
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsModalOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Dialog.Trigger>
        <Flex asChild className="search-button" gap="2">
          <Button variant="soft" color="gray" highContrast size="3">
            <SearchIcon width="18px" />
            <Text>Search</Text>
            <Flex ml="auto" gap="1">
              <Badge>{modifierKey}</Badge>
              <Badge>K</Badge>
            </Flex>
          </Button>
        </Flex>
      </Dialog.Trigger>
      <SearchModal />
    </Dialog.Root>
  );
};

type SearchResultHit = Hit<{
  url: string;
  content: string;
  hierarchy: {
    lvl0: string | null;
    lvl1: string | null;
    lvl2: string | null;
    lvl3: string | null;
    lvl4: string | null;
    lvl5: string | null;
    lvl6: string | null;
  };
  _snippetResult?: {
    content?: SnippetResultItem;
  };
}>;

function SearchResultItem({
  hit,
  interactionMode,
  setInteractionMode,
}: {
  hit: SearchResultHit;
  interactionMode: "keyboard" | "mouse" | "none";
  setInteractionMode: (mode: "keyboard" | "mouse" | "none") => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const breadcrumbs = useMemo(() => {
    if (!hit.hierarchy) return undefined;
    const items = Object.values(hit.hierarchy);
    return items.filter(Boolean).slice(0, -1).join(" > ");
  }, [hit]);

  const highlight = useMemo(() => {
    if (!hit._highlightResult || !hit._highlightResult.hierarchy) return undefined;
    const items = Object.values(hit._highlightResult.hierarchy);
    const match = items.find((item) => item.matchLevel === "full");
    if (!match) return items[0]?.value;
    return match?.value;
  }, [hit]);

  const content = useMemo(() => {
    if (!hit.content) return undefined;
    return `${hit.content.slice(0, 100)}...`;
  }, [hit]);

  const onMouseEnter = useCallback(() => {
    if (!ref.current) return;
    if (interactionMode === "keyboard") return;
    const searchResultItems = ref.current.parentNode.querySelectorAll("li");
    const searchResultItemsArray = Array.from(searchResultItems);
    const activeItemIndex = searchResultItemsArray.findIndex((item) => item.getAttribute("data-active") === "true");
    if (activeItemIndex !== -1) {
      searchResultItemsArray[activeItemIndex].setAttribute("data-active", "false");
    }
    ref.current.setAttribute("data-active", "true");
  }, [interactionMode]);

  const onMouseMove = useCallback(() => {
    if (!ref.current) return;
    if (interactionMode === "keyboard") {
      setInteractionMode("mouse");
      ref.current.setAttribute("data-active", "false");
    }
  }, [interactionMode]);

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    if (interactionMode === "mouse") {
      setInteractionMode("none");
    }
    ref.current.setAttribute("data-active", "false");
  }, []);

  if (!highlight) return null;

  return (
    <li
      className="search-modal__item"
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      <Link href={hit.url} className="reset-link">
        <Flex direction="column" gap="1" p="2" className="search-result-item">
          {highlight && <Text as="div" size="3" mt="1" dangerouslySetInnerHTML={{ __html: highlight }} />}
          <Text as="div" size="2" color="gray" trim="both">
            {breadcrumbs}
          </Text>
          {content && <Text as="div" color="gray" size="2" mt="1" dangerouslySetInnerHTML={{ __html: content }} />}
        </Flex>
      </Link>
    </li>
  );
}

function SearchModal() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [results, setResults] = useState<Record<TabType, SearchResponse | null>>({
    all: null,
    tutorial: null,
    guide: null,
    "sdk-reference": null,
    "api-reference": null,
  });
  const [searchState, setSearchState] = useState<"idle" | "loading" | "error" | "fetched">("idle");
  const [interactionMode, setInteractionMode] = useState<"keyboard" | "mouse" | "none">("none");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery) {
        setResults({ all: null, tutorial: null, guide: null, "sdk-reference": null, "api-reference": null });
        return;
      }

      if (searchState !== "fetched") setSearchState("loading");
      try {
        const searchPromises = TABS.map((tab) => searchAlgolia(searchQuery, tab));
        const searchResults = await Promise.all(searchPromises);

        const newResults = TABS.reduce(
          (acc, tab, index) => {
            acc[tab] = searchResults[index];
            return acc;
          },
          {} as Record<TabType, SearchResponse>,
        );

        setResults(newResults);
        setSearchState("fetched");
      } catch (e) {
        setSearchState("error");
        console.error(e);
      }
    },
    [searchState],
  );

  const debouncedSearch = useCallback(debounce(performSearch, 300), [performSearch]);
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  const onNavigateToNextItem = useCallback(() => {
    if (!searchResultsRef.current) return;
    console.log("keydown");
    setInteractionMode("keyboard");
    const searchResultItems = searchResultsRef.current.querySelectorAll("li");
    const searchResultItemsArray = Array.from(searchResultItems);
    const activeItemIndex = searchResultItemsArray.findIndex((item) => item.getAttribute("data-active") === "true");
    let nextItemIndex = activeItemIndex === -1 ? 0 : activeItemIndex + 1;
    if (nextItemIndex >= searchResultItemsArray.length) nextItemIndex = 0;

    if (activeItemIndex !== -1) {
      searchResultItemsArray[activeItemIndex].setAttribute("data-active", "false");
    }
    searchResultItemsArray[nextItemIndex].setAttribute("data-active", "true");
    searchResultItemsArray[nextItemIndex].scrollIntoView({
      behavior: "instant",
      block: "nearest",
    });
  }, []);

  const onNavigateToPrevItem = useCallback(() => {
    if (!searchResultsRef.current) return;
    setInteractionMode("keyboard");
    const searchResultItems = searchResultsRef.current.querySelectorAll("li");
    const searchResultItemsArray = Array.from(searchResultItems);
    const activeItemIndex = searchResultItemsArray.findIndex((item) => item.getAttribute("data-active") === "true");
    let nextItemIndex = activeItemIndex === -1 ? searchResultItemsArray.length - 1 : activeItemIndex - 1;
    if (nextItemIndex === -1) nextItemIndex = searchResultItemsArray.length - 1;

    if (activeItemIndex !== -1) {
      searchResultItemsArray[activeItemIndex].setAttribute("data-active", "false");
    }
    searchResultItemsArray[nextItemIndex].setAttribute("data-active", "true");
    searchResultItemsArray[nextItemIndex].scrollIntoView({
      behavior: "instant",
      block: "nearest",
    });
  }, []);

  const onSelectItem = useCallback(() => {
    if (!searchResultsRef.current) return;
    const activeItem = searchResultsRef.current.querySelector("li[data-active='true']");
    if (!activeItem) return;
    const link = activeItem.querySelector("a");
    if (!link) return;
    link.click();
    setSearchState("idle");
    setInteractionMode("none");
    setQuery("");
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        onNavigateToNextItem();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        onNavigateToPrevItem();
      } else if (event.key === "Enter") {
        event.preventDefault();
        onSelectItem();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const currentHits = (results[activeTab]?.hits as SearchResultHit[]) || [];

  return (
    <Dialog.Content align="start" maxWidth="700px" maxHeight="60vh" className="search-modal">
      <Box p="2">
        <TextField.Root
          ref={inputRef}
          type="text"
          className="search-modal__input"
          autoFocus
          placeholder="Search for anything..."
          value={query}
          onChange={handleQueryChange}
          size="3"
        >
          <TextField.Slot>
            <SearchIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>
      </Box>
      {searchState === "idle" || searchState === "loading" ? null : (
        <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
          <Tabs.List>
            <Tabs.Trigger key="all" value="all">
              All
              {results["all"] && (
                <Badge ml="2" color="gray" variant="solid" radius="full">
                  {results["all"]!.nbHits}
                </Badge>
              )}
            </Tabs.Trigger>
            <Tabs.Trigger key="tutorial" value="tutorial">
              Tutorials
              {results["tutorial"] && (
                <Badge ml="2" color="gray" variant="solid" radius="full">
                  {results["tutorial"]!.nbHits}
                </Badge>
              )}
            </Tabs.Trigger>
            <Tabs.Trigger key="guide" value="guide">
              Guides
              {results["guide"] && (
                <Badge ml="2" color="gray" variant="solid" radius="full">
                  {results["guide"]!.nbHits}
                </Badge>
              )}
            </Tabs.Trigger>
            <Tabs.Trigger key="sdk-reference" value="sdk-reference">
              SDK References
              {results["sdk-reference"] && (
                <Badge ml="2" color="gray" variant="solid" radius="full">
                  {results["sdk-reference"]!.nbHits}
                </Badge>
              )}
            </Tabs.Trigger>
            <Tabs.Trigger key="api-reference" value="api-reference">
              API References
              {results["api-reference"] && (
                <Badge ml="2" color="gray" variant="solid" radius="full">
                  {results["api-reference"]!.nbHits}
                </Badge>
              )}
            </Tabs.Trigger>
          </Tabs.List>

          <Box
            ref={searchResultsRef}
            className="search-modal__results"
            style={{ minHeight: "200px", maxHeight: "50vh", overflowY: "auto" }}
          >
            {searchState === "fetched" && results[activeTab]?.hits?.length === 0 && (
              <Box className="search-modal__no-results">
                <Text size="7" color="gray">
                  No results found
                </Text>
              </Box>
            )}
            {searchState === "fetched" && results[activeTab]?.hits?.length > 0 && (
              <>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {currentHits.map((hit, index) => (
                    <SearchResultItem
                      key={hit.objectID}
                      hit={hit}
                      interactionMode={interactionMode}
                      setInteractionMode={setInteractionMode}
                    />
                  ))}
                </ul>
              </>
            )}
          </Box>
        </Tabs.Root>
      )}
    </Dialog.Content>
  );
}

export const Search = {
  Button: SearchButton,
};
