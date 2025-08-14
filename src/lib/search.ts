import { searchClient, SearchResponses } from "@algolia/client-search";
import type { Hit } from "@algolia/client-search";

type SearchResultType = "guide" | "tutorial" | "sdk-reference" | "api-reference";

export type ParsedSearchResult = {
  index: "supertokens_documentation";
  id: string;
  url: string;
  highlight: {
    content: string;
    attribute: string;
  };
  meta: {
    category: string;
    hierarchy: string[];
    type: SearchResultType;
  };
};

type DocumentationSearchResult = {
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
};

type ApiReferenceSearchResult = {
  endpoint: {
    path: string;
    method: string;
    summary: string;
    description?: string;
    operationId?: string;
    tags: string[];
    deprecated: boolean;
    path_depth: number;
  };
  apiType: string;
  version?: string;
};

type SdkReferenceSearchResult = {
  name: string;
  type: "variable" | "function" | "class" | "type" | "method";
  language: "typescript" | "go" | "python";
  repository: string;
  file: string;
  line: number;
  content: string;
  comments?: string;
  signature?: string;
  returnType?: string;
  namespace: string;
  deprecated: boolean;
};

type SearchResultHit = Hit<DocumentationSearchResult> | Hit<ApiReferenceSearchResult> | Hit<SdkReferenceSearchResult>;

const client = searchClient("HQ5R0VRJGG", "b6f38b3627dcd0642b67f24fe2e1a8eb");
const SearchCache: Record<string, { results: SearchResult[]; timestamp: Date; cleanupFn: NodeJS.Timeout }> = {};
const CacheTTL = 1000 * 60 * 5;
type IndexName = "supertokens_documentation" | "supertokens_api_references" | "supertokens_sdk_references";

type DocumentationIndexPageType = "guide" | "tutorial" | "sdk-reference" | "api-reference";
type DocumentationIndexTypeFacetFilter = `type:${DocumentationIndexPageType}`;

type QueryParameters = {
  indexName: IndexName;
  facetFilters?: DocumentationIndexTypeFacetFilter[] | DocumentationIndexTypeFacetFilter[][];
};

export async function search(query: string, _parameters?: QueryParameters[]): Promise<SearchResult[] | null> {
  const parameters = _parameters || [
    { indexName: "supertokens_documentation" },
    { indexName: "supertokens_api_references" },
    { indexName: "supertokens_sdk_references" },
  ];
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
    console.log("search");
    console.log(SearchCache[cacheKey]);
    if (SearchCache[cacheKey]) {
      clearTimeout(SearchCache[cacheKey].cleanupFn);
    }
    console.log(response);
    const results = parseResponse(response);
    console.log(results);
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
        if (indexResponse.index === "supertokens_sdk_references") {
          console.log(hit);
          return null;
        } else if (indexResponse.index === "supertokens_api_references") {
          console.log(hit);
          return null;
        }

        return parseDocumentationSearchResult(hit as Hit<DocumentationSearchResult>);
      });
    })
    .flat()
    .filter(Boolean);
}

function parseDocumentationSearchResult(hit: Hit<DocumentationSearchResult>): SearchResult {
  if (!hit._highlightResult || !hit._highlightResult.hierarchy) {
    console.warn("No highlight result found for hit", hit);
    return undefined;
  }

  const highlight = extractHighlight(hit);
  if (!highlight) {
    console.warn("No highlight found for hit", hit);
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
}

function parseApiReferenceSearchResult(hit: Hit<SearchResultHit>): SearchResult {
  if (!hit._highlightResult || !hit._highlightResult.hierarchy) {
    console.warn("No highlight result found for hit", hit);
    return undefined;
  }

  const highlight = extractHighlight(hit);
  if (!highlight) {
    console.warn("No highlight found for hit", hit);
  }

  const url = "";

  return {
    id: hit.objectID,
    highlight,
    url,
    type: "api-reference",
    hierarchy,
    meta: {
      category: hit.category,
    },
  };
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
