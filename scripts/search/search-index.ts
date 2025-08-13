import { algoliasearch, Algoliasearch } from "algoliasearch";

const APPLICATION_ID = process.env.ALGOLIA_APPLICATION_ID;
const API_KEY = process.env.ALGOLIA_ADMIN_API_KEY;

export abstract class SearchIndex {
  client: Algoliasearch;
  abstract indexName: string;

  constructor() {
    if (!APPLICATION_ID || !API_KEY) {
      throw new Error("Missing required environment variables: ALGOLIA_APP_ID or ALGOLIA_ADMIN_API_KEY");
    }
    this.client = algoliasearch(APPLICATION_ID, API_KEY);
  }

  abstract updateDocuments(): Promise<void>;
  abstract updateConfiguration(): Promise<void>;
}
