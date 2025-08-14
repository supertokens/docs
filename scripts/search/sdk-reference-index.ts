import fs from "fs-extra";
import { SetSettingsProps, SynonymHit } from "algoliasearch";
import path from "path";
import { mkdir, exists } from "node:fs/promises";
import { resolve, join } from "node:path";
import { algoliasearch } from "algoliasearch";
import { $, file, write } from "bun";

import { SearchIndex } from "./search-index";

import { TypeScriptSymbolExtractor } from "../search/typescript-symbol-extractor";
import { GoSymbolExtractor } from "../search/go-symbol-extractor";
import { PythonSymbolExtractor } from "../search/python-symbol-extractor";
import { SymbolExtractor, Symbol, FunctionSymbol, ClassSymbol } from "../search/types";
import { BaseSymbolExtractor } from "../search/symbol-extractor";

const TMP_DIR_PATH = "./tmp";

type Repository = {
  url: string;
  files: { path: string; namespace: string; extract?: string[] }[];
  name: string;
  language: "typescript" | "go" | "python";
};

const SymbolExtractorsMap = {
  typescript: TypeScriptSymbolExtractor,
  go: GoSymbolExtractor,
  python: PythonSymbolExtractor,
} as const;

export class SdkReferenceIndex extends SearchIndex {
  indexName = "supertokens_sdk_references";
  repositories: Repository[] = [
    {
      url: "https://github.com/supertokens/supertokens-node",
      files: [
        { path: "./lib/ts/index.ts", namespace: "SuperTokens" },
        { path: "./lib/ts/recipe/accountlinking/index.ts", namespace: "AccountLinking" },
        { path: "./lib/ts/recipe/dashboard/index.ts", namespace: "Dashboard" },
        { path: "./lib/ts/recipe/emailpassword/index.ts", namespace: "EmailPassword" },
        { path: "./lib/ts/recipe/emailverification/index.ts", namespace: "EmailVerification" },
        { path: "./lib/ts/recipe/jwt/index.ts", namespace: "JWT" },
        { path: "./lib/ts/recipe/multifactorauth/index.ts", namespace: "MultiFactorAuth" },
        { path: "./lib/ts/recipe/multitenancy/index.ts", namespace: "MultiTenancy" },
        { path: "./lib/ts/recipe/oauth2provider/index.ts", namespace: "OAuth2Provider" },
        { path: "./lib/ts/recipe/openid/index.ts", namespace: "OpenID" },
        { path: "./lib/ts/recipe/passwordless/index.ts", namespace: "Passwordless" },
        { path: "./lib/ts/recipe/session/index.ts", namespace: "Session" },
        { path: "./lib/ts/recipe/thirdparty/index.ts", namespace: "ThirdParty" },
        { path: "./lib/ts/recipe/totp/index.ts", namespace: "TOTP" },
        { path: "./lib/ts/recipe/usermetadata/index.ts", namespace: "UserMetadata" },
        { path: "./lib/ts/recipe/userroles/index.ts", namespace: "UserRoles" },
        { path: "./lib/ts/recipe/webauthn/index.ts", namespace: "WebAuthn" },
      ],
      name: "supertokens-node",
      language: "typescript",
    },
    {
      url: "https://github.com/supertokens/supertokens-auth-react",
      files: [
        { path: "./lib/ts/index.ts", namespace: "SuperTokens" },
        { path: "./lib/ts/recipe/emailpassword/index.ts", namespace: "EmailPassword" },
        { path: "./lib/ts/recipe/emailverification/index.ts", namespace: "EmailVerification" },
        { path: "./lib/ts/recipe/multifactorauth/index.ts", namespace: "MultiFactorAuth" },
        { path: "./lib/ts/recipe/multitenancy/index.ts", namespace: "MultiTenancy" },
        { path: "./lib/ts/recipe/oauth2provider/index.ts", namespace: "OAuth2Provider" },
        { path: "./lib/ts/recipe/passwordless/index.ts", namespace: "Passwordless" },
        { path: "./lib/ts/recipe/session/index.ts", namespace: "Session" },
        { path: "./lib/ts/recipe/thirdparty/index.ts", namespace: "ThirdParty" },
        { path: "./lib/ts/recipe/totp/index.ts", namespace: "TOTP" },
        { path: "./lib/ts/recipe/userroles/index.ts", namespace: "UserRoles" },
        { path: "./lib/ts/recipe/webauthn/index.ts", namespace: "WebAuthn" },
      ],
      name: "supertokens-node",
      language: "typescript",
    },
    {
      url: "https://github.com/supertokens/supertokens-web-js",
      files: [
        { path: "./lib/ts/index.ts", namespace: "SuperTokens" },
        { path: "./lib/ts/recipe/emailpassword/index.ts", namespace: "EmailPassword" },
        { path: "./lib/ts/recipe/emailverification/index.ts", namespace: "EmailVerification" },
        { path: "./lib/ts/recipe/multifactorauth/index.ts", namespace: "MultiFactorAuth" },
        { path: "./lib/ts/recipe/multitenancy/index.ts", namespace: "MultiTenancy" },
        { path: "./lib/ts/recipe/oauth2provider/index.ts", namespace: "OAuth2Provider" },
        { path: "./lib/ts/recipe/passwordless/index.ts", namespace: "Passwordless" },
        { path: "./lib/ts/recipe/session/index.ts", namespace: "Session" },
        { path: "./lib/ts/recipe/thirdparty/index.ts", namespace: "ThirdParty" },
        { path: "./lib/ts/recipe/totp/index.ts", namespace: "TOTP" },
        { path: "./lib/ts/recipe/userroles/index.ts", namespace: "UserRoles" },
        { path: "./lib/ts/recipe/webauthn/index.ts", namespace: "WebAuthn" },
      ],
      name: "supertokens-node",
      language: "typescript",
    },
  ];

  async updateDocuments(): Promise<void> {
    const documents: SDKReferenceDocument[] = [];

    console.log("Initializing SDK indexer");
    const tmpDirPath = "./tmp";
    const tmpDirExists = await exists(tmpDirPath);
    if (!tmpDirExists) {
      mkdir(tmpDirPath);
    }

    for (const repository of this.repositories) {
      console.log(`Extracting symbols from ${repository.name}`);
      await this.cloneRepository(repository);
      const symbols = this.extractSymbols(repository);
      console.log(`Transforming documents`);
      const repositoryDocuments = this.transformSymbolsToDocuments(symbols, repository);
      documents.push(...repositoryDocuments);
    }

    console.log(`Updating index`);
    await this.client.clearObjects({ indexName: this.indexName });
    const responses = await this.client.saveObjects({
      indexName: this.indexName,
      objects: documents,
    });
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

  private async cloneRepository(repository: Repository): Promise<void> {
    const repositoryDirectoryPath = `./tmp/${repository.name}`;
    const repositoryDirectoryExists = await exists(repositoryDirectoryPath);
    if (repositoryDirectoryExists) {
      return;
    }
    console.log(`Cloning ${repository.url}`);
    await $`git clone ${repository.url} ${repository.name} --depth 1`.cwd("./tmp");
  }

  private extractSymbols(repository: Repository): Symbol[] {
    const ExtractorClass = SymbolExtractorsMap[repository.language];
    if (!ExtractorClass) throw new Error(`No extractor found for language ${repository.language}`);
    const extractor = new ExtractorClass(
      repository.files.map((f) => ({
        namespace: f.namespace,
        path: resolve(`${TMP_DIR_PATH}/${repository.name}/${f.path}`),
      })),
    );
    return extractor.extract();
  }

  private transformSymbolsToDocuments(symbols: Symbol[], repository: Repository): SDKReferenceDocument[] {
    return repository.files
      .map((file) => {
        const absolutePath = resolve(`${TMP_DIR_PATH}/${repository.name}/${file.path}`);
        const symbolsInFile = symbols.filter((symbol) => symbol.file === absolutePath);
        const relativePath = file.path.replace(`${TMP_DIR_PATH}/${repository.name}/`, "");

        return symbolsInFile
          .map((symbol) => {
            const meta: Record<string, unknown> = symbol.meta || {};
            const docs: SDKReferenceDocument[] = [];

            switch (symbol.type) {
              case "function":
                const funcSymbol = symbol as FunctionSymbol;
                docs.push({
                  objectID: `${repository.language}-${symbol.name}-${relativePath}-${symbol.line}`,
                  name: symbol.name,
                  type: symbol.type,
                  language: repository.language,
                  repository: repository.name,
                  content: symbol.content,
                  file: relativePath,
                  line: symbol.line,
                  comments: symbol.comments || undefined,
                  namespace: symbol.namespace,
                  returnType: funcSymbol.meta?.returnType,
                  tags: [],
                  signature: funcSymbol.meta?.parameters
                    ?.map((p) => `${p.name}: ${p.optional ? "?" : ""}${p.type}`)
                    .join(", "),
                  parameters: funcSymbol.meta?.parameters,
                  deprecated: symbol.deprecated,
                });
                break;
              case "class":
                const classSymbol = symbol as ClassSymbol;
                docs.push(
                  ...classSymbol.meta.methods.map((method) => ({
                    objectID: `${repository.language}-${method.name}-${relativePath}-${method.line}`,
                    name: method.name,
                    type: "method" as SDKReferenceDocument["type"],
                    language: repository.language,
                    repository: repository.name,
                    content: method.content,
                    signature: method.parameters?.map((p) => `${p.name}: ${p.type}${p.optional ? "?" : ""}`).join(", "),
                    parameters: method.parameters,
                    file: relativePath,
                    line: method.line,
                    comments: method.comments || undefined,
                    returnType: method.returnType,
                    deprecated: method.deprecated,
                    namespace: classSymbol.namespace,
                    tags: [],
                  })),
                );
                break;
            }
            return docs;
          })
          .flat();
      })
      .flat();
  }
}

interface SDKReferenceDocument extends Record<string, unknown> {
  objectID: string;
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
  parameters?: Array<{ name: string; type: string; optional?: boolean }>;
  className?: string;
  namespace: string;
  tags: string[];
  deprecated: boolean;
  version?: string;
}

const IndexSettings: SetSettingsProps["indexSettings"] = {
  searchableAttributes: ["name", "namespace"],
  attributesForFaceting: ["type", "language", "className", "namespace", "tags", "deprecated"],
  customRanking: ["asc(name)"],
  ranking: ["typo", "geo", "words", "filters", "proximity", "attribute", "exact", "custom"],
  attributesToRetrieve: [
    "objectID",
    "name",
    "signature",
    "returnType",
    "namespace",
    "line",
    "file",
    "deprecated",
    "language",
    "type",
    "repository",
  ],
  attributesToHighlight: ["name", "namespace"],
  attributesToSnippet: ["signature:50"],
  disableTypoToleranceOnAttributes: ["name", "namespace"],
  highlightPreTag: "<mark>",
  highlightPostTag: "</mark>",
  snippetEllipsisText: "…",
  queryLanguages: ["en"],
  indexLanguages: ["en"],
  userData: {
    indexType: "sdk_reference",
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
  },
};

const IndexSynonyms: SynonymHit[] = [
  {
    objectID: "sdk-synonyms-1",
    type: "synonym",
    synonyms: ["multifactorauth", "mfa", "multi-factor authentication", "multifactor authentication"],
  },
  {
    objectID: "api-synonyms-2",
    type: "synonym",
    synonyms: ["multi-tenant", "multitenant"],
  },
];
