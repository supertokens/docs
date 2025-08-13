import { ApiReferenceIndex } from "./api-reference-index";
import { SdkReferenceIndex } from "./sdk-reference-index";

const apiReferenceIndex = new ApiReferenceIndex();
const sdkReferenceIndex = new SdkReferenceIndex();

const SearchIndexes = {
  [apiReferenceIndex.indexName]: apiReferenceIndex,
  [sdkReferenceIndex.indexName]: sdkReferenceIndex,
};

async function main() {
  const args = process.argv.slice(2);

  if (args.length !== 1) {
    console.error("Usage: bun run scripts/search/index.ts <index-name>");
    process.exit(1);
  }

  const indexName = args[0];
  const searchIndex = SearchIndexes[indexName];
  if (!searchIndex) {
    console.error(`Invalid index name: ${indexName}`);
    process.exit(1);
  }

  try {
    await searchIndex.updateDocuments();
  } catch (error) {
    console.error("❌ Error updating API reference index:", error);
    throw error;
  }
}

(async () => {
  await main();
})();
