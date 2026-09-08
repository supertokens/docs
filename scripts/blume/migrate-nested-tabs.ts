import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { glob } from "glob";

import { inferTabGroup, tabGroupLabel, tabGroupNames, tabValue, type TabGroup } from "../../components/tab-groups";

interface TagToken {
  end: number;
  name: ControlTagName;
  opening: boolean;
  source: string;
  start: number;
}

type ControlTagName = "ContentOption" | "DependentContent" | "Tab" | "Tabs";
type ControlRole = "container" | "option";

interface ControlNode {
  children: ControlNode[];
  close?: TagToken;
  open: TagToken;
  parent?: ControlNode;
  role: ControlRole;
}

interface Replacement {
  end: number;
  start: number;
  value: string;
}

interface ChoiceSet {
  generic?: boolean;
  group: string;
  label: string;
  titles: string[];
  values: Record<string, string>;
}

export interface MigrationResult {
  groupsChanged: number;
  remainingNestedTabs: number;
  source: string;
}

export interface MigrationSummary {
  filesChanged: number;
  groupsChanged: number;
  filesScanned: number;
  remainingNestedTabs: number;
  unbalancedStructures: number;
}

export interface TabStructureValidation {
  nestedTabs: number;
  unbalanced: string[];
}

const choiceSets: ChoiceSet[] = [
  choiceSet("install-method", "Installation method", { npm: "npm", "Script tag": "script-tag" }),
  choiceSet("python-io-style", "I/O style", { Asyncio: "asyncio", Syncio: "syncio" }),
  choiceSet("package-managers", "Package manager", { npm: "npm", Yarn: "yarn", pnpm: "pnpm", Bun: "bun" }),
  choiceSet("python-package-manager", "Package manager", { Pip: "pip", Uv: "uv" }),
  choiceSet("yes-no", "Choice", { Yes: "yes", No: "no" }, true),
  choiceSet("version", "Version", { V6: "v6", V5: "v5" }),
  choiceSet("docker", "Deployment method", { "With Docker": "with-docker", "Without Docker": "without-docker" }),
  choiceSet("javascript-http-client", "HTTP client", { Axios: "axios", Fetch: "fetch" }),
  choiceSet("java-http-client", "HTTP client", {
    HttpURLConnection: "http-url-connection",
    Okhttp: "okhttp",
    Retrofit: "retrofit",
  }),
  choiceSet("ios-http-client", "HTTP client", { URLSession: "url-session", Alamofire: "alamofire" }),
  choiceSet("flutter-http-client", "HTTP client", { http: "http", Dio: "dio" }),
  choiceSet("comparison", "Comparison", { Greater: "greater", Lesser: "lesser" }),
];

const knownLabels: Partial<Record<TabGroup, string>> = {
  "backend-language": "Backend language",
  "frontend-prebuilt-ui": "Frontend framework",
  "frontend-custom-ui": "Frontend type",
  "mobile-frameworks": "Mobile framework",
  "frontend-platforms": "Frontend platform",
  "node-frameworks": "Node.js framework",
  "go-frameworks": "Go framework",
  "python-frameworks": "Python framework",
  "package-managers": "Package manager",
  "package-manager-scripts": "Package manager",
};

function choiceSet(group: string, label: string, values: Record<string, string>, generic = false): ChoiceSet {
  return { generic, group, label, titles: Object.keys(values), values };
}

function ignoredCharacters(source: string): Uint8Array {
  const ignored = new Uint8Array(source.length);
  let fence: { character: string; length: number; start: number } | undefined;
  let lineStart = 0;

  while (lineStart < source.length) {
    const newline = source.indexOf("\n", lineStart);
    const lineEnd = newline === -1 ? source.length : newline + 1;
    const line = source.slice(lineStart, lineEnd);
    const marker = line.match(/^[\t ]*(`{3,}|~{3,})/u)?.[1];

    if (!fence && marker) fence = { character: marker[0], length: marker.length, start: lineStart };
    if (fence) ignored.fill(1, lineStart, lineEnd);
    if (
      fence &&
      lineStart !== fence.start &&
      new RegExp(`^[\\t ]*${fence.character}{${fence.length},}\\s*$`, "u").test(line.trimEnd())
    ) {
      fence = undefined;
    }
    lineStart = lineEnd;
  }

  for (let index = 0; index < source.length; index += 1) {
    if (ignored[index]) continue;
    let end = -1;
    if (source.startsWith("{/*", index)) {
      const close = source.indexOf("*/}", index + 3);
      end = close === -1 ? source.length : close + 3;
    } else if (source.startsWith("<!--", index)) {
      const close = source.indexOf("-->", index + 4);
      end = close === -1 ? source.length : close + 3;
    }
    if (end === -1) continue;
    ignored.fill(1, index, end);
    index = end - 1;
  }

  for (let index = 0; index < source.length; index += 1) {
    if (source[index] !== "`" || ignored[index]) continue;
    let delimiterLength = 1;
    while (source[index + delimiterLength] === "`") delimiterLength += 1;
    const delimiter = "`".repeat(delimiterLength);
    const close = source.indexOf(delimiter, index + delimiterLength);
    if (close === -1) continue;
    const end = close + delimiterLength;
    ignored.fill(1, index, end);
    index = end - 1;
  }

  return ignored;
}

function tokenize(source: string): TagToken[] {
  const ignored = ignoredCharacters(source);
  const tokens: TagToken[] = [];

  for (let start = 0; start < source.length; start += 1) {
    if (source[start] !== "<" || ignored[start]) continue;
    const match = source.slice(start).match(/^<(\/)?(DependentContent|ContentOption|Tabs|Tab)(?=\s|\/?>)/u);
    if (!match) continue;

    let quote: string | undefined;
    let closed = false;
    let end = start + match[0].length;
    for (; end < source.length; end += 1) {
      const character = source[end];
      if (quote) {
        if (character === quote && source[end - 1] !== "\\") quote = undefined;
      } else if (character === '"' || character === "'") {
        quote = character;
      } else if (character === ">") {
        end += 1;
        closed = true;
        break;
      }
    }
    if (!closed) continue;
    tokens.push({
      end,
      name: match[2] as TagToken["name"],
      opening: !match[1],
      source: source.slice(start, end),
      start,
    });
    start = end - 1;
  }

  return tokens;
}

function roleFor(name: ControlTagName): ControlRole {
  return name === "Tabs" || name === "DependentContent" ? "container" : "option";
}

function location(source: string, offset: number): string {
  const before = source.slice(0, offset);
  const line = before.split("\n").length;
  const lastNewline = before.lastIndexOf("\n");
  return `${line}:${offset - lastNewline}`;
}

function parse(source: string): { issues: string[]; nodes: ControlNode[] } {
  const stack: ControlNode[] = [];
  const nodes: ControlNode[] = [];
  const issues: string[] = [];

  for (const token of tokenize(source)) {
    if (token.opening) {
      if (/\/\s*>$/u.test(token.source)) {
        issues.push(`${location(source, token.start)}: self-closing <${token.name}> is not supported`);
        continue;
      }

      const parent = stack.at(-1);
      const node: ControlNode = { children: [], open: token, parent, role: roleFor(token.name) };
      parent?.children.push(node);
      nodes.push(node);
      stack.push(node);
      continue;
    }

    const expectedRole = roleFor(token.name);
    const current = stack.at(-1);
    if (!current) {
      issues.push(`${location(source, token.start)}: unexpected closing </${token.name}>`);
      continue;
    }
    if (current.role !== expectedRole) {
      issues.push(
        `${location(source, token.start)}: closing </${token.name}> cannot close <${current.open.name}> opened at ${location(source, current.open.start)}`,
      );
      continue;
    }
    stack.pop()!.close = token;
  }

  for (const node of stack) {
    issues.push(`${location(source, node.open.start)}: unclosed <${node.open.name}>`);
  }

  return { issues, nodes };
}

function attribute(tag: string, name: string): string | undefined {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const match = tag.match(new RegExp(`\\b${escapedName}\\s*=\\s*(["'])(.*?)\\1`, "u"));
  return match?.[2];
}

function addAttribute(tag: string, name: string, value: string): string {
  if (attribute(tag, name) !== undefined) return tag;
  const insertion = tag.endsWith("/>") ? tag.length - 2 : tag.length - 1;
  return `${tag.slice(0, insertion)} ${name}="${value}"${tag.slice(insertion)}`;
}

function renameOpeningTag(tag: string, from: string, to: string): string {
  return tag.replace(new RegExp(`^<${from}(?=\\s|\/?>)`, "u"), `<${to}`);
}

function hasOptionAncestor(node: ControlNode): boolean {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (parent.role === "option") return true;
  }
  return false;
}

function directOptions(node: ControlNode): ControlNode[] {
  return node.children.filter(({ role }) => role === "option");
}

function targetContainerName(node: ControlNode): "DependentContent" | "Tabs" {
  return node.open.name === "Tabs" && hasOptionAncestor(node)
    ? "DependentContent"
    : (node.open.name as "DependentContent" | "Tabs");
}

export function validateTabStructure(source: string): TabStructureValidation {
  const parsed = parse(source);
  return {
    nestedTabs: parsed.nodes.filter(
      (node) => node.role === "container" && node.open.name === "Tabs" && hasOptionAncestor(node),
    ).length,
    unbalanced: parsed.issues,
  };
}

function assertBalanced(source: string, filePath: string): ControlNode[] {
  const parsed = parse(source);
  if (parsed.issues.length > 0) {
    throw new Error(
      `Unbalanced tab structure in ${filePath}:\n${parsed.issues.map((issue) => `- ${issue}`).join("\n")}`,
    );
  }
  return parsed.nodes;
}

function sameTitles(left: string[], right: string[]): boolean {
  return left.length === right.length && left.toSorted().every((title, index) => title === right.toSorted()[index]);
}

function slug(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/gu, "-")
      .replace(/^-|-$/gu, "") || "option"
  );
}

function fileKey(filePath: string): string {
  let hash = 2166136261;
  for (const character of filePath.replaceAll(path.sep, "/")) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function migrateNestedTabs(source: string, filePath = "document.mdx"): MigrationResult {
  const replacements: Replacement[] = [];
  const occurrences = new Map<string, number>();
  const usedGroups = new Set<string>();
  let groupsChanged = 0;
  const nodes = assertBalanced(source, filePath);
  const targetNames = new Map<ControlNode, ControlTagName>();

  for (const node of nodes) {
    if (node.role === "container") targetNames.set(node, targetContainerName(node));
  }
  for (const node of nodes) {
    if (node.role !== "option") continue;
    const parentName = node.parent ? targetNames.get(node.parent) : undefined;
    targetNames.set(
      node,
      parentName === "DependentContent" ? "ContentOption" : parentName === "Tabs" ? "Tab" : node.open.name,
    );
  }
  for (const node of nodes) {
    if (node.role !== "container") continue;
    const group = attribute(node.open.source, "group");
    if (group) usedGroups.add(group);
  }

  for (const tabs of nodes.filter(({ role }) => role === "container")) {
    const options = directOptions(tabs);
    const titles = options.map(({ open }) => attribute(open.source, "title")).filter((title) => title !== undefined);
    const targetName = targetNames.get(tabs)!;
    const converting = tabs.open.name === "Tabs" && targetName === "DependentContent";
    const explicitGroup = attribute(tabs.open.source, "group");
    if (converting && explicitGroup === "frontend-custom-ui") {
      throw new Error(
        `Cannot migrate nested Web/Mobile tabs in ${filePath} at ${location(source, tabs.open.start)}: convert the outer choice to sections first`,
      );
    }
    if (converting && titles.length !== options.length) {
      throw new Error(
        `Cannot migrate nested <Tabs> in ${filePath} at ${location(source, tabs.open.start)}: every direct option needs a title`,
      );
    }

    const explicitKnownGroup = tabGroupNames.find((group) => group === explicitGroup);
    const knownGroup = explicitKnownGroup ?? (explicitGroup || titles.length === 0 ? undefined : inferTabGroup(titles));
    const mappedSet =
      explicitGroup || knownGroup ? undefined : choiceSets.find((set) => sameTitles(set.titles, titles));
    let group = explicitGroup;
    if (converting) {
      const explicitLabel = attribute(tabs.open.source, "label");
      if (!explicitLabel && !mappedSet && !knownGroup) {
        throw new Error(
          `Cannot migrate nested <Tabs> in ${filePath} at ${location(source, tabs.open.start)}: add an explicit label for this choice`,
        );
      }
      const baseGroup = explicitGroup ?? knownGroup ?? mappedSet?.group ?? `nested-tabs-${titles.map(slug).join("-")}`;
      const fileScoped = mappedSet?.generic || (!explicitGroup && !knownGroup && !mappedSet);
      group = baseGroup;
      if (fileScoped) {
        do {
          const occurrence = (occurrences.get(baseGroup) ?? 0) + 1;
          occurrences.set(baseGroup, occurrence);
          group = `${baseGroup}-${fileKey(filePath)}-${occurrence}`;
        } while (usedGroups.has(group));
      }
      usedGroups.add(group);
      const label =
        explicitLabel ??
        mappedSet?.label ??
        (knownGroup ? (knownLabels[knownGroup] ?? tabGroupLabel(knownGroup)) : undefined);

      let opening = renameOpeningTag(tabs.open.source, tabs.open.name, targetName);
      opening = addAttribute(opening, "group", group);
      opening = addAttribute(opening, "label", label!);
      replacements.push({ start: tabs.open.start, end: tabs.open.end, value: opening });
      groupsChanged += 1;
    } else if (tabs.open.name !== targetName) {
      replacements.push({
        start: tabs.open.start,
        end: tabs.open.end,
        value: renameOpeningTag(tabs.open.source, tabs.open.name, targetName),
      });
    }

    for (const tab of options) {
      const optionTarget = targetNames.get(tab)!;
      const title = attribute(tab.open.source, "title")!;
      let tabOpening = renameOpeningTag(tab.open.source, tab.open.name, optionTarget);
      if (optionTarget === "ContentOption" && title !== undefined) {
        const explicitValue = attribute(tab.open.source, "value");
        const value =
          explicitValue ??
          (knownGroup ? tabValue(knownGroup, title) : undefined) ??
          mappedSet?.values[title] ??
          slug(title);
        tabOpening = addAttribute(tabOpening, "value", value);
      }
      if (tabOpening !== tab.open.source) {
        replacements.push({ start: tab.open.start, end: tab.open.end, value: tabOpening });
      }
    }
  }

  for (const node of nodes) {
    const targetName = targetNames.get(node)!;
    const closing = `</${targetName}>`;
    if (node.close!.source !== closing) {
      replacements.push({ start: node.close!.start, end: node.close!.end, value: closing });
    }
  }

  let migrated = source;
  for (const replacement of replacements.toSorted((left, right) => right.start - left.start)) {
    migrated = migrated.slice(0, replacement.start) + replacement.value + migrated.slice(replacement.end);
  }
  const validation = validateTabStructure(migrated);
  if (validation.unbalanced.length > 0 || validation.nestedTabs > 0) {
    throw new Error(
      `Migration left invalid tab structure in ${filePath}: ${validation.nestedTabs} nested, ${validation.unbalanced.length} unbalanced`,
    );
  }
  return { groupsChanged, remainingNestedTabs: validation.nestedTabs, source: migrated };
}

export async function migrateNestedTabsInDirectory(docsRoot: string, check = false): Promise<MigrationSummary> {
  const root = path.resolve(docsRoot);
  const filePaths = await glob("**/*.{md,mdx}", { absolute: true, cwd: root });
  let filesChanged = 0;
  let groupsChanged = 0;
  let remainingNestedTabs = 0;
  const pendingWrites: Array<{ filePath: string; source: string }> = [];
  const structuralErrors: string[] = [];

  for (const filePath of filePaths.toSorted()) {
    const source = await readFile(filePath, "utf8");
    const relativePath = path.relative(root, filePath);
    let result: MigrationResult;
    try {
      result = migrateNestedTabs(source, relativePath);
    } catch (error) {
      structuralErrors.push(error instanceof Error ? error.message : String(error));
      continue;
    }
    remainingNestedTabs += result.remainingNestedTabs;
    if (result.source === source) continue;
    filesChanged += 1;
    groupsChanged += result.groupsChanged;
    pendingWrites.push({ filePath, source: result.source });
  }

  if (structuralErrors.length > 0) {
    throw new Error(
      `Found ${structuralErrors.length} files with unbalanced tab structures:\n${structuralErrors.join("\n")}`,
    );
  }
  if (!check) {
    for (const pending of pendingWrites) await writeFile(pending.filePath, pending.source);
  }

  return {
    filesChanged,
    filesScanned: filePaths.length,
    groupsChanged,
    remainingNestedTabs,
    unbalancedStructures: structuralErrors.length,
  };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const positional = args.filter((argument) => argument !== "--check");
  if (positional.length > 1) throw new Error("Usage: migrate-nested-tabs.ts [docs-root] [--check]");
  const docsRoot = positional[0] ?? "docs";
  const result = await migrateNestedTabsInDirectory(docsRoot, check);
  const action = check ? "Need migration" : "Migrated";
  console.log(
    `${action}: ${result.groupsChanged} nested tab groups in ${result.filesChanged} of ${result.filesScanned} files. Remaining: ${result.remainingNestedTabs} nested, ${result.unbalancedStructures} unbalanced.`,
  );
  if (check && result.filesChanged > 0) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await main();
