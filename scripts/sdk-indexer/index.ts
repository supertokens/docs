import { mkdir, exists } from "node:fs/promises";
import { resolve, join } from "node:path";
import { $, file, write } from "bun";
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

    // await updateIndex(documents);
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
  // TODO: Implement index update logic
}
