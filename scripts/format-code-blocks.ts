import { readFile, writeFile } from "node:fs/promises";

import { isExcludedFromChecking } from "./code-blocks/exclusions";
import { extractCodeBlocks, resolveMarkdownSourcePaths, type ExtractedCodeBlock } from "./code-blocks/extract";
import { formatCodeBlockWithPrettier } from "./code-blocks/prettier";

interface Replacement {
  start: number;
  end: number;
  value: string;
}

function getContentOffsets(source: string, block: ExtractedCodeBlock): { start: number; end: number; indent: string } {
  const fenceStart = block.position.start.offset;
  const fenceEnd = block.position.end.offset;
  const openingLineEnd = source.indexOf("\n", fenceStart);
  const closingLineBreak = source.lastIndexOf("\n", fenceEnd - 1);

  if (openingLineEnd === -1 || closingLineBreak < openingLineEnd) {
    throw new Error(`${block.sourcePath}:${block.sourceLine}: could not locate code fence content`);
  }

  const openingLineStart = source.lastIndexOf("\n", fenceStart - 1) + 1;
  const indent = source.slice(openingLineStart, fenceStart);
  return { start: openingLineEnd + 1, end: closingLineBreak + 1, indent };
}

export async function formatCodeBlocksInSource(source: string, sourcePath: string): Promise<string> {
  const blocks = await extractCodeBlocks(source, sourcePath);
  const newline = source.includes("\r\n") ? "\r\n" : "\n";
  const replacements: Replacement[] = [];

  for (const block of blocks) {
    if (isExcludedFromChecking(block) || block.value.trim().length === 0) continue;

    const formatted = await formatCodeBlockWithPrettier(block.value, block.language, sourcePath);
    if (formatted === undefined || formatted === block.value) continue;

    const offsets = getContentOffsets(source, block);
    const indented = formatted.replaceAll("\n", `${newline}${offsets.indent}`);
    replacements.push({ start: offsets.start, end: offsets.end, value: `${offsets.indent}${indented}${newline}` });
  }

  let result = source;
  for (const replacement of replacements.sort((left, right) => right.start - left.start)) {
    result = result.slice(0, replacement.start) + replacement.value + result.slice(replacement.end);
  }
  return result;
}

export async function formatCodeBlockFile(sourcePath: string): Promise<void> {
  const source = await readFile(sourcePath, "utf8");
  const formatted = await formatCodeBlocksInSource(source, sourcePath);
  if (formatted !== source) await writeFile(sourcePath, formatted);
}

export async function formatCodeBlockPaths(inputs?: readonly string[]): Promise<void> {
  for (const sourcePath of await resolveMarkdownSourcePaths(inputs ?? ["docs"])) {
    await formatCodeBlockFile(sourcePath);
  }
}

if (import.meta.main) {
  const inputs = process.argv.slice(2);
  await formatCodeBlockPaths(inputs.length === 0 ? undefined : inputs);
}
