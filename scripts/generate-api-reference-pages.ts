import { dereference, load } from "@scalar/openapi-parser";
import { file, write, $ } from "bun";
import type { OpenAPIV3 } from "@scalar/openapi-types";
import { mkdir, exists, readdir } from "node:fs/promises";
import path from "path";

type APIPageMapping = Record<
  string,
  {
    path: string;
    method: string;
    frontmatter: Record<string, string | number>;
    filePath: string;
  }
>;

async function generateAPIReferencePages(apiType: "cdi" | "fdi") {
  await writeSchema(apiType);
  await writePageMapping(apiType);
  const schema = (await file(`./static/${apiType}.json`).json()) as OpenAPIV3.Document;
  const pageMapping = (await file(`./static/${apiType}-mapping.json`).json()) as APIPageMapping;

  for (const route in schema.paths) {
    for (const method in schema.paths[route]) {
      const operationId = schema.paths[route][method].operationId;
      const mapping = pageMapping[operationId];
      if (!mapping) {
        throw new Error(`No mapping found for ${operationId}`);
      }
      await writePage(operationId, apiType, mapping);
    }
  }

  await reorderCategories(apiType);
}

async function writeSchema(apiType: "cdi" | "fdi") {
  const schemaPath = `./static/${apiType}.yml`;
  const ymlContent = await file(schemaPath).text();
  const api = await dereference(ymlContent);

  await write(`./static/${apiType}.json`, JSON.stringify(api.schema, null, 2));
}

async function writePageMapping(apiType: "cdi" | "fdi") {
  const schemaPath = `./static/${apiType}.yml`;
  const ymlContent = await file(schemaPath).text();
  // These vales are specific to how we display the pages inside the docs
  // They cannot be determined based on the OpenAPI spec alone
  const filePathsMappingPath = `./static/${apiType}-file-paths.json`;
  const filePathsMapping = (await file(filePathsMappingPath).json()) as Record<string, string>;
  const { schema, errors } = await dereference(ymlContent);

  if (errors?.length) {
    throw new Error(`Failed to dereference ${schemaPath}: ${errors.join("\n")}`);
  }

  const typedSchema = schema as OpenAPIV3.Document;

  const mapping: APIPageMapping = {};

  for (const route in typedSchema.paths) {
    for (const method in typedSchema.paths[route]) {
      const operation = typedSchema.paths[route][method];
      mapping[operation.operationId] = {
        frontmatter: {
          sidebar_position: 1,
          sidebar_label: `${method} ${operation.summary || route}${operation.deprecated ? " (deprecated)" : ""}`,
          title: operation.summary || route,
          description: operation.description || `${apiType.toUpperCase()} API specification for the ${route} endpoint`,
        },
        path: route,
        method: method,
        filePath: filePathsMapping[operation.operationId],
      };
    }
  }

  const pageOrderingMap: Record<string, Array<{ method: string; path: string; operationId: string }>> = {};
  for (const operationId in mapping) {
    if (!mapping[operationId].filePath) {
      console.error(`File path not found for ${operationId}`);
      continue;
    }
    const folderName = path.dirname(mapping[operationId].filePath);
    if (!pageOrderingMap[folderName]) {
      pageOrderingMap[folderName] = [];
    }
    pageOrderingMap[folderName].push({
      method: mapping[operationId].method,
      path: mapping[operationId].path,
      operationId,
    });
  }

  const methodPriority = { get: 1, post: 2, put: 3, patch: 4, delete: 5 };
  for (const folderName in pageOrderingMap) {
    pageOrderingMap[folderName].sort((a, b) => {
      const priorityA = methodPriority[a.method as keyof typeof methodPriority];
      const priorityB = methodPriority[b.method as keyof typeof methodPriority];

      if (priorityA === priorityB) {
        return a.path.localeCompare(b.path, undefined, { sensitivity: "base" });
      }

      return priorityA - priorityB;
    });

    for (const [index, operation] of pageOrderingMap[folderName].entries()) {
      const operationId = operation.operationId;
      mapping[operationId].frontmatter.sidebar_position = index + 1;
    }
  }

  await write(`./static/${apiType}-mapping.json`, JSON.stringify(mapping, null, 2));
}

async function writePage(operationId: string, apiType: "cdi" | "fdi", mapping: APIPageMapping[string]) {
  const dirName = path.dirname(mapping.filePath);
  const fullDirPath = `./docs/references/${dirName}`;
  if (!(await exists(fullDirPath))) {
    await mkdir(fullDirPath, { recursive: true });
    await write(
      `${fullDirPath}/_category_.json`,
      `
{
  "label": "${dirName}",
  "position": 1
}
`,
    );
  }

  const description = (mapping.frontmatter.description as string) || "";

  const fileContent = `---
title: ${mapping.frontmatter.title}
sidebar_label: ${mapping.frontmatter.sidebar_label}
sidebar_position: ${mapping.frontmatter.sidebar_position}
description: >-
${description
  .trim()
  .split("\n")
  .map((line) => `   ${line.trim()}`)
  .join("\n")}
page_type: api-reference
hide_title: true
---

<APIRequestPage apiName="${apiType}" method="${mapping.method}" path="${mapping.path}" title="${mapping.path}" />
`;

  await write(`./docs/references/${mapping.filePath}`, fileContent);
}

async function reorderCategories(apiType: "cdi" | "fdi") {
  const filePaths = await readdir(`./docs/references/${apiType}`, { recursive: true, withFileTypes: true });
  const categoryFiles = filePaths.filter(
    (categoryFile) =>
      categoryFile.isFile() &&
      categoryFile.name.endsWith("_category_.json") &&
      categoryFile.parentPath !== `docs/references/${apiType}`,
  );

  const categories = await Promise.all(
    categoryFiles.map(async (categoryFile) => {
      const category = await file(`${categoryFile.parentPath}/${categoryFile.name}`).json();
      return {
        mapping: category,
        file: categoryFile,
      };
    }),
  );
  categories.sort((a, b) => a.mapping.label.localeCompare(b.mapping.label));

  await Promise.all(
    categories.map(async (category, index) => {
      category.mapping.position = index + 1;
      await write(`${category.file.parentPath}/${category.file.name}`, JSON.stringify(category.mapping, null, 2));
    }),
  );
}

(async () => {
  await Promise.all([generateAPIReferencePages("fdi"), generateAPIReferencePages("cdi")]);
})();
