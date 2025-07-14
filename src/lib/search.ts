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

export async function search(
  query: string,
  indexes?: IndexName[],
  type?: SearchResultType,
): Promise<SearchResult[] | null> {
  const indexNames = indexes || ["supertokens_documentation"];
  const facetFilters = type ? [`type:${type}`] : undefined;
  const cacheKey = `${indexNames.join(":")}-${query}-${facetFilters?.join(":")}`;

  if (SearchCache[cacheKey] && SearchCache[cacheKey].timestamp > new Date(Date.now() - CacheTTL)) {
    return SearchCache[cacheKey].results;
  }

  try {
    const response = await client.search<SearchResultHit>({
      requests: indexNames.map((indexName) => ({
        indexName,
        query,
        facetFilters,
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
        let highlight: string | undefined = undefined;
        const items = Object.values(hit._highlightResult.hierarchy);
        const lastItem = items[items.length - 1];
        if (!lastItem || lastItem.matchLevel === "none") {
          const levels = Object.values(hit.hierarchy).filter(Boolean);
          highlight = levels[levels.length - 1];
        } else {
          highlight = lastItem.value;
        }
        if (!highlight) {
          console.warn("No highlight found for hit", hit);
        }

        let content = hit.content;
        if (hit._highlightResult?.content) {
          // @ts-expect-error
          content = hit._highlightResult.content?.value;
        }

        let hierarchy: string[] = [];
        if (hit.hierarchy) {
          hierarchy = Object.values(hit.hierarchy).filter(Boolean);
        }
        return {
          id: hit.objectID,
          highlight,
          content,
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
