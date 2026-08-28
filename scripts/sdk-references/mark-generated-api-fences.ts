import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { glob } from "glob";

const apiGroupHeadingPattern = /^## (?:Classes|Enumerations|Functions|Interfaces|Type Aliases|Variables)\s*$/u;
const headingPattern = /^(#{1,6})\s+(.+?)\s*#*\s*$/u;
const fencePattern = /^\s*(`{3,}|~{3,})(.*)$/u;
const typedocLanguagePattern = /^(?:ts|typescript|js|javascript)\s*$/u;
const generatedFenceMetadata = 'check=false reason="Generated API signature"';
const generatedFenceMetadataPattern = /\s+check=false reason="Generated API signature"\s*$/u;
const directSymbolGroups = new Set(["Enumerations", "Functions", "Type Aliases", "Variables"]);
const memberGroups = new Set(["Constructors", "Methods"]);
const signatureSections = new Set([
  "Call Signature",
  "Get Signature",
  "Implementation of",
  "Indexable",
  "Overrides",
  "Returns",
  "Set Signature",
  "Type Declaration",
]);

function headingText(markdown: string): string {
  return markdown.replace(/[`*_~]/gu, "").trim();
}

function signaturePathType(headings: string[]): "direct" | "section" | undefined {
  const group = headings[1];
  const symbol = headings[2];
  if (!group || !symbol) return undefined;

  const deepestHeadingIndex = headings.length - 1;
  if (deepestHeadingIndex === 2 && directSymbolGroups.has(group)) return "direct";
  if (deepestHeadingIndex === 3 && signatureSections.has(headings[3])) return "section";
  if (deepestHeadingIndex === 4 && memberGroups.has(headings[3])) return "direct";
  if (deepestHeadingIndex === 5 && memberGroups.has(headings[3]) && signatureSections.has(headings[5])) {
    return "section";
  }
  return undefined;
}

export function markGeneratedApiFences(source: string): string {
  if (!source.split(/\r?\n/u).some((line) => apiGroupHeadingPattern.test(line))) return source;

  const lines = source.split(/\r?\n/u);
  const headings: string[] = [];
  let hasTypeScriptFenceInCurrentHeading = false;
  let closingFence: string | undefined;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (closingFence) {
      const marker = line.match(fencePattern)?.[1];
      if (marker?.[0] === closingFence[0] && marker.length >= closingFence.length) closingFence = undefined;
      continue;
    }

    const heading = line.match(headingPattern);
    if (heading) {
      const depth = heading[1].length;
      headings.length = depth;
      headings[depth - 1] = headingText(heading[2]);
      hasTypeScriptFenceInCurrentHeading = false;
      continue;
    }

    const normalizedLine = line.replace(generatedFenceMetadataPattern, "");
    const fence = normalizedLine.match(fencePattern);
    if (!fence) continue;
    closingFence = fence[1];

    if (!typedocLanguagePattern.test(fence[2])) continue;
    const pathType = signaturePathType(headings);
    const shouldMark = pathType === "section" || (pathType === "direct" && !hasTypeScriptFenceInCurrentHeading);
    hasTypeScriptFenceInCurrentHeading = true;
    lines[index] = shouldMark ? `${normalizedLine} ${generatedFenceMetadata}` : normalizedLine;
  }

  return lines.join(source.includes("\r\n") ? "\r\n" : "\n");
}

export async function markGeneratedApiFencesInDirectory(docsRoot: string): Promise<number> {
  const filePaths = (await glob("**/*.{md,mdx}", { absolute: true, cwd: docsRoot })).sort();
  let filesChanged = 0;

  for (const filePath of filePaths) {
    const source = await readFile(filePath, "utf8");
    const marked = markGeneratedApiFences(source);
    if (marked === source) continue;
    await writeFile(filePath, marked);
    filesChanged += 1;
  }

  return filesChanged;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const filesChanged = await markGeneratedApiFencesInDirectory(process.argv[2] ?? "docs/references");
  console.log(`Marked generated API fences in ${filesChanged} files.`);
}
