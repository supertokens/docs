/**
 * Unified search functionality that queries multiple Algolia indexes
 */

import { algoliasearch } from "algoliasearch";

const APPLICATION_ID = process.env.ALGOLIA_APP_ID || "SBR5UR2Z16";
const API_KEY = process.env.ALGOLIA_SEARCH_API_KEY || "";

const INDEXES = {
  API_REFERENCE: "supertokens-api-reference",
  DOCUMENTATION: "supertokens-documentation",
  SDK_REFERENCE: "supertokens-sdk-reference",
};

interface SearchOptions {
  query: string;
  filters?: {
    documentTypes?: ("api" | "docs" | "sdk")[];
    languages?: string[];
    categories?: string[];
  };
  hitsPerIndex?: number;
  maxTotalHits?: number;
}

interface SearchHit {
  objectID: string;
  title?: string;
  content?: string;
  url?: string;
  type: string;
  language?: string;
  _highlightResult?: Record<string, { value: string; matchLevel: string }>;
}

interface AggregatedSearchResult {
  query: string;
  totalHits: number;
  results: {
    api: SearchHit[];
    documentation: SearchHit[];
    sdk: SearchHit[];
  };
  aggregatedResults: SearchHit[];
}

class UnifiedSearch {
  private client;

  constructor() {
    this.client = algoliasearch(APPLICATION_ID, API_KEY);
  }

  async search(options: SearchOptions): Promise<AggregatedSearchResult> {
    const { query, filters = {}, hitsPerIndex = 5, maxTotalHits = 15 } = options;

    const indexesToSearch = [
      ...(filters.documentTypes?.includes("api") ? [INDEXES.API_REFERENCE] : []),
      ...(filters.documentTypes?.includes("docs") ? [INDEXES.DOCUMENTATION] : []),
      ...(filters.documentTypes?.includes("sdk") ? [INDEXES.SDK_REFERENCE] : []),
    ];

    // If no specific document types are specified, search all indexes
    const searchIndexes = indexesToSearch.length > 0 ? indexesToSearch : Object.values(INDEXES);

    // Perform multi-index search
    const searchPromises = searchIndexes.map(async (indexName) => {
      const index = this.client.searchIndex(indexName);

      // Construct Algolia search query with filters
      const searchQuery = {
        query,
        hitsPerPage: hitsPerIndex,
        attributesToRetrieve: ["*"],
        attributesToHighlight: ["title", "content", "name"],
        highlightPreTag: "<mark>",
        highlightPostTag: "</mark>",
        filters: this.constructFilters(filters, indexName),
      };

      return index.search(searchQuery);
    });

    const searchResults = await Promise.all(searchPromises);

    // Categorize and aggregate results
    const categorizedResults = {
      api: [],
      documentation: [],
      sdk: [],
    };

    searchResults.forEach((result, index) => {
      const indexName = searchIndexes[index];
      const category = this.getIndexCategory(indexName);

      categorizedResults[category] = result.hits.map((hit) => ({
        ...hit,
        type: category,
      }));
    });

    // Combine and rank results
    const aggregatedResults = this.rankResults([
      ...categorizedResults.api,
      ...categorizedResults.documentation,
      ...categorizedResults.sdk,
    ]);

    return {
      query,
      totalHits: aggregatedResults.length,
      results: categorizedResults,
      aggregatedResults,
    };
  }

  private getIndexCategory(indexName: string): "api" | "documentation" | "sdk" {
    switch (indexName) {
      case INDEXES.API_REFERENCE:
        return "api";
      case INDEXES.DOCUMENTATION:
        return "documentation";
      case INDEXES.SDK_REFERENCE:
        return "sdk";
      default:
        return "documentation";
    }
  }

  private constructFilters(filters: SearchOptions["filters"], indexName: string): string {
    const filterClauses: string[] = [];

    // Language filter
    if (filters.languages && filters.languages.length > 0) {
      const languageFilter = filters.languages.map((lang) => `language:${lang}`).join(" OR ");
      filterClauses.push(`(${languageFilter})`);
    }

    // Category filter (different for each index type)
    if (filters.categories && filters.categories.length > 0) {
      let categoryAttribute = "category";
      switch (indexName) {
        case INDEXES.API_REFERENCE:
          categoryAttribute = "apiName";
          break;
        case INDEXES.DOCUMENTATION:
          categoryAttribute = "category";
          break;
        case INDEXES.SDK_REFERENCE:
          categoryAttribute = "namespace";
          break;
      }

      const categoryFilter = filters.categories.map((cat) => `${categoryAttribute}:${cat}`).join(" OR ");
      filterClauses.push(`(${categoryFilter})`);
    }

    return filterClauses.join(" AND ");
  }

  private rankResults(results: SearchHit[]): SearchHit[] {
    // Basic ranking algorithm
    return results
      .sort((a, b) => {
        // Exact match bonus
        const exactMatchBonus = (hit: SearchHit) =>
          hit._highlightResult?.title?.matchLevel === "full" || hit._highlightResult?.name?.matchLevel === "full"
            ? 50
            : 0;

        // Type weighting
        const typeWeight = (hit: SearchHit) => {
          switch (hit.type) {
            case "api":
              return 1.2;
            case "sdk":
              return 1.1;
            default:
              return 1.0;
          }
        };

        // Compute scores
        const scoreA = exactMatchBonus(a) * typeWeight(a);
        const scoreB = exactMatchBonus(b) * typeWeight(b);

        return scoreB - scoreA;
      })
      .slice(0, 15); // Limit total results
  }
}

export default new UnifiedSearch();
