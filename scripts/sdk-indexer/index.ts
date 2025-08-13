import { mkdir, exists } from "node:fs/promises";
import { resolve, join } from "node:path";
import { $, file, write } from "bun";
import { algoliasearch } from "algoliasearch";
import { TypeScriptSymbolExtractor } from "./typescript-symbol-extractor";
import { GoSymbolExtractor } from "./go-symbol-extractor";
import { PythonSymbolExtractor } from "./python-symbol-extractor";
import { SymbolExtractor, Symbol } from "./types";
import { BaseSymbolExtractor } from "./symbol-extractor";

const TMP_DIR_PATH = "./tmp";

type Repository = {
  url: string;
  files: { path: string; module: string; extract?: string[] }[];
  name: string;
  language: "typescript" | "go" | "python";
};

type IndexDocument = {
  name: string;
  type: "function" | "class" | "variable" | "type" | "method";
  meta: Record<string, unknown>;
  content: string;
  file: string;
  line: number;
};

(async () => {
  const repositories: Repository[] = [
    {
      url: "https://github.com/supertokens/supertokens-node",
      files: [{ path: "./lib/ts/index.ts", module: "SuperTokens" }],
      name: "supertokens-node",
      language: "typescript",
    },
  ];
  const documents: IndexDocument[] = [];

  console.log("Initializing SDK indexer");
  try {
    await init();

    for (const repository of repositories) {
      console.log(`Extracting symbols from ${repository.name}`);
      await cloneRepository(repository);
      const symbols = await extractSymbols(repository);
      console.log(symbols);
      const repositoryDocuments = transformSymbolsToDocuments(symbols, repository);
      console.log(repositoryDocuments);
      documents.push(...repositoryDocuments);
    }

    await write("index.json", JSON.stringify(documents, null, 2));

    await updateIndex(documents);
  } catch (e) {
    console.error("Indexing failed");
    console.error(e);
    process.exit(1);
  }
})();

async function init() {
  const tmpDirPath = "./tmp";
  const tmpDirExists = await exists(tmpDirPath);
  if (!tmpDirExists) {
    mkdir(tmpDirPath);
  }
}

async function cloneRepository(repository: Repository) {
  const repositoryDirectoryPath = `./tmp/${repository.name}`;
  const repositoryDirectoryExists = await exists(repositoryDirectoryPath);
  if (repositoryDirectoryExists) {
    return;
  }
  console.log(`Cloning ${repository.url}`);
  await $`git clone ${repository.url} ${repository.name} --depth 1`.cwd("./tmp");
}

const ExtractorsMap = {
  typescript: TypeScriptSymbolExtractor,
  go: GoSymbolExtractor,
  python: PythonSymbolExtractor,
} as const;

async function extractSymbols(repository: Repository): Promise<Symbol[]> {
  const ExtractorClass = ExtractorsMap[repository.language];
  if (!ExtractorClass) throw new Error(`No extractor found for language ${repository.language}`);
  const extractor = new ExtractorClass(repository.files.map((f) => f.path));
  const basePath = resolve(`${TMP_DIR_PATH}/${repository.name}`);
  return extractor.extract(
    basePath,
    repository.files.map((f) => f.path),
  );
}

function transformSymbolsToDocuments(symbols: Symbol[], repository: Repository): IndexDocument[] {
  return repository.files
    .map((file) => {
      const absolutePath = resolve(`${TMP_DIR_PATH}/${repository.name}/${file.path}`);
      const symbolsInFile = symbols.filter((symbol) => symbol.file === absolutePath);
      const relativePath = file.path.replace(`${TMP_DIR_PATH}/${repository.name}/`, "");

      return symbolsInFile.map((symbol) => {
        const meta: Record<string, unknown> = symbol.meta || {};

        return {
          name: symbol.name,
          type: symbol.type,
          meta,
          content: symbol.content,
          file: relativePath,
          line: symbol.line,
        };
      });
    })
    .flat();
}

async function updateIndex(documents: IndexDocument[]): Promise<void> {
  // Get Algolia configuration from environment variables
  const algoliaAppId = process.env.ALGOLIA_APP_ID || "SBR5UR2Z16";
  const algoliaApiKey = process.env.ALGOLIA_API_KEY || "3b419fe5e51516cc416f08dac7b9b253";
  const indexName = process.env.ALGOLIA_SDK_INDEX_NAME || "supertokens_sdk_reference";

  if (!algoliaAppId || !algoliaApiKey) {
    throw new Error("Algolia credentials not found. Please set ALGOLIA_APP_ID and ALGOLIA_API_KEY environment variables.");
  }

  console.log(`Updating Algolia index "${indexName}" with ${documents.length} documents...`);

  try {
    // Initialize Algolia client
    const client = algoliasearch(algoliaAppId, algoliaApiKey).initIngestion({ region: "us" });

    // Transform documents to Algolia records with objectID
    const records = documents.map((doc, index) => ({
      ...doc,
      objectID: `${doc.file.replace(/[^a-zA-Z0-9]/g, "_")}_${doc.name}_${doc.line}_${index}`,
      // Add additional searchable fields
      searchableContent: `${doc.name} ${doc.type} ${doc.content}`,
      repository: doc.file.split('/')[0] || 'unknown',
      language: getLanguageFromFile(doc.file),
    }));

    // Clear existing index content first (optional - remove if you want to append)
    console.log("Clearing existing index content...");
    await client.push({
      indexName,
      pushTaskPayload: {
        action: "clear",
      },
    });

    // Add new records in batches to avoid hitting API limits
    const batchSize = 100;
    const batches = [];
    
    for (let i = 0; i < records.length; i += batchSize) {
      batches.push(records.slice(i, i + batchSize));
    }

    console.log(`Uploading ${records.length} records in ${batches.length} batches...`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Uploading batch ${i + 1}/${batches.length} (${batch.length} records)...`);
      
      const response = await client.push({
        indexName,
        pushTaskPayload: {
          action: "addObject",
          records: batch,
        },
      });

      console.log(`Batch ${i + 1} uploaded successfully. Task ID: ${response.taskID}`);
    }

    console.log(`✅ Successfully updated Algolia index "${indexName}" with ${records.length} SDK symbols`);
  } catch (error) {
    console.error("❌ Failed to update Algolia index:", error);
    throw error;
  }
}

// Helper function to determine language from file path
function getLanguageFromFile(filePath: string): string {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    return 'typescript';
  } else if (filePath.endsWith('.go')) {
    return 'go';
  } else if (filePath.endsWith('.py')) {
    return 'python';
  }
  return 'unknown';
}
