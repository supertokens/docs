/**
 * This file is used to create and update the Algolia SDK reference index.
 * Make sure to create an index that can work efficiently with SDK reference type documents.
 * Look into the sdk-indexer/types.ts file to get an idea of how the documents will look like.
 */

import fs from "fs-extra";
import path from "path";
import { algoliasearch } from "algoliasearch";
import { Symbol, SymbolExtractor } from "../sdk-indexer/types";

const APPLICATION_ID = process.env.ALGOLIA_APP_ID || "SBR5UR2Z16";
const API_KEY = process.env.ALGOLIA_ADMIN_API_KEY || "";
const INDEX_NAME = "supertokens-sdk-reference";

interface SDKReferenceDocument {
  objectID: string;
  name: string;
  type: "variable" | "function" | "class" | "type" | "method";
  language: "typescript" | "go" | "python";
  file: string;
  line: number;
  content: string;
  comments?: string;
  signature?: string;
  returnType?: string;
  parameters?: Array<{ name: string; type: string; optional?: boolean }>;
  className?: string;
  namespace?: string;
  tags: string[];
  deprecated?: boolean;
  version?: string;
}

const client = algoliasearch(APPLICATION_ID, API_KEY);

async function extractSDKDocuments(): Promise<SDKReferenceDocument[]> {
  const documents: SDKReferenceDocument[] = [];
  const sdkIndexerPath = path.join(process.cwd(), "scripts", "sdk-indexer");

  // Dynamically import symbol extractors for different languages
  const extractors: SymbolExtractor[] = [
    {
      language: "typescript",
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["**/*.test.ts", "**/*.spec.ts"],
      extract: () => {}, // Placeholder, actual implementation would be in the extractor
    },
    {
      language: "go",
      include: ["go/**/*.go"],
      exclude: ["**/*_test.go"],
      extract: () => {}, // Placeholder
    },
    {
      language: "python",
      include: ["python/**/*.py"],
      exclude: ["**/*_test.py", "**/*_spec.py"],
      extract: () => {}, // Placeholder
    },
  ];

  for (const extractor of extractors) {
    try {
      // In a real implementation, this would call the actual symbol extraction logic
      const symbols: Symbol[] = await extractSymbols(extractor);

      const languageDocuments = symbols.map((symbol) => {
        const baseDoc: SDKReferenceDocument = {
          objectID: `${extractor.language}-${symbol.name}-${symbol.file}-${symbol.line}`,
          name: symbol.name,
          type: symbol.type,
          language: extractor.language,
          file: symbol.file,
          line: symbol.line,
          content: symbol.content,
          comments: symbol.comments || undefined,
          tags: [], // Would be populated based on context or comments
        };

        // Add type-specific details
        switch (symbol.type) {
          case "function":
            const funcSymbol = symbol as any; // Cast to function symbol type
            baseDoc.signature = funcSymbol.meta?.parameters
              ?.map((p) => `${p.name}: ${p.type}${p.optional ? "?" : ""}`)
              .join(", ");
            baseDoc.returnType = funcSymbol.meta?.returnType;
            baseDoc.parameters = funcSymbol.meta?.parameters;
            break;
          case "class":
            const classSymbol = symbol as any; // Cast to class symbol type
            baseDoc.className = symbol.name;
            baseDoc.parameters = classSymbol.meta?.constructorArgs;
            break;
          case "method":
            const methodSymbol = symbol as any; // Cast to method symbol type
            baseDoc.className = methodSymbol.meta?.className;
            baseDoc.signature = methodSymbol.meta?.parameters
              ?.map((p) => `${p.name}: ${p.type}${p.optional ? "?" : ""}`)
              .join(", ");
            baseDoc.returnType = methodSymbol.meta?.returnType;
            break;
        }

        return baseDoc;
      });

      documents.push(...languageDocuments);
    } catch (error) {
      console.warn(`Could not extract symbols for ${extractor.language}:`, error);
    }
  }

  return documents;
}

// Placeholder for symbol extraction - would be replaced with actual implementation
async function extractSymbols(extractor: SymbolExtractor): Promise<Symbol[]> {
  // This would be implemented in the actual SDK indexer
  return [];
}

// Creates an index that will be used to search the SDK references.
async function createIndex() {
  try {
    await client.setSettings({
      indexName: INDEX_NAME,
      settings: {
        searchableAttributes: ["name", "comments", "signature", "content"],
        attributesForFaceting: ["type", "language", "className", "namespace", "tags", "deprecated"],
        customRanking: ["desc(usage_frequency)", "asc(name)"],
        distinct: true,
        attributeForDistinct: "name",
        highlightPreTag: "<mark>",
        highlightPostTag: "</mark>",
        snippetEllipsisText: "…",
      },
    });

    console.log(`✅ SDK reference index "${INDEX_NAME}" created successfully`);
    return true;
  } catch (error) {
    console.error("❌ Error creating SDK reference index:", error);
    throw error;
  }
}

// Updates the index with the latest documents.
async function updateIndex() {
  try {
    const documents = await extractSDKDocuments();

    if (documents.length === 0) {
      console.log("⚠️ No SDK documents found to index");
      return;
    }

    await client.clearObjects({ indexName: INDEX_NAME });
    const { objectIDs } = await client.saveObjects({
      indexName: INDEX_NAME,
      objects: documents,
    });

    console.log(`✅ Updated SDK reference index with ${objectIDs.length} documents`);
    return objectIDs;
  } catch (error) {
    console.error("❌ Error updating SDK reference index:", error);
    throw error;
  }
}

export { createIndex, updateIndex, extractSDKDocuments };
