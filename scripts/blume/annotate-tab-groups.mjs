import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { inferTabGroup, tabValue } from "../../components/tab-groups.ts";

const root = path.resolve(import.meta.dirname, "../..");
const docsRoot = path.join(root, "docs");

const titleFromTag = (tag) => tag.match(/\btitle=["']([^"']+)["']/)?.[1];

const addAttribute = (tag, name, value) => {
  if (new RegExp(`\\b${name}=`).test(tag)) return tag;
  return tag.replace(/>$/, ` ${name}="${value}">`);
};

const addValueAttribute = (tag, value) => {
  if (/\bvalue=/.test(tag)) return tag;
  if (/\bid=/.test(tag)) return tag.replace(/\bid=/, "value=");
  return addAttribute(tag, "value", value);
};

const isLineComment = (source, index) => {
  const lineStart = source.lastIndexOf("\n", index - 1) + 1;
  return /^\s*\/\//.test(source.slice(lineStart, index));
};

export function annotateTabGroups(source) {
  const tokenPattern = /<Tabs\b[^>]*>|<\/Tabs>|<Tab\b[^>]*>|<\/Tab>/g;
  const stack = [];
  const replacements = [];
  let match;

  while ((match = tokenPattern.exec(source))) {
    const tag = match[0];
    if (isLineComment(source, match.index)) continue;

    if (tag.startsWith("<Tabs")) {
      stack.push({ type: "tabs", opening: { start: match.index, end: tokenPattern.lastIndex, tag }, tabs: [] });
      continue;
    }

    if (tag === "</Tabs>") {
      const tabs = stack.pop();
      if (!tabs || tabs.type !== "tabs") continue;

      const titles = tabs.tabs.map((tab) => tab.title);
      const group = inferTabGroup(titles);
      if (!group) continue;

      replacements.push({
        start: tabs.opening.start,
        end: tabs.opening.end,
        value: addAttribute(tabs.opening.tag, "group", group),
      });
      for (const tab of tabs.tabs) {
        const value = tabValue(group, tab.title);
        if (!value) continue;
        replacements.push({ start: tab.start, end: tab.end, value: addValueAttribute(tab.tag, value) });
      }
      continue;
    }

    if (tag.startsWith("<Tab")) {
      const parent = stack.at(-1);
      const title = titleFromTag(tag);
      if (parent?.type === "tabs" && title) {
        parent.tabs.push({ start: match.index, end: tokenPattern.lastIndex, tag, title });
      }
      stack.push({ type: "tab" });
      continue;
    }

    if (tag === "</Tab>") stack.pop();
  }

  let output = source;
  for (const replacement of replacements.sort((left, right) => right.start - left.start)) {
    output = output.slice(0, replacement.start) + replacement.value + output.slice(replacement.end);
  }
  return output;
}

async function walk(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith("_")) continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(entryPath)));
    else if (/\.mdx?$/.test(entry.name)) files.push(entryPath);
  }
  return files;
}

async function main() {
  let changed = 0;
  for (const file of await walk(docsRoot)) {
    const source = await fs.readFile(file, "utf8");
    const annotated = annotateTabGroups(source);
    if (annotated === source) continue;
    await fs.writeFile(file, annotated);
    changed += 1;
  }
  console.log(`Annotated grouped tabs in ${changed} files`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
