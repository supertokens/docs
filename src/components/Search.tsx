import { Badge, Inset, Box, Button, Dialog, Flex, Separator, Tabs, Text, TextField } from "@radix-ui/themes";
import { searchClient, SearchResponse } from "@algolia/client-search";
import type { Hit } from "@algolia/client-search";
import Link from "@docusaurus/Link";
import SearchIcon from "/img/icons/search.svg";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import "./Search.scss";

type DocumentationSearchResultHit = Hit<{
  anchor: string;
  category: string;
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
  url: string;
}>;

const client = searchClient("SBR5UR2Z16", "d87c41f893c301f365d5bfc62e6631df");

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
      length: 50,
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

function SearchResultItem({
  hit,
  interactionMode,
  setInteractionMode,
}: {
  hit: DocumentationSearchResultHit;
  interactionMode: "keyboard" | "mouse" | "none";
  setInteractionMode: (mode: "keyboard" | "mouse" | "none") => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const breadcrumbs = useMemo(() => {
    if (!hit.hierarchy) return undefined;
    const items = Object.values(hit.hierarchy);
    return items.filter(Boolean).slice(0, -1).join(" › ");
  }, [hit]);

  const highlight = useMemo(() => {
    if (!hit._highlightResult || !hit._highlightResult.hierarchy) return undefined;
    const items = Object.values(hit._highlightResult.hierarchy);
    const lastItem = items[items.length - 1];
    if (!lastItem || lastItem.matchLevel === "none") {
      const levels = Object.values(hit.hierarchy).filter(Boolean);
      return levels[levels.length - 1];
    }
    return lastItem.value;
  }, [hit]);

  const content = useMemo(() => {
    let content = hit.content;
    if (hit._highlightResult?.content) {
      // @ts-expect-error
      content = hit._highlightResult.content?.value;
    }
    if (!content) return undefined;
    return `${content.slice(0, 100)}...`;
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
  const { results, query, changeQuery, pageType, changePageType, searchState, resetSearchState } = useSearch();
  const [interactionMode, setInteractionMode] = useState<"keyboard" | "mouse" | "none">("none");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const onNavigateToNextItem = useCallback(() => {
    if (!searchResultsRef.current) return;
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
    setInteractionMode("none");
    resetSearchState();
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

  return (
    <Dialog.Content
      align="start"
      maxWidth={{
        initial: "100%",
        sm: "700px",
      }}
      maxHeight={{
        initial: "100vh",
        sm: "60vh",
      }}
      className="search-modal"
    >
      <Box p="2">
        <TextField.Root
          ref={inputRef}
          type="text"
          className="search-modal__input"
          autoFocus
          placeholder="Search for anything..."
          value={query}
          onChange={(e) => changeQuery(e.target.value)}
          size="3"
        >
          <TextField.Slot>
            <SearchIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>
      </Box>
      {searchState === "idle" || (searchState === "loading" && !results) ? null : (
        <Tabs.Root value={pageType} onValueChange={(value: DocumentationPageType) => changePageType(value)}>
          <Tabs.List wrap="wrap" className="search-modal__tabs-list">
            <Tabs.Trigger key="all" value="all">
              All
              {/* {results && ( */}
              {/*   <Badge ml="2" color="gray" variant="solid" radius="full"> */}
              {/*     {resultsCountByPageType["all"]} */}
              {/*   </Badge> */}
              {/* )} */}
            </Tabs.Trigger>
            <Tabs.Trigger key="tutorial" value="tutorial">
              Tutorials
            </Tabs.Trigger>
            <Tabs.Trigger key="guide" value="guide">
              Guides
            </Tabs.Trigger>
            <Tabs.Trigger key="sdk-reference" value="sdk-reference">
              SDK References
            </Tabs.Trigger>
            <Tabs.Trigger key="api-reference" value="api-reference">
              API References
            </Tabs.Trigger>
          </Tabs.List>

          <Box ref={searchResultsRef} className="search-modal__results">
            {searchState === "fetched" && results?.length === 0 && (
              <Box className="search-modal__no-results">
                <Text size="7" color="gray">
                  No results found
                </Text>
              </Box>
            )}
            {searchState === "fetched" && results?.length > 0 && (
              <ul className="search-modal__results-list">
                {results.map((hit, index) => (
                  <SearchResultItem
                    key={hit.objectID}
                    hit={hit}
                    interactionMode={interactionMode}
                    setInteractionMode={setInteractionMode}
                  />
                ))}
              </ul>
            )}
          </Box>
        </Tabs.Root>
      )}
    </Dialog.Content>
  );
}

const AllPageTypes: Array<DocumentationPageType> = ["all", "tutorial", "guide", "sdk-reference", "api-reference"];

function useSearch() {
  const [query, setQuery] = useState("");
  const [pageType, setPageType] = useState<DocumentationPageType>("all");
  const [results, setResults] = useState<Array<Hit<DocumentationSearchResultHit>> | null>(null);
  const [searchState, setSearchState] = useState<"idle" | "loading" | "error" | "fetched">("idle");
  const indexName = "supertokens_documentation";

  const doSearch = useCallback(async (query: string, pageType: DocumentationPageType | null) => {
    if (!query) return;
    setSearchState("loading");
    const response = await searchAlgoliaIndex(indexName, query, pageType);
    setResults(response?.hits || null);
    setSearchState("fetched");
    return Promise.resolve().then(async () => {
      const additionalRequests = AllPageTypes.filter((type) => pageType !== type).map((type) => {
        return searchAlgoliaIndex(indexName, query, type);
      });
      await Promise.all(additionalRequests);
    });
  }, []);
  const debouncedSearch = useCallback(debounce(doSearch, 300), [doSearch]);

  const changeQuery = useCallback((query: string) => {
    setQuery(query);
    debouncedSearch(query, pageType);
  }, []);

  const changePageType = useCallback(
    async (type: DocumentationPageType | null) => {
      setPageType(type);
      const response = await searchAlgoliaIndex(indexName, query, type);
      setResults(response?.hits || null);
    },
    [query],
  );

  const resetSearchState = useCallback(() => {
    setQuery("");
    setPageType(null);
  }, []);

  return {
    results,
    query,
    changeQuery,
    pageType,
    changePageType,
    searchState,
    resetSearchState,
  };
}

export const Search = {
  Button: SearchButton,
};

type DocumentationPageType = "all" | "guide" | "tutorial" | "sdk-reference" | "api-reference";

const SearchCache: Record<string, { response: SearchResponse<DocumentationSearchResultHit> | null; timestamp: Date }> =
  {};
const CacheTTL = 1000 * 60 * 5;

async function searchAlgoliaIndex(
  index: string,
  query: string,
  pageType: DocumentationPageType,
): Promise<SearchResponse<DocumentationSearchResultHit> | null> {
  const cacheKey = `${index}-${query}-${pageType}`;
  const facetFilters = pageType !== "all" ? [`type:${pageType}`] : undefined;
  if (SearchCache[cacheKey] && SearchCache[cacheKey].timestamp > new Date(Date.now() - CacheTTL)) {
    return SearchCache[cacheKey].response;
  }

  try {
    const response = await client.searchSingleIndex<DocumentationSearchResultHit>({
      indexName: index,
      searchParams: {
        query,
        facets: ["type", "category"],
        facetFilters,
        offset: 0,
        length: 50,
        highlightPreTag: "<mark>",
        highlightPostTag: "</mark>",
        snippetEllipsisText: "…",
        attributesToSnippet: ["content:20"],
      },
    });
    SearchCache[cacheKey] = { response, timestamp: new Date() };
    return response;
  } catch (e) {
    SearchCache[cacheKey] = { response: null, timestamp: new Date() };
    return null;
  } finally {
    queueMicrotask(() => {
      for (const key in SearchCache) {
        const cacheEntry = SearchCache[key];
        if (cacheEntry.timestamp.getTime() + CacheTTL < new Date().getTime()) {
          delete SearchCache[key];
        }
      }
    });
  }
}
