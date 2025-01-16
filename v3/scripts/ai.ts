import dotenv from "dotenv";
import fs from "fs";
import matter from "gray-matter";
import { readFile, writeFile } from "fs/promises";
import path, { join } from "path";
import OpenAI from "openai";

/**
 * A series of helper functions that makes use of the
 * OpenAI API to automate common tasks (migrating documentation, generating new data, etc)
 *
 * Use the existing code as a reference on how to implement additional helpers
 */

dotenv.config({ path: join(__dirname, ".env") });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const migrateMdx = async (markdownContent: string) => {
  let output = "";

  const completionChunks = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.1,
    messages: [
      {
        role: "user",
        content: `
  You are working on a documentatio project that uses Docusaurus.
  You are tasked with improve the documentation website for SEO.
`,
      },
      {
        role: "user",
        content: `
        You will receive a series of documents.
        Each document represents an MDX page from the documentation project
        Read the document and return and a string that will act as a SEO description for the document
        - Keep the description short. At most 15 words
        - Be concise
        - Do not use redundant phrasing like "This page does X". Just explain what it does
        - Only explain the main idea of the page
        - Use an active writing style. Explain what the user will be able to do by reading this page.
        - Do not use adjectives like seamless, easy, fast or any kind of marketing speak.
        You will return only the string. No other details besides that. 
        `,
      },
      {
        role: "user",
        content: markdownContent,
      },
    ],
    stream: true,
  });
  console.log(`Parsing gpt completion`);
  let chunkIndex = 0;
  for await (const chunk of completionChunks) {
    chunkIndex++;
    const stringChunk = chunk.choices[0]?.delta?.content || "";
    // printStatus(`Received chunk ${chunkIndex}`);
    output += stringChunk;
  }
  console.log(output);

  return output;
};

async function createRedirectMap(oldUrls: string, newUrls: string) {
  let output = "";

  const completionChunks = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.1,
    messages: [
      {
        role: "user",
        content: `
You will receive two list of urls. The first one represents old links from a previous version of a website. The second one represents the new urls.
Processe the two lists and then create a mapping list that will be used to redirect the old urls to the new ones.
The format of the new list should be:
Array<{ from: string, to: string }>
The result final result should include mappings for ALL the links mentioned in the old list. 
Make sure that all the links from the old list have a mapping.
`,
      },
      {
        role: "user",
        content: `
The old links:
${oldUrls}
        `,
      },
      {
        role: "user",
        content: `
The new links:
${newUrls}
        `,
      },
    ],
    stream: true,
  });
  console.log(`Parsing gpt completion`);
  let chunkIndex = 0;
  for await (const chunk of completionChunks) {
    chunkIndex++;
    const stringChunk = chunk.choices[0]?.delta?.content || "";
    printStatus(`Received chunk ${chunkIndex}`);
    output += stringChunk;
  }
  console.log(output);

  return output;
}

const printStatus = (status: string) => {
  process.stdout.write("\x1b[1A\x1b[2K"); // clear previous line
  console.log(status);
};

(async () => {})();

function readFilesRecursively(directoryPath: string): string[] {
  const files: string[] = [];

  function traverseDirectory(currentPath: string) {
    // Read directory contents
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relativePath = path.relative(directoryPath, fullPath);

      const shouldExclude =
        relativePath.includes("_blocks") ||
        relativePath.includes("_category_.json") ||
        relativePath.includes("_templates");
      if (shouldExclude) {
        continue;
      }

      if (entry.isDirectory()) {
        traverseDirectory(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  // Start traversing from the root directory
  traverseDirectory(directoryPath);

  return files;
}
