import { readFile, writeFile } from "fs/promises";
import { ensureDir, emptyDir } from "fs-extra";
import path, { join } from "path";
import { $, Glob, file, write } from "bun";
import { execSync } from "child_process";
import { visit } from "unist-util-visit";
import { compile } from "@mdx-js/mdx";

const LanguageExtensionsMap = {
  ts: "typescript",
  tsx: "typescript",
  go: "go",
  py: "python",
  python: "python",
};

const DOCKER_CONTAINER_NAME = "code-formatter-container";
const DOCKER_IMAGE_NAME = "code-formatter-image";

type CodeBlock = {
  filePath: string;
  language: "typescript" | "go" | "python";
  value: string;
  position: {
    start: { line: number; column: number; offset: number };
    end: { line: number; column: number; offset: number };
  };
};

// TODO:
// - Add option to only run on changed files
// - Improve formatting perf
(async () => {
  const startPath = path.join(process.cwd(), "docs");
  const glob = new Glob("**/*.mdx");

  try {
    // await startContainer();
    for await (const filePath of glob.scan(startPath)) {
      console.log(`Processing ${filePath}`);
      const fullFilePath = path.join(startPath, filePath);
      const codeBlocks = await getCodeBlocks(fullFilePath);
      console.log(`Found ${codeBlocks.length} code blocks`);
      if (!codeBlocks.length) continue;
      console.log(`Formatting code blocks`);
      await formatCodeBlock(codeBlocks);
      console.log(`Writing file`);
      await writeCodeBlocks(fullFilePath, codeBlocks);
    }
    // await stopContainer();
  } catch (error) {
    console.error(error);
  }
})();

// This is not the fastest way to do this
// Ended up writing to a file because of some issues with piping the snippets to the container
async function formatCodeBlock(codeBlocks: CodeBlock[]) {
  const snippetLocalPath = "./tmp/code-snippet";
  const snippetContainerPath = "/tmp/code-snippet";
  for (const codeBlock of codeBlocks) {
    const parsedCodeBlockValue = codeBlock.language === "go" ? `package main\n\n${codeBlock.value}` : codeBlock.value;
    await write(snippetLocalPath, parsedCodeBlockValue);
    execSync(`docker cp ${snippetLocalPath} ${DOCKER_CONTAINER_NAME}:${snippetContainerPath}`);
    if (codeBlock.language === "go") {
      execSync(`docker exec ${DOCKER_CONTAINER_NAME} gofmt ${snippetContainerPath}`);
    } else if (codeBlock.language === "python") {
      execSync(`docker exec ${DOCKER_CONTAINER_NAME} black ${snippetContainerPath} > /dev/null`);
    } else if (codeBlock.language === "typescript") {
      execSync(`docker exec ${DOCKER_CONTAINER_NAME} prettier --parser typescript --write ${snippetContainerPath}`);
    }

    execSync(`docker cp ${DOCKER_CONTAINER_NAME}:${snippetContainerPath} ${snippetLocalPath}`);
    let formattedCodeBlock = await file(snippetLocalPath).text();
    formattedCodeBlock =
      codeBlock.language === "go" ? formattedCodeBlock.replace("package main\n\n", "") : formattedCodeBlock;
    codeBlock.value = formattedCodeBlock;
  }
}

async function writeCodeBlocks(filePath: string, codeBlocks: CodeBlock[]) {
  const fileContent = await file(filePath).text();
  const fileLines = fileContent.split("\n");
  const newFileLines: string[] = [];

  const codeBlocksByStartLineNumber: Record<number, CodeBlock> = {};
  for (const codeBlock of codeBlocks) {
    if (codeBlocksByStartLineNumber[codeBlock.position.start.line]) {
      throw new Error(`Duplicate code block found for ${codeBlock.filePath} at line ${codeBlock.position.start.line}`);
    }
    codeBlocksByStartLineNumber[codeBlock.position.start.line] = codeBlock;
  }

  let fileLineIndex = 0;
  while (fileLineIndex < fileLines.length) {
    const codeBlock = codeBlocksByStartLineNumber[fileLineIndex + 1];
    if (!codeBlock) {
      newFileLines.push(fileLines[fileLineIndex]);
      fileLineIndex++;
      continue;
    }
    const formattedCodeBlockLines = codeBlock.value.split("\n");
    // The start backticks
    newFileLines.push(fileLines[fileLineIndex]);
    newFileLines.push(...formattedCodeBlockLines);
    fileLineIndex += codeBlock.position.end.line - codeBlock.position.start.line;
    // The end backticks
    newFileLines.push(fileLines[fileLineIndex]);
    fileLineIndex++;
  }
  await write(filePath, newFileLines.join("\n"));
}

async function startContainer() {
  console.log("Starting Docker container...");
  await $`docker run -d --name ${DOCKER_CONTAINER_NAME} ${DOCKER_IMAGE_NAME}`;
}

async function stopContainer() {
  console.log("Stopping and removing Docker container...");
  await $`docker stop ${DOCKER_CONTAINER_NAME}`;
  await $`docker rm ${DOCKER_CONTAINER_NAME}`;
}

async function getCodeBlocks(filePath: string): Promise<CodeBlock[]> {
  const content = await file(filePath).text();
  const parsedContent = cleanMarkdownHeaders(content);
  const codeBlocks: CodeBlock[] = [];
  await compile(parsedContent, {
    remarkPlugins: [
      () => (tree) => {
        visit(tree, "code", (node: any) => {
          const language = LanguageExtensionsMap[node.lang];
          if (!language) return;
          codeBlocks.push({
            filePath,
            language,
            value: node.value,
            position: node.position,
          });
        });
      },
    ],
    rehypePlugins: [],
  });
  return codeBlocks;
}

function cleanMarkdownHeaders(markdown: string): string {
  return markdown
    .split("\n")
    .map((line) => {
      if (line.startsWith("#")) {
        line = line.replace(/\{.*?\}/g, "");
      }
      return line;
    })
    .join("\n");
}
