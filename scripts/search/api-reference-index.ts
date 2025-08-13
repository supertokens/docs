/**
 * This file is used to create and update the Algolia API reference index.
 * Make sure to create an index that can work efficiently with API reference documents.
 */

import { SetSettingsProps, SynonymHit } from "algoliasearch";
import fs from "fs-extra";
import path from "path";
import { OpenAPIV3 } from "@scalar/openapi-types";

import { SearchIndex } from "./search-index";

export class ApiReferenceIndex extends SearchIndex {
  indexName = "supertokens_api_references";
  async updateDocuments(): Promise<void> {
    const documents = await this.extractAPIDocuments();
    if (documents.length === 0) {
      console.log("⚠️ No API documents found to index");
      return;
    }

    await this.client.clearObjects({ indexName: this.indexName });
    const responses = await this.client.saveObjects({
      indexName: this.indexName,
      objects: documents,
    });

    console.log(`✅ Updated API reference index with ${responses.length} documents`);
  }

  async updateConfiguration(): Promise<void> {
    await this.client.setSettings({
      indexName: this.indexName,
      indexSettings: IndexSettings,
      forwardToReplicas: true,
    });
    await this.client.saveSynonyms({
      indexName: this.indexName,
      synonymHit: IndexSynonyms,
      forwardToReplicas: true,
      replaceExistingSynonyms: true,
    });
  }

  private async extractAPIDocuments(): Promise<APIReferenceDocument[]> {
    const documents: APIReferenceDocument[] = [];
    const specPaths = ["static/fdi.json", "static/cdi.json"];

    for (const specPath of specPaths) {
      const fullPath = path.join(process.cwd(), specPath);

      if (await fs.pathExists(fullPath)) {
        const spec = (await fs.readJson(fullPath)) as OpenAPIV3.Document;
        const apiType = path.basename(specPath, ".json").toUpperCase();
        documents.push(...this.parseOpenAPISpec(spec, apiType));
      }
    }

    return documents;
  }

  private parseOpenAPISpec(spec: OpenAPIV3.Document, apiType: string): APIReferenceDocument[] {
    const documents: APIReferenceDocument[] = [];

    if (!spec.paths) {
      return documents;
    }

    for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
      if (!pathItem) continue;

      const methods = ["get", "post", "put", "delete", "patch", "head", "options"] as const;

      for (const method of methods) {
        const operation = pathItem[method];
        if (!operation) continue;

        const objectID = `${apiType}-${method}-${pathKey}`.replace(/[^a-zA-Z0-9-_]/g, "-");
        const pathDepth = pathKey.split("/").filter(Boolean).length;

        const document: APIReferenceDocument = {
          objectID,
          endpoint: {
            path: pathKey,
            method: method.toUpperCase(),
            summary: operation.summary || "",
            description: operation.description,
            operationId: operation.operationId,
            tags: operation.tags || [],
            deprecated: operation.deprecated || false,
            path_depth: pathDepth,
          },
          apiType,
          version: spec.info?.version,
        };

        if (operation.parameters) {
          document.parameters = operation.parameters.map((param: any) => ({
            name: param.name,
            type: param.schema?.type || "unknown",
            required: param.required || false,
            description: param.description,
          }));
        }

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
}

interface APIReferenceDocument extends Record<string, unknown> {
  objectID: string;
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
  version?: string;
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
  customRanking: ["asc(endpoint.deprecated)", "asc(endpoint.method)", "asc(endpoint.path_depth)"],
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
    "apiType",
  ],
  attributesToHighlight: ["endpoint.summary", "endpoint.description", "endpoint.path", "endpoint.method"],
  attributesToSnippet: ["endpoint.description:50"],
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
  userData: {
    indexType: "openapi_reference",
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
  },
};

const IndexSynonyms: SynonymHit[] = [
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
];
