import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { glob } from "glob";

interface NavigationEntry {
  filePath: string;
  group: string;
  order: number;
  title: string;
}

export interface SidebarOrderResult {
  directoriesChanged: number;
  filesChanged: number;
}

const markdownOrderPattern = /^([ \t]*order:[ \t]*)(\d+(?:\.\d+)?)[ \t]*$/m;
const metaOrderPattern = /^([ \t]*(?:"order"|order)[ \t]*:[ \t]*)(\d+(?:\.\d+)?)/m;

function parseEntry(filePath: string, source: string): NavigationEntry | undefined {
  const isMeta = path.basename(filePath) === "meta.ts";
  const match = source.match(isMeta ? metaOrderPattern : markdownOrderPattern);
  if (!match) return undefined;

  const metaTitle = source.match(/(?:"title"|title)\s*:\s*(?:"([^"]+)"|'([^']+)')/u);
  const title = isMeta ? (metaTitle?.[1] ?? metaTitle?.[2]) : source.match(/^title:\s*["']?(.+?)["']?\s*$/m)?.[1];
  const group = isMeta ? path.dirname(path.dirname(filePath)) : path.dirname(filePath);
  return {
    filePath,
    group,
    order: Number(match[2]),
    title: title ?? path.basename(isMeta ? path.dirname(filePath) : filePath, path.extname(filePath)),
  };
}

function replaceOrder(source: string, filePath: string, order: number): string {
  const pattern = path.basename(filePath) === "meta.ts" ? metaOrderPattern : markdownOrderPattern;
  return source.replace(pattern, `$1${order}`);
}

export async function normalizeSidebarOrders(docsRoot: string): Promise<SidebarOrderResult> {
  const root = path.resolve(docsRoot);
  const filePaths = await glob(["**/*.{md,mdx}", "**/meta.ts"], { absolute: true, cwd: root });
  const sources = new Map<string, string>();
  const entries: NavigationEntry[] = [];

  for (const filePath of filePaths) {
    const source = await readFile(filePath, "utf8");
    sources.set(filePath, source);
    const entry = parseEntry(filePath, source);
    if (entry) entries.push(entry);
  }

  const groups = new Map<string, NavigationEntry[]>();
  for (const entry of entries) {
    const groupEntries = groups.get(entry.group);
    if (groupEntries) groupEntries.push(entry);
    else groups.set(entry.group, [entry]);
  }
  let directoriesChanged = 0;
  let filesChanged = 0;

  for (const groupEntries of groups.values()) {
    const orders = groupEntries.map(({ order }) => order);
    if (!orders.some((order, index) => orders.indexOf(order) !== index)) continue;

    directoriesChanged += 1;
    const sorted = groupEntries.toSorted(
      (left, right) =>
        left.order - right.order ||
        left.title.localeCompare(right.title, "en") ||
        left.filePath.localeCompare(right.filePath, "en"),
    );
    for (const [index, entry] of sorted.entries()) {
      const nextOrder = (index + 1) * 10;
      if (entry.order === nextOrder) continue;
      const source = sources.get(entry.filePath)!;
      const nextSource = replaceOrder(source, entry.filePath, nextOrder);
      await writeFile(entry.filePath, nextSource);
      sources.set(entry.filePath, nextSource);
      filesChanged += 1;
    }
  }

  return { directoriesChanged, filesChanged };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const docsRoot = process.argv[2] ?? "docs";
  const result = await normalizeSidebarOrders(docsRoot);
  console.log(`Normalized sidebar orders in ${result.directoriesChanged} directories (${result.filesChanged} files).`);
}
