import { Badge, Inset, Box, Button, Dialog, Flex, Separator, Tabs, Text, TextField } from "@radix-ui/themes";
import { searchClient, SearchResponse } from "@algolia/client-search";
import type { Hit } from "@algolia/client-search";
import Link from "@docusaurus/Link";
import SearchIcon from "/img/icons/search.svg";
import CloseIcon from "/img/icons/x.svg";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { search, SearchResult } from "../lib";

import "./Search.scss";

type SearchButtonContextType = {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
};

const SearchButtonContext = createContext<SearchButtonContextType>({
  isModalOpen: false,
  setIsModalOpen: () => {},
});

const SearchButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "/" && !isModalOpen) {
        event.preventDefault();
        setIsModalOpen((open) => !open);
      }
    },
    [isModalOpen],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <SearchButtonContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Trigger>
          <Flex asChild className="search-button" gap="2">
            <Button variant="soft" color="gray" highContrast size="3">
              <SearchIcon width="18px" />
              <Text>Search</Text>
              <Flex ml="auto" gap="1">
                <Badge>/</Badge>
              </Flex>
            </Button>
          </Flex>
        </Dialog.Trigger>
        <SearchModal />
      </Dialog.Root>
    </SearchButtonContext.Provider>
  );
};

type SearchModalContextType = {
  onCloseModal: () => void;
  query: string;
};

const SearchModalContext = createContext<SearchModalContextType>({} as SearchModalContextType);

function SearchModal() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isModalOpen, setIsModalOpen } = useContext(SearchButtonContext);
  const [selectedTab, setSelectedTab] = useState("all");
  const tabsRef = useRef<HTMLElement[]>(new Array(5).fill(null));

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (!event.ctrlKey) return;

    if (["1", "2", "3", "4", "5"].includes(event.key)) {
      const tabElement = tabsRef.current[Number(event.key) - 1];
      if (!tabElement) return;
      const tabValue = tabElement.getAttribute("data-value");
      if (!tabValue) return;
      setSelectedTab(tabValue);
    }

    if (event.key === "]") {
      const activeTabElementIndex = tabsRef.current.findIndex((el) => el.getAttribute("data-state") === "active");
      if (activeTabElementIndex === -1) return;
      const nextTabElement = tabsRef.current[(activeTabElementIndex + 1) % tabsRef.current.length];
      if (!nextTabElement) return;
      const nextTabValue = nextTabElement.getAttribute("data-value");
      if (!nextTabValue) return;
      setSelectedTab(nextTabValue);
    }

    if (event.key === "[") {
      const activeTabElementIndex = tabsRef.current.findIndex((el) => el.getAttribute("data-state") === "active");
      if (activeTabElementIndex === -1) return;
      const previousTabElement =
        tabsRef.current[(activeTabElementIndex + tabsRef.current.length - 1) % tabsRef.current.length];
      if (!previousTabElement) return;
      const previousTabValue = previousTabElement.getAttribute("data-value");
      if (!previousTabValue) return;
      setSelectedTab(previousTabValue);
    }
  }, []);

  const onCloseModal = useCallback(() => {
    setSearchQuery("");
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <SearchModalContext.Provider value={{ onCloseModal, query: searchQuery }}>
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
            type="text"
            className="search-modal__input"
            autoFocus
            placeholder="Search for anything..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            size="3"
          >
            <TextField.Slot>
              <SearchIcon height="16" width="16" />
            </TextField.Slot>

            <Flex ml="auto" align="center" gap="2" asChild>
              <TextField.Slot>
                <Dialog.Close>
                  <Badge className="search-modal__close-button">
                    <span>ESC</span>
                    <CloseIcon width="16px" height="16px" />
                  </Badge>
                </Dialog.Close>
              </TextField.Slot>
            </Flex>
          </TextField.Root>
        </Box>
        <Tabs.Root value={selectedTab} onValueChange={setSelectedTab}>
          <Tabs.List wrap="wrap" className="search-modal__tabs-list">
            <Tabs.Trigger
              key="all"
              value="all"
              data-value="all"
              ref={(el) => {
                tabsRef.current[0] = el;
              }}
            >
              All
            </Tabs.Trigger>
            <Tabs.Trigger
              key="tutorial"
              value="tutorial"
              data-value="tutorial"
              ref={(el) => {
                tabsRef.current[1] = el;
              }}
            >
              Tutorials
            </Tabs.Trigger>
            <Tabs.Trigger
              key="guide"
              value="guide"
              data-value="guide"
              ref={(el) => {
                tabsRef.current[2] = el;
              }}
            >
              Guides
            </Tabs.Trigger>
            <Tabs.Trigger
              key="sdk-reference"
              value="sdk-reference"
              data-value="sdk-reference"
              ref={(el) => {
                tabsRef.current[3] = el;
              }}
            >
              SDK References
            </Tabs.Trigger>
            <Tabs.Trigger
              key="api-reference"
              value="api-reference"
              data-value="api-reference"
              ref={(el) => {
                tabsRef.current[4] = el;
              }}
            >
              API References
            </Tabs.Trigger>
          </Tabs.List>
          <AllSearchResultsTabContent />
          <GuidesSearchResultsTabContent />
          <TutorialsSearchResultsTabContent />
          <SDKReferencesSearchResultsTabContent />
          <APIReferencesSearchResultsTabContent />
        </Tabs.Root>
      </Dialog.Content>
    </SearchModalContext.Provider>
  );
}

function AllSearchResultsTabContent() {
  const { query } = useContext(SearchModalContext);
  const searchFn = useCallback(async (searchQuery: string) => {
    return search(searchQuery);
  }, []);

  return (
    <SearchProvider searchFn={searchFn}>
      <Tabs.Content value="all">
        <SearchResultsList />
      </Tabs.Content>
    </SearchProvider>
  );
}

function GuidesSearchResultsTabContent() {
  const { query } = useContext(SearchModalContext);
  const searchFn = useCallback(async (searchQuery: string) => {
    return search(searchQuery, ["supertokens_documentation"], "guide");
  }, []);

  return (
    <SearchProvider searchFn={searchFn}>
      <Tabs.Content value="guide">
        <SearchResultsList />
      </Tabs.Content>
    </SearchProvider>
  );
}

function TutorialsSearchResultsTabContent() {
  const { query } = useContext(SearchModalContext);
  const searchFn = useCallback(async (searchQuery: string) => {
    return search(searchQuery, ["supertokens_documentation"], "tutorial");
  }, []);

  return (
    <SearchProvider searchFn={searchFn}>
      <Tabs.Content value="tutorial">
        <SearchResultsList />
      </Tabs.Content>
    </SearchProvider>
  );
}

function SDKReferencesSearchResultsTabContent() {
  const { query } = useContext(SearchModalContext);
  const searchFn = useCallback(async (searchQuery: string) => {
    return search(searchQuery, ["supertokens_documentation"], "sdk-reference");
  }, []);

  return (
    <SearchProvider searchFn={searchFn}>
      <Tabs.Content value="sdk-reference">
        <SearchResultsList />
      </Tabs.Content>
    </SearchProvider>
  );
}

function APIReferencesSearchResultsTabContent() {
  const { query } = useContext(SearchModalContext);
  const searchFn = useCallback(async (searchQuery: string) => {
    return search(searchQuery, ["supertokens_documentation"], "api-reference");
  }, []);

  return (
    <SearchProvider searchFn={searchFn}>
      <Tabs.Content value="api-reference">
        <SearchResultsList />
      </Tabs.Content>
    </SearchProvider>
  );
}

function NoResultsTabContent() {
  return (
    <Box className="search-modal__no-results">
      <Text size="7" color="gray">
        No results found
      </Text>
    </Box>
  );
}

type SearchContextType = {
  searchResults: SearchResult[] | null;
  searchState: "idle" | "loading" | "error" | "fetched";
};

const SearchContext = createContext<SearchContextType>({} as SearchContextType);

function SearchProvider({
  searchFn,
  children,
}: {
  searchFn: (query: string) => Promise<SearchResult[] | null>;
  children: React.ReactNode;
}) {
  const { query } = useContext(SearchModalContext);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [searchState, setSearchState] = useState<"idle" | "loading" | "error" | "fetched">("idle");

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery) {
        setResults(null);
        setSearchState("idle");
        return;
      }

      setSearchState("loading");
      const searchResults = await searchFn(searchQuery);
      setResults(searchResults);
      setSearchState("fetched");
    },
    [searchFn],
  );

  const debouncedSearch = useCallback(debounce(performSearch, 200), [performSearch]);

  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  return <SearchContext.Provider value={{ searchResults: results, searchState }}>{children}</SearchContext.Provider>;
}

export const Search = {
  Button: SearchButton,
};

type SearchResultListContextType = {
  interactionMode: "keyboard" | "mouse" | "none";
  setInteractionMode: (mode: "keyboard" | "mouse" | "none") => void;
};

const SearchResultListContext = createContext<SearchResultListContextType>({} as SearchResultListContextType);

function SearchResultsList() {
  const ref = useRef<HTMLDivElement>(null);
  const { searchResults, searchState } = useContext(SearchContext);
  const { onCloseModal } = useContext(SearchModalContext);
  const [interactionMode, setInteractionMode] = useState<"keyboard" | "mouse" | "none">("none");

  const onNavigateToNextItem = useCallback(() => {
    if (!ref.current) return;
    setInteractionMode("keyboard");
    const searchResultItems = ref.current.querySelectorAll("li");
    const searchResultItemsArray = Array.from(searchResultItems);
    const activeItemIndex = searchResultItemsArray.findIndex((item) => item.getAttribute("data-active") === "true");
    let nextItemIndex = activeItemIndex === -1 ? 0 : activeItemIndex + 1;
    if (nextItemIndex >= searchResultItemsArray.length) nextItemIndex = 0;

    if (activeItemIndex !== -1 && searchResultItemsArray[activeItemIndex]) {
      searchResultItemsArray[activeItemIndex].setAttribute("data-active", "false");
    }
    searchResultItemsArray[nextItemIndex].setAttribute("data-active", "true");
    searchResultItemsArray[nextItemIndex].scrollIntoView({
      behavior: "instant",
      block: "nearest",
    });
  }, []);

  const onNavigateToPrevItem = useCallback(() => {
    if (!ref.current) return;
    setInteractionMode("keyboard");
    const searchResultItems = ref.current.querySelectorAll("li");
    const searchResultItemsArray = Array.from(searchResultItems);
    const activeItemIndex = searchResultItemsArray.findIndex((item) => item.getAttribute("data-active") === "true");
    let nextItemIndex = activeItemIndex === -1 ? searchResultItemsArray.length - 1 : activeItemIndex - 1;
    if (nextItemIndex === -1) nextItemIndex = searchResultItemsArray.length - 1;

    if (activeItemIndex !== -1 && searchResultItemsArray[activeItemIndex]) {
      searchResultItemsArray[activeItemIndex].setAttribute("data-active", "false");
    }
    searchResultItemsArray[nextItemIndex].setAttribute("data-active", "true");
    searchResultItemsArray[nextItemIndex].scrollIntoView({
      behavior: "instant",
      block: "nearest",
    });
  }, []);

  const onSelectItem = useCallback(() => {
    if (!ref.current) return;
    const activeItem = ref.current.querySelector("li[data-active='true']");
    if (!activeItem) return;
    const link = activeItem.querySelector("a");
    if (!link) return;
    link.click();
    setInteractionMode("none");
    onCloseModal();
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
    <SearchResultListContext.Provider value={{ interactionMode, setInteractionMode }}>
      <Box ref={ref} className="search-modal__results">
        {(searchState === "idle" || (searchState === "loading" && !searchResults)) && (
          <Box className="search-modal__no-results">
            <Text size="5" color="gray">
              Start typing to search
            </Text>
          </Box>
        )}
        {searchState === "fetched" && searchResults?.length === 0 && (
          <Box className="search-modal__no-results">
            <Text size="7" color="gray">
              No results found
            </Text>
          </Box>
        )}
        {(searchState === "fetched" || searchState === "loading") && searchResults?.length > 0 && (
          <ul className="search-modal__results-list">
            {searchResults.map((result, index) => (
              <SearchResultListItem key={result.id} result={result} />
            ))}
          </ul>
        )}
      </Box>
    </SearchResultListContext.Provider>
  );
}

function SearchResultListItem({ result }: { result: SearchResult }) {
  const ref = useRef<HTMLLIElement>(null);
  const { interactionMode, setInteractionMode } = useContext(SearchResultListContext);
  const { onCloseModal } = useContext(SearchModalContext);
  const breadcrumbs = useMemo(() => {
    if (!result.hierarchy) return undefined;
    return result.hierarchy.join(" › ");
  }, [result]);

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

  const onClick = useCallback(() => {
    onCloseModal();
    setInteractionMode("none");
  }, []);

  const urlOrPath = useMemo(() => {
    const url = new URL(result.url);
    if (url.hostname.includes("supertokens")) {
      return url.pathname;
    }
    return result.url;
  }, [result]);

  return (
    <li
      className="search-modal__item"
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      <Link href={urlOrPath} onClick={onClick} className="reset-link">
        <Flex direction="column" gap="2" p="2" className="search-result-item">
          <Text
            className="search-modal__item-highlight"
            as="div"
            size="3"
            m="0"
            dangerouslySetInnerHTML={{ __html: result.highlight }}
          />
          <Text className="search-result__item-breadcrumbs" as="div" size="2" color="gray" trim="both">
            {breadcrumbs}
          </Text>
        </Flex>
      </Link>
    </li>
  );
}

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
