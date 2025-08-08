import { searchClient, SearchResponses } from "@algolia/client-search";
import type { Hit } from "@algolia/client-search";

type SearchResultType = "guide" | "tutorial" | "sdk-reference" | "api-reference";

export type SearchResult = {
  id: string;
  url: string;
  content?: string;
  highlight: string;
  type: SearchResultType;
  hierarchy: string[];
  meta: Record<string, unknown>;
};

type SearchResultHit = Hit<{
  anchor: string;
  category: string;
  content: string;
  type: SearchResultType;
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
const SearchCache: Record<string, { results: SearchResult[]; timestamp: Date; cleanupFn: NodeJS.Timeout }> = {};
const CacheTTL = 1000 * 60 * 5;
type IndexName = "supertokens_documentation" | "supertokens_api_reference" | "supertokens_github";

type DocumentationIndexPageType = "guide" | "tutorial" | "sdk-reference" | "api-reference";
type DocumentationIndexTypeFacetFilter = `type:${DocumentationIndexPageType}`;

type QueryParameters = {
  indexName: "supertokens_documentation";
  facetFilters?: DocumentationIndexTypeFacetFilter[] | DocumentationIndexTypeFacetFilter[][];
};

export async function search(query: string, _parameters?: QueryParameters[]): Promise<SearchResult[] | null> {
  const parameters = _parameters || [{ indexName: "supertokens_documentation" }];
  const cacheKey = parameters.map((p) => `${p.indexName}-${query}-${p.facetFilters?.join(":")}`).join(";");

  if (SearchCache[cacheKey] && SearchCache[cacheKey].timestamp > new Date(Date.now() - CacheTTL)) {
    return SearchCache[cacheKey].results;
  }

  try {
    const response = await client.search<SearchResultHit>({
      requests: parameters.map((param) => ({
        indexName: param.indexName,
        query,
        facetFilters: param.facetFilters,
        offset: 0,
        length: 50,
        highlightPreTag: "<mark>",
        highlightPostTag: "</mark>",
        snippetEllipsisText: "…",
        attributesToSnippet: [
          "hierarchy.lvl1:10",
          "hierarchy.lvl2:10",
          "hierarchy.lvl3:10",
          "hierarchy.lvl4:10",
          "content:20",
          "category:10",
        ],
      })),
    });
    if (SearchCache[cacheKey]) {
      clearTimeout(SearchCache[cacheKey].cleanupFn);
    }
    const results = parseResponse(response);
    SearchCache[cacheKey] = {
      results,
      timestamp: new Date(),
      cleanupFn: setTimeout(() => {
        delete SearchCache[cacheKey];
      }, CacheTTL),
    };
    return results;
  } catch (e) {
    console.error(e);
    return null;
  }
}

function parseResponse(response: SearchResponses<SearchResultHit>): SearchResult[] {
  return response.results
    .map((indexResponse) => {
      if (!("hits" in indexResponse)) {
        console.warn("No hits found in index response", indexResponse);
        return [];
      }
      return indexResponse.hits.map((hit) => {
        if (!hit._highlightResult || !hit._highlightResult.hierarchy) {
          console.warn("No highlight result found for hit", hit);
          return undefined;
        }

        const highlight = extractHighlight(hit);
        if (!highlight) {
          console.warn("No highlight found for hit", hit);
          console.log(Object.values(hit._snippetResult.hierarchy));
        }
        let hierarchy: string[] = [];
        if (hit.hierarchy) {
          hierarchy = Object.values(hit.hierarchy).filter(Boolean);
        }
        return {
          id: hit.objectID,
          highlight,
          content: "",
          url: hit.url,
          type: hit.type,
          hierarchy,
          meta: {
            category: hit.category,
          },
        };
      });
    })
    .flat()
    .filter(Boolean);
}

function extractHighlight(hit: Hit<SearchResultHit>): string | undefined {
  if (!hit._snippetResult) {
    return undefined;
  }

  const snippetResult = hit._snippetResult;

  // @ts-ignore
  if (snippetResult.content && snippetResult.content?.matchLevel !== "none") {
    // @ts-ignore
    return snippetResult.content.value;
  }

  // @ts-ignore
  if (snippetResult.category && snippetResult.category.matchLevel !== "none") {
    const hierarchyItems = Object.values(snippetResult.hierarchy);
    const lastHierarchyItem = hierarchyItems[hierarchyItems.length - 1];
    // @ts-ignore
    return `${formatCategory(snippetResult.category.value)} - ${lastHierarchyItem.value}`;
  }

  // If the match is based on headings get two values to prevent multiple rows with the same value
  const hierarchyItems = Object.values(snippetResult.hierarchy);
  const matchedHierarchyItemIndex = hierarchyItems.findIndex((item) => item?.matchLevel !== "none");
  if (matchedHierarchyItemIndex === -1) {
    console.warn("No match level found for hierarchy items", hierarchyItems);
    return undefined;
  }

  const matchedHierarchyItem = hierarchyItems[matchedHierarchyItemIndex];
  const nextIndex = matchedHierarchyItemIndex + 1;
  if (nextIndex >= hierarchyItems.length) {
    return matchedHierarchyItem.value;
  } else {
    const nextHierarchyItem = hierarchyItems[nextIndex];
    return `${matchedHierarchyItem.value} - ${nextHierarchyItem?.value}`;
  }
}

function formatCategory(label: string): string {
  return label
    .split(" ")
    .map((word) => {
      if (word === "sdk") return "SDK";
      if (word === "cdi") return "CDI";
      if (word === "fdi") return "FDI";
      if (word === "ai") return "AI";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
