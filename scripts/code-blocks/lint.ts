import { readFile } from "node:fs/promises";
import path from "node:path";

import { glob } from "glob";
import { getFenceMetadataViolations, isExcludedFromChecking, parseExclusionMarkers } from "./exclusions";
import { extractCodeBlocks, type ExtractedCodeBlock } from "./extract";
import { formatCodeBlockWithPrettier, getCodeBlockPrettierParser } from "./prettier";

export interface CodeBlockLintViolation {
  sourcePath: string;
  sourceLine: number;
  message: string;
}

function violation(block: ExtractedCodeBlock, message: string, sourceLine = block.sourceLine): CodeBlockLintViolation {
  return { sourcePath: block.sourcePath, sourceLine, message };
}

function unquotedBraceValues(meta: string): string[] {
  const values: string[] = [];
  let quote: '"' | "'" | undefined;
  let start = -1;

  for (let index = 0; index < meta.length; index += 1) {
    const character = meta[index];
    if (quote) {
      if (character === quote && meta[index - 1] !== "\\") quote = undefined;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
    } else if (character === "{") {
      start = index + 1;
    } else if (character === "}" && start !== -1) {
      values.push(meta.slice(start, index));
      start = -1;
    }
  }

  return values;
}

export function lintHighlightMetadata(block: ExtractedCodeBlock): CodeBlockLintViolation[] {
  if (!block.meta) return [];

  const lineCount = block.value.split("\n").length;
  const violations: CodeBlockLintViolation[] = [];

  for (const value of unquotedBraceValues(block.meta)) {
    if (!/\d/.test(value)) continue;

    const entries = value.split(",").map((entry) => entry.trim());
    let error: string | undefined;

    if (entries.some((entry) => !/^\d+(?:\s*-\s*\d+)?$/.test(entry))) {
      error = `invalid highlight metadata {${value}}`;
    } else {
      for (const entry of entries) {
        const [start, end = start] = entry.split(/\s*-\s*/).map(Number);
        if (start < 1 || end < 1) {
          error = `highlight lines must be positive in {${value}}`;
          break;
        }
        if (start > end) {
          error = `highlight range must be ordered in {${value}}`;
          break;
        }
        if (end > lineCount) {
          error = `highlight line ${end} exceeds the ${lineCount}-line code block`;
          break;
        }
      }
    }

    if (error) violations.push(violation(block, error));
  }

  return violations;
}

export function lintCheckMetadata(block: ExtractedCodeBlock): CodeBlockLintViolation[] {
  return getFenceMetadataViolations(block.meta).map((message) => violation(block, message));
}

export async function lintCodeBlock(block: ExtractedCodeBlock): Promise<CodeBlockLintViolation[]> {
  const violations = [...lintHighlightMetadata(block), ...lintCheckMetadata(block)];
  if (block.value.trim().length === 0) violations.push(violation(block, "code block must not be empty"));

  const markers = parseExclusionMarkers(block.value);
  for (const markerIndex of markers.misplacedLineIndexes) {
    violations.push(
      violation(
        block,
        "exclude-from-type-checking marker must be the first content line",
        block.sourceLine + markerIndex + 1,
      ),
    );
  }

  if (!getCodeBlockPrettierParser(block.language) || isExcludedFromChecking(block) || block.value.trim().length === 0) {
    return violations;
  }

  try {
    const formatted = await formatCodeBlockWithPrettier(block.value, block.language, block.sourcePath);
    if (formatted !== block.value) violations.push(violation(block, "code block is not formatted with Prettier"));
  } catch (error) {
    const message = error instanceof Error ? error.message.split("\n", 1)[0] : String(error);
    const codeLine = getPrettierErrorLine(error);
    violations.push(
      violation(
        block,
        `Prettier could not parse code block: ${message}`,
        codeLine === undefined ? block.sourceLine : block.sourceLine + codeLine,
      ),
    );
  }

  return violations;
}

function getPrettierErrorLine(error: unknown): number | undefined {
  if (error && typeof error === "object" && "loc" in error) {
    const loc = error.loc;
    if (loc && typeof loc === "object" && "start" in loc) {
      const start = loc.start;
      if (start && typeof start === "object" && "line" in start && typeof start.line === "number") {
        return start.line;
      }
    }
  }

  const message = error instanceof Error ? error.message : String(error);
  const match = message.match(/\((\d+):\d+\)/);
  return match ? Number(match[1]) : undefined;
}

export async function lintCodeBlocks(blocks: ExtractedCodeBlock[]): Promise<CodeBlockLintViolation[]> {
  return (await Promise.all(blocks.map(lintCodeBlock))).flat();
}

export async function lintCodeBlocksInDirectory(docsRoot: string): Promise<CodeBlockLintViolation[]> {
  const relativePaths = (await glob("**/*.{md,mdx}", { cwd: docsRoot, nodir: true })).sort();
  const results = await Promise.all(
    relativePaths.map(async (relativePath): Promise<CodeBlockLintViolation[]> => {
      const sourcePath = path.join(docsRoot, relativePath);
      try {
        const source = await readFile(sourcePath, "utf8");
        return lintCodeBlocks(await extractCodeBlocks(source, sourcePath));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const match = message.match(new RegExp(`^${escapeRegExp(sourcePath)}:(\\d+): (.*)$`, "s"));
        return [
          {
            sourcePath,
            sourceLine: match ? Number(match[1]) : 1,
            message: match?.[2] ?? message.split("\n", 1)[0],
          },
        ];
      }
    }),
  );
  return results.flat();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function run(): Promise<void> {
  const docsRoot = path.join(process.cwd(), "docs");
  const violations = await lintCodeBlocksInDirectory(docsRoot);

  for (const item of violations) {
    console.error(`${path.relative(process.cwd(), item.sourcePath)}:${item.sourceLine}: ${item.message}`);
  }

  if (violations.length > 0) {
    console.error(`Code block lint failed with ${violations.length} violation${violations.length === 1 ? "" : "s"}.`);
    process.exitCode = 1;
  } else {
    console.log("Code block lint passed.");
  }
}

if (import.meta.main) await run();
