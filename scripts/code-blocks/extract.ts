import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";

import { compile } from "@mdx-js/mdx";
import { glob } from "glob";
import { visit } from "unist-util-visit";

import { getLanguageDefinition, type LanguageDefinition } from "./languages";

interface CodeNode {
  lang?: unknown;
  meta?: unknown;
  value: string;
  position?: {
    start: SourcePoint;
    end: SourcePoint;
  };
}

export interface SourcePoint {
  line: number;
  column: number;
  offset?: number;
}

export interface ExtractedCodeBlock {
  language: string;
  definition: LanguageDefinition;
  meta: string | undefined;
  sourcePath: string;
  sourceLine: number;
  position: {
    start: SourcePoint & { offset: number };
    end: SourcePoint & { offset: number };
  };
  value: string;
}

export interface ResolveMarkdownSourcePathsOptions {
  cwd?: string;
}

export async function resolveMarkdownSourcePaths(
  inputs: readonly string[],
  options: ResolveMarkdownSourcePathsOptions = {},
): Promise<string[]> {
  const cwd = options.cwd ?? process.cwd();
  const sourcePaths = new Set<string>();

  for (const input of inputs) {
    if (input.trim().length === 0) throw new Error("source path must not be empty");
    const inputPath = path.resolve(cwd, input);
    let inputStat;
    try {
      inputStat = await stat(inputPath);
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") {
        throw new Error(`${input}: path does not exist`);
      }
      throw error;
    }

    if (inputStat.isDirectory()) {
      const canonicalInputPath = await realpath(inputPath);
      const relativePaths = await glob("**/*.{md,mdx}", { cwd: canonicalInputPath, nodir: true });
      for (const relativePath of relativePaths) {
        sourcePaths.add(await realpath(path.resolve(canonicalInputPath, relativePath)));
      }
      continue;
    }

    if (inputStat.isFile() && [".md", ".mdx"].includes(path.extname(inputPath).toLowerCase())) {
      sourcePaths.add(await realpath(inputPath));
      continue;
    }

    throw new Error(`${input}: expected a Markdown file or directory`);
  }

  return [...sourcePaths].sort();
}

export async function extractCodeBlocks(source: string, sourcePath: string): Promise<ExtractedCodeBlock[]> {
  const codeBlocks: ExtractedCodeBlock[] = [];
  const extension = path.extname(sourcePath).toLowerCase();

  if (extension !== ".md" && extension !== ".mdx") {
    throw new Error(`${sourcePath}: expected a .md or .mdx file`);
  }

  await compile(source, {
    format: extension === ".md" ? "md" : "mdx",
    remarkPlugins: [
      () => (tree) => {
        visit(tree, "code", (node: CodeNode) => {
          const position = node.position;
          if (position?.start.offset === undefined || position.end.offset === undefined) {
            throw new Error(`${sourcePath}: code fence has no source position`);
          }
          const sourceLine = position.start.line;

          const definition = getLanguageDefinition(node.lang, sourcePath, sourceLine);

          codeBlocks.push({
            language: node.lang as string,
            definition,
            meta: typeof node.meta === "string" ? node.meta : undefined,
            sourcePath,
            sourceLine,
            position: {
              start: { ...position.start, offset: position.start.offset },
              end: { ...position.end, offset: position.end.offset },
            },
            value: node.value,
          });
        });
      },
    ],
    rehypePlugins: [],
  });

  return codeBlocks;
}

export async function scanCodeBlocks(docsRoot: string): Promise<ExtractedCodeBlock[]> {
  return extractCodeBlocksFromPaths(await resolveMarkdownSourcePaths([docsRoot]));
}

export async function extractCodeBlocksFromPaths(sourcePaths: readonly string[]): Promise<ExtractedCodeBlock[]> {
  const codeBlocks: ExtractedCodeBlock[] = [];

  for (const sourcePath of sourcePaths) {
    const source = await readFile(sourcePath, "utf8");
    codeBlocks.push(...(await extractCodeBlocks(source, sourcePath)));
  }

  return codeBlocks;
}
