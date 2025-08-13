/**
 * This file is used to create and update the Algolia API reference index.
 * Make sure to create an index that can work efficiently with API reference documents.
 */

import { algoliasearch, SetSettingsProps } from "algoliasearch";
import fs from "fs-extra";
import path from "path";
import { OpenAPIV3 } from "@scalar/openapi-types";

const APPLICATION_ID = process.env.ALGOLIA_APP_ID;
const API_KEY = process.env.ALGOLIA_ADMIN_API_KEY;
const INDEX_NAME = "supertokens-api-reference";

interface APIReferenceDocument {
  objectID: string;
  path: string;
  method: string;
  summary: string;
  name: string;
  apiName: string;
  description?: string;
  tags: string[];
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description?: string;
  }>;
  responses?: Array<{
    status: string;
    description: string;
  }>;
  deprecated?: boolean;
  version?: string;
}

const client = algoliasearch(APPLICATION_ID, API_KEY);

// Creates an index that will be used to search OpenAPI compatible API references.
async function createIndex() {
  await client.setSettings({
    indexName: INDEX_NAME,
    indexSettings: IndexSettings,
  });
  console.log(`✅ API reference index "${INDEX_NAME}" created successfully`);
}

// Updates the index with the latest documents.
async function updateIndex() {
  try {
    const documents = await extractAPIDocuments();

    if (documents.length === 0) {
      console.log("⚠️ No API documents found to index");
      return;
    }

    // Clear existing documents and add new ones
    await client.clearObjects({ indexName: INDEX_NAME });
    const { objectIDs } = await client.saveObjects({
      indexName: INDEX_NAME,
      objects: documents,
    });

    console.log(`✅ Updated API reference index with ${objectIDs.length} documents`);
    return objectIDs;
  } catch (error) {
    console.error("❌ Error updating API reference index:", error);
    throw error;
  }
}

const IndexSettings: SetSettingsProps["indexSettings"] = {
  searchableAttributes: [
    "unordered(endpoint.summary)",
    "unordered(endpoint.description)",
    "unordered(endpoint.path)",
    "unordered(endpoint.method)",
    "unordered(endpoint.tags)",
    // "unordered(parameters.name)",
    // "unordered(parameters.description)",
    // "unordered(responses.description)",
    // "unordered(requestBody.description)",
    // "unordered(schemas.title)",
    // "unordered(schemas.description)",
    // "unordered(schemas.properties.name)",
    // "unordered(schemas.properties.description)",
  ],
  attributesForFaceting: [
    "filterOnly(endpoint.deprecated)",
    "searchable(endpoint.tags)",
    "searchable(endpoint.method)",
    // "filterOnly(endpoint.security)",
    // "filterOnly(parameters.required)",
    // "filterOnly(parameters.in)",
    // "filterOnly(responses.statusCode)",
    "searchable(apiType)",
    // "filterOnly(apiVersion)",
    // "filterOnly(servers.url)",
  ],
  customRanking: [
    // "desc(endpoint.popularity)",
    "asc(endpoint.deprecated)",
    "asc(endpoint.method)",
    "asc(endpoint.path_depth)",
  ],
  ranking: ["typo", "geo", "words", "filters", "proximity", "attribute", "exact", "custom"],
  attributesToRetrieve: [
    "objectID",
    "endpoint.path",
    "endpoint.method",
    "endpoint.summary",
    "endpoint.description",
    "endpoint.operationId",
    "endpoint.tags",
    "endpoint.deprecated",
    // "parameters",
    // "requestBody",
    // "responses",
    // "schemas",
    // "apiVersion",
    // "servers",
    "apiType",
  ],
  attributesToHighlight: [
    "endpoint.summary",
    "endpoint.description",
    "endpoint.path",
    "endpoint.method",
    // "parameters.name",
    // "parameters.description",
    // "responses.description",
    // "schemas.description",
  ],
  attributesToSnippet: [
    "endpoint.description:50",
    // "requestBody.description:30",
    // "responses.description:30",
    // "schemas.description:40",
  ],
  highlightPreTag: "<mark>",
  highlightPostTag: "</mark>",
  snippetEllipsisText: "...",
  distinct: true,
  attributeForDistinct: "endpoint.operationId",
  relevancyStrictness: 90,
  disableTypoToleranceOnAttributes: ["endpoint.method", "endpoint.path"],
  disableTypoToleranceOnWords: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  minWordSizefor1Typo: 4,
  minWordSizefor2Typos: 8,
  typoTolerance: true,
  removeWordsIfNoResults: "lastWords",
  advancedSyntax: true,
  allowTyposOnNumericTokens: false,
  ignorePlurals: true,
  removeStopWords: true,
  queryLanguages: ["en"],
  indexLanguages: ["en"],
  camelCaseAttributes: ["endpoint.operationId", "parameters.name", "schemas.properties.name"],
  decompoundedAttributes: {
    en: ["endpoint.summary", "endpoint.description"],
  },
  synonyms: [
    {
      objectID: "api-synonyms-1",
      type: "synonym",
      synonyms: ["create", "post", "add", "new"],
    },
    {
      objectID: "api-synonyms-2",
      type: "synonym",
      synonyms: ["update", "put", "patch", "modify", "edit"],
    },
    {
      objectID: "api-synonyms-3",
      type: "synonym",
      synonyms: ["delete", "remove", "destroy"],
    },
    {
      objectID: "api-synonyms-4",
      type: "synonym",
      synonyms: ["get", "fetch", "retrieve", "read", "list"],
    },
    {
      objectID: "api-synonyms-5",
      type: "synonym",
      synonyms: ["auth", "authentication", "authorization", "oauth", "jwt", "token"],
    },
    {
      objectID: "api-synonyms-6",
      type: "synonym",
      synonyms: ["param", "parameter", "argument", "input"],
    },
    {
      objectID: "api-synonyms-7",
      type: "synonym",
      synonyms: ["response", "output", "result", "return"],
    },
    {
      objectID: "api-synonyms-8",
      type: "synonym",
      synonyms: ["schema", "model", "type", "structure"],
    },
    {
      objectID: "api-synonyms-9",
      type: "oneWaySynonym",
      input: "404",
      synonyms: ["not found", "missing", "does not exist"],
    },
    {
      objectID: "api-synonyms-10",
      type: "oneWaySynonym",
      input: "401",
      synonyms: ["unauthorized", "not authenticated"],
    },
    {
      objectID: "api-synonyms-11",
      type: "oneWaySynonym",
      input: "403",
      synonyms: ["forbidden", "not authorized", "access denied"],
    },
    {
      objectID: "api-synonyms-12",
      type: "oneWaySynonym",
      input: "200",
      synonyms: ["success", "ok", "successful"],
    },
  ],
  userData: {
    indexType: "openapi_reference",
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
  },
};

// Updates the index with the latest documents.
async function updateIndex() {
  try {
    const index = client.initIndex(INDEX_NAME);
    const documents = await extractAPIDocuments();

    if (documents.length === 0) {
      console.log("⚠️ No API documents found to index");
      return;
    }

    // Clear existing documents and add new ones
    await index.clearObjects();
    const { objectIDs } = await index.saveObjects(documents);

    console.log(`✅ Updated API reference index with ${objectIDs.length} documents`);
    return objectIDs;
  } catch (error) {
    console.error("❌ Error updating API reference index:", error);
    throw error;
  }
}

async function extractAPIDocuments(): Promise<APIReferenceDocument[]> {
  const documents: APIReferenceDocument[] = [];

  const specPaths = ["static/cdi.json", "static/fdi.json", "docs/references/cdi", "docs/references/fdi"];

  for (const specPath of specPaths) {
    const fullPath = path.join(process.cwd(), specPath);

    try {
      if (await fs.pathExists(fullPath)) {
        if (specPath.endsWith(".json")) {
          const spec = await fs.readJson(fullPath);
          const apiName = path.basename(specPath, ".json");
          documents.push(...parseOpenAPISpec(spec, apiName));
        } else {
          // Directory with spec files
          const files = await fs.readdir(fullPath);
          for (const file of files) {
            if (file.endsWith(".json") || file.endsWith(".yaml") || file.endsWith(".yml")) {
              const filePath = path.join(fullPath, file);
              const spec = await fs.readJson(filePath);
              const apiName = path.basename(file, path.extname(file));
              documents.push(...parseOpenAPISpec(spec, apiName));
            }
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️ Could not process API spec at ${specPath}:`, error);
    }
  }

  return documents;
}

function parseOpenAPISpec(spec: OpenAPIV3.Document, apiName: string): APIReferenceDocument[] {
  const documents: APIReferenceDocument[] = [];

  if (!spec.paths) {
    return documents;
  }

  for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
    if (!pathItem) continue;

    const methods = ["get", "post", "put", "delete", "patch", "head", "options"] as const;

    for (const method of methods) {
      const operation = pathItem[method] as OpenAPIV3.OperationObject;
      if (!operation) continue;

      const objectID = `${apiName}-${method}-${pathKey}`.replace(/[^a-zA-Z0-9-_]/g, "-");

      const document: APIReferenceDocument = {
        objectID,
        path: pathKey,
        method: method.toUpperCase(),
        summary: operation.summary || "",
        name: operation.operationId || `${method} ${pathKey}`,
        apiName,
        description: operation.description,
        tags: operation.tags || [],
        deprecated: operation.deprecated || false,
        version: spec.info?.version,
      };

      // Extract parameters
      if (operation.parameters) {
        document.parameters = operation.parameters.map((param: any) => ({
          name: param.name,
          type: param.schema?.type || "unknown",
          required: param.required || false,
          description: param.description,
        }));
      }

      // Extract responses
      if (operation.responses) {
        document.responses = Object.entries(operation.responses).map(([status, response]: [string, any]) => ({
          status,
          description: response.description || "",
        }));
      }

      documents.push(document);
    }
  }

  return documents;
}

export { createIndex, updateIndex, extractAPIDocuments };
