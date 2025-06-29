import { Card, Separator, Tabs, TextField, Text, Flex, Kbd, Button, Badge, Dialog, Box } from "@radix-ui/themes";
import { searchClient } from "@algolia/client-search";
import SearchIcon from "/img/icons/search.svg";
import { useCallback, useState } from "react";

import "./Search.scss";

const client = searchClient("SBR5UR2Z16", "d87c41f893c301f365d5bfc62e6631df");

// TODO:
// - Add an event listener for cmd/super + k that toggles the modal (setIsModalOpen)
// - Show the cmd or super key based on the OS
// - Implement the search modal
//   - It should call the algolia search function based on the user input (with some debounce)
//   - It should render the search results in a list. Use the current component as a reference of what is required
//   - It should show multiple tabs for different types of results. The component should perform searches for each type of tab and then show the count of results near the tab name.
//   - Each tab represents a different type search facet in algolia (except "all")
//   - Handle error states, empty results and loading.
//   - Add support for keyboard navigation (up/down arrows, enter, esc)

async function searchAlgolia(query: string, type?: "all" | "tutorial" | "guide" | "sdk-references" | "api-references") {
  const response = await client.searchSingleIndex({
    indexName: "supertokens_documentation",
    searchParams: {
      query,
      facets: ["type", "category"],
      facetFilters: type !== "all" ? [`type:${type}`] : undefined,
      offset: 0,
      length: 100,
    },
  });
  return response;
}

const SearchButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClick = useCallback(async () => {
    console.log("search clicked");
  }, []);

  return (
    <Dialog.Root open={isModalOpen}>
      <Flex asChild className="search-button" gap="2">
        <Button onClick={onClick} variant="soft" color="gray" highContrast size="3">
          <SearchIcon width="18px" />
          <Text>Search</Text>

          <Flex ml="auto" gap="1">
            <Badge>⌘</Badge>
            <Badge>K</Badge>
          </Flex>
        </Button>
      </Flex>
    </Dialog.Root>
  );
};

function SearchModal() {
  return (
    <Dialog.Content className="search-modal">
      <TextField.Root type="text" placeholder="Search" />
      <Tabs.Root defaultValue="all">
        <Tabs.List>
          <Tabs.Trigger value="all">All</Tabs.Trigger>
          <Tabs.Trigger value="tutorial">Tutorials</Tabs.Trigger>
          <Tabs.Trigger value="guide">Guides</Tabs.Trigger>
          <Tabs.Trigger value="sdk-references">SDK References</Tabs.Trigger>
          <Tabs.Trigger value="api-references">API References</Tabs.Trigger>
        </Tabs.List>
        <Separator />
        <Tabs.Content value="all">
          <Box>A description of what results are shown</Box>
          <Separator />
          <Box>The actual search results</Box>
        </Tabs.Content>
        <Tabs.Content value="tutorial"></Tabs.Content>
        <Tabs.Content value="guide"></Tabs.Content>
        <Tabs.Content value="sdk-references"></Tabs.Content>
        <Tabs.Content value="api-references"></Tabs.Content>
      </Tabs.Root>
    </Dialog.Content>
  );
}

export const Search = {
  Button: SearchButton,
};
