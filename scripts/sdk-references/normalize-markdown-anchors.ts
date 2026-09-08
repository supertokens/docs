import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import GithubSlugger from "github-slugger";
import { glob } from "glob";

interface AnchorOccurrence {
  id: string;
  line: number;
  owner: string;
}

interface ParsedDocument {
  anchors: Set<string>;
  collisions: Set<string>;
  occurrences: AnchorOccurrence[];
}

interface DocumentState {
  anchors: Set<string>;
  filePath: string;
  source: string;
}

export interface NormalizationResult {
  filesChanged: number;
  linksRepaired: number;
  memberAnchorsRenamed: number;
}

const anchorPattern = /<a\b(?=[^>]*\bid=(["'])([^"']+)\1)[^>]*>\s*<\/a>/giu;
const headingPattern = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const linkDestinationPattern = /(\]\()([^\s)]+)(?=[\s)])/g;

function headingText(markdown: string): string {
  return markdown
    .replace(/<[^>]+>/g, "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\\([\\`*_[\]{}()#+\-.!<>])/g, "$1")
    .trim();
}

function parseDocument(source: string): ParsedDocument {
  const headingSlugger = new GithubSlugger();
  const headings = new Set<string>();
  const occurrences: AnchorOccurrence[] = [];
  let fence: string | undefined;
  let owner = "document";

  source.split(/\r?\n/).forEach((line, lineIndex) => {
    const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
    if (!fence && marker) {
      fence = marker;
      return;
    }
    if (fence && marker?.[0] === fence[0] && marker.length >= fence.length) {
      fence = undefined;
      return;
    }
    if (fence) return;

    const heading = line.match(headingPattern);
    if (heading) {
      const headingSlug = headingSlugger.slug(headingText(heading[2]));
      headings.add(headingSlug);
      if (heading[1].length <= 3) owner = headingSlug;
    }

    for (const match of line.matchAll(anchorPattern)) {
      occurrences.push({ id: match[2], line: lineIndex, owner });
    }
  });

  const explicitAnchors = new Set(occurrences.map(({ id }) => id));
  const collisions = new Set([...explicitAnchors].filter((id) => headings.has(id)));
  return { anchors: new Set([...headings, ...explicitAnchors]), collisions, occurrences };
}

function uniqueMemberId(owner: string, id: string, usedIds: Set<string>): string {
  const base = `member-${owner}-${id}`;
  let candidate = base;
  let suffix = 2;
  while (usedIds.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  usedIds.add(candidate);
  return candidate;
}

export function namespaceCollidingMemberAnchors(source: string): { renamed: number; source: string } {
  const canonicalized = canonicalizeExistingMemberIds(source);
  const parsed = parseDocument(canonicalized.source);
  if (parsed.collisions.size === 0) return canonicalized;

  const replacements = new Map<number, Map<string, string>>();
  const usedIds = new Set(parsed.anchors);
  let renamed = 0;

  for (const occurrence of parsed.occurrences) {
    if (!parsed.collisions.has(occurrence.id)) continue;
    const replacement = uniqueMemberId(occurrence.owner, occurrence.id, usedIds);
    const lineReplacements = replacements.get(occurrence.line) ?? new Map<string, string>();
    lineReplacements.set(occurrence.id, replacement);
    replacements.set(occurrence.line, lineReplacements);
    renamed += 1;
  }

  const lines = canonicalized.source.split(/\r?\n/);
  for (const [lineIndex, lineReplacements] of replacements) {
    lines[lineIndex] = lines[lineIndex].replace(anchorPattern, (anchor, _quote: string, id: string) => {
      const replacement = lineReplacements.get(id);
      return replacement ? anchor.replace(`id="${id}"`, `id="${replacement}"`) : anchor;
    });
  }

  return { renamed: canonicalized.renamed + renamed, source: lines.join("\n") };
}

function canonicalizeExistingMemberIds(source: string): { renamed: number; source: string } {
  const headingSlugger = new GithubSlugger();
  const usedIds = new Set<string>();
  const lines = source.split(/\r?\n/);
  let fence: string | undefined;
  let owner = "document";
  let renamed = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const marker = lines[index].match(/^\s*(`{3,}|~{3,})/)?.[1];
    if (!fence && marker) {
      fence = marker;
      continue;
    }
    if (fence && marker?.[0] === fence[0] && marker.length >= fence.length) {
      fence = undefined;
      continue;
    }
    if (fence) continue;

    const heading = lines[index].match(headingPattern);
    if (heading) {
      const headingSlug = headingSlugger.slug(headingText(heading[2]));
      if (heading[1].length <= 3) owner = headingSlug;
    }

    lines[index] = lines[index].replace(
      /<a\s+id="(member-[^"]+)"\s*><\/a>(\s+`([^`]+)`)/gu,
      (anchor, currentId: string, suffix: string, propertyName: string) => {
        const propertySlug = new GithubSlugger().slug(propertyName.replace(/[?()]$/gu, ""));
        const canonicalId = uniqueMemberId(owner, propertySlug, usedIds);
        if (canonicalId === currentId) return anchor;
        renamed += 1;
        return anchor.replace(`id="${currentId}"`, `id="${canonicalId}"`);
      },
    );
  }

  return { renamed, source: lines.join("\n") };
}

export function anchorHeadingCollisions(source: string): string[] {
  return [...parseDocument(source).collisions].sort();
}

export function explicitAnchorIds(source: string): string[] {
  return parseDocument(source).occurrences.map(({ id }) => id);
}

function resolveTargetFile(currentFile: string, destinationPath: string, docsRoot: string, files: Set<string>) {
  let decodedPath: string;
  try {
    decodedPath = decodeURIComponent(destinationPath);
  } catch {
    return undefined;
  }

  if (/^[a-z][a-z\d+.-]*:/iu.test(decodedPath) || decodedPath.startsWith("//")) return undefined;

  const withoutQuery = decodedPath.split("?", 1)[0];
  let contentRoot = docsRoot;
  while (path.basename(contentRoot) !== "docs" && path.dirname(contentRoot) !== contentRoot) {
    contentRoot = path.dirname(contentRoot);
  }
  if (path.basename(contentRoot) !== "docs") contentRoot = docsRoot;

  const base = withoutQuery.startsWith("/")
    ? path.resolve(contentRoot, withoutQuery.replace(/^\/docs(?=\/|$)/u, "").replace(/^\//u, ""))
    : path.resolve(path.dirname(currentFile), withoutQuery);
  const candidates = [base, `${base}.mdx`, `${base}.md`, path.join(base, "index.mdx"), path.join(base, "index.md")];
  return candidates.find((candidate) => files.has(candidate));
}

function repairInvalidAnchorLinks(
  source: string,
  currentFile: string,
  docsRoot: string,
  anchorsByFile: Map<string, Set<string>>,
): { repaired: number; source: string } {
  let repaired = 0;
  const files = new Set(anchorsByFile.keys());
  const nextSource = source.replace(linkDestinationPattern, (match, prefix: string, destination: string) => {
    const hashIndex = destination.lastIndexOf("#");
    if (hashIndex === -1) return match;

    const destinationPath = destination.slice(0, hashIndex);
    const encodedFragment = destination.slice(hashIndex + 1);
    let fragment: string;
    try {
      fragment = decodeURIComponent(encodedFragment);
    } catch {
      return match;
    }

    const targetFile = destinationPath ? resolveTargetFile(currentFile, destinationPath, docsRoot, files) : currentFile;
    const targetAnchors = targetFile ? anchorsByFile.get(targetFile) : undefined;
    if (!targetAnchors || targetAnchors.has(fragment)) return match;

    let canonical = fragment;
    while (/-\d+$/u.test(canonical)) {
      canonical = canonical.replace(/-\d+$/u, "");
      if (targetAnchors.has(canonical)) {
        repaired += 1;
        return `${prefix}${destination.slice(0, hashIndex + 1)}${canonical}`;
      }
    }
    return match;
  });

  return { repaired, source: nextSource };
}

export async function normalizeMarkdownAnchors(docsRoot: string): Promise<NormalizationResult> {
  const root = path.resolve(docsRoot);
  const filePaths = (await glob("**/*.{md,mdx}", { absolute: true, cwd: root })).sort();
  const documents: DocumentState[] = [];
  let memberAnchorsRenamed = 0;

  for (const filePath of filePaths) {
    const source = await readFile(filePath, "utf8");
    const normalized = namespaceCollidingMemberAnchors(source);
    memberAnchorsRenamed += normalized.renamed;
    documents.push({ anchors: parseDocument(normalized.source).anchors, filePath, source: normalized.source });
  }

  const anchorsByFile = new Map(documents.map(({ anchors, filePath }) => [filePath, anchors]));
  let filesChanged = 0;
  let linksRepaired = 0;

  for (const document of documents) {
    const original = await readFile(document.filePath, "utf8");
    const repaired = repairInvalidAnchorLinks(document.source, document.filePath, root, anchorsByFile);
    linksRepaired += repaired.repaired;
    if (repaired.source === original) continue;
    await writeFile(document.filePath, repaired.source);
    filesChanged += 1;
  }

  return { filesChanged, linksRepaired, memberAnchorsRenamed };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const docsRoot = process.argv[2] ?? "docs/references";
  const result = await normalizeMarkdownAnchors(docsRoot);
  console.log(
    `Normalized ${result.memberAnchorsRenamed} member anchors and ${result.linksRepaired} links across ${result.filesChanged} files.`,
  );
}
