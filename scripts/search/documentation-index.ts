/**
 * This file is used to create and update the Algolia documentation index.
 * Make sure to create an index that can work efficiently with markdown files similar to how the Algolia docSearch works.
 * Take into account that we are using `docusaurus`.
 */

import fs from "fs-extra";
import path from "path";
import matter from "gray-matter";
import { algoliasearch } from "algoliasearch";

const APPLICATION_ID = process.env.ALGOLIA_APP_ID || "SBR5UR2Z16";
const API_KEY = process.env.ALGOLIA_ADMIN_API_KEY || "";
const INDEX_NAME = "supertokens-documentation";

interface DocumentationDocument {
  objectID: string;
  url: string;
  title: string;
  content: string;
  hierarchy: {
    lvl0: string;
    lvl1?: string;
    lvl2?: string;
    lvl3?: string;
  };
  type: string;
  anchor?: string;
  category: string;
  tags: string[];
  lastModified: string;
}

const client = algoliasearch(APPLICATION_ID, API_KEY);

async function extractDocumentationDocuments(): Promise<DocumentationDocument[]> {
  const documents: DocumentationDocument[] = [];
  const docsPath = path.join(process.cwd(), "docs");

  async function processDirectory(dirPath: string, hierarchy: string[] = []) {
    const items = await fs.readdir(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = await fs.stat(itemPath);

      if (stats.isDirectory()) {
        // Skip special directories
        if (item.startsWith("_") || item === "node_modules") continue;

        const newHierarchy = [...hierarchy, item];
        await processDirectory(itemPath, newHierarchy);
      } else if (item.endsWith(".mdx") || item.endsWith(".md")) {
        try {
          const fileContent = await fs.readFile(itemPath, "utf8");
          const parsed = matter(fileContent);

          const relativePath = path.relative(docsPath, itemPath);
          const url = `/docs/${relativePath.replace(/\.(mdx?|markdown)$/, "")}`;

          const document: DocumentationDocument = {
            objectID: url,
            url,
            title: parsed.data.title || path.basename(item, path.extname(item)),
            content: parsed.content,
            hierarchy: {
              lvl0: hierarchy[0] || "Uncategorized",
              lvl1: hierarchy[1],
              lvl2: hierarchy[2],
              lvl3: hierarchy[3],
            },
            type: "page",
            category: hierarchy[0] || "Uncategorized",
            tags: parsed.data.tags || [],
            lastModified: (await fs.stat(itemPath)).mtime.toISOString(),
          };

          documents.push(document);

          // Optional: Extract headings as separate documents
          const headingRegex = /^(#{1,4})\s+(.+)$/gm;
          let match;
          while ((match = headingRegex.exec(parsed.content)) !== null) {
            const headingLevel = match[1].length;
            const headingText = match[2].trim();
            const headingAnchor = headingText.toLowerCase().replace(/\s+/g, "-");

            documents.push({
              ...document,
              objectID: `${document.objectID}#${headingAnchor}`,
              content: headingText,
              type: "heading",
              anchor: headingAnchor,
              hierarchy: {
                ...document.hierarchy,
                [`lvl${headingLevel}`]: headingText,
              },
            });
          }
        } catch (error) {
          console.warn(`Could not process file ${itemPath}:`, error);
        }
      }
    }
  }

  await processDirectory(docsPath);
  return documents;
}

// Creates an index that will be used to search the documentation pages.
async function createIndex() {
  try {
    await client.setSettings({
      indexName: INDEX_NAME,
      settings: {
        searchableAttributes: [
          "title",
          "content",
          "hierarchy.lvl0",
          "hierarchy.lvl1",
          "hierarchy.lvl2",
          "hierarchy.lvl3",
        ],
        attributesForFaceting: ["category", "type", "tags"],
        customRanking: ["desc(lastModified)", "asc(hierarchy.lvl0)"],
        distinct: true,
        attributeForDistinct: "url",
        highlightPreTag: "<mark>",
        highlightPostTag: "</mark>",
        snippetEllipsisText: "…",
      },
    });

    console.log(`✅ Documentation index "${INDEX_NAME}" created successfully`);
    return true;
  } catch (error) {
    console.error("❌ Error creating documentation index:", error);
    throw error;
  }
}

// Updates the index with the latest documents.
async function updateIndex() {
  try {
    const documents = await extractDocumentationDocuments();

    if (documents.length === 0) {
      console.log("⚠️ No documentation documents found to index");
      return;
    }

    await client.clearObjects({ indexName: INDEX_NAME });
    const { objectIDs } = await client.saveObjects({
      indexName: INDEX_NAME,
      objects: documents,
    });

    console.log(`✅ Updated documentation index with ${objectIDs.length} documents`);
    return objectIDs;
  } catch (error) {
    console.error("❌ Error updating documentation index:", error);
    throw error;
  }
}

export { createIndex, updateIndex, extractDocumentationDocuments };
