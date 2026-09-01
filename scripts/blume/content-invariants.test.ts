import { existsSync, readdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

import { createProcessor } from "@mdx-js/mdx";
import { describe, expect, it } from "vitest";

import { tabValue, type TabGroup } from "../../components/tab-groups";
import { anchorHeadingCollisions, explicitAnchorIds } from "../sdk-references/normalize-markdown-anchors";
import { annotateTabGroups } from "./annotate-tab-groups.mjs";
import { validateTabStructure } from "./migrate-nested-tabs";

interface ContentFile {
  path: string;
  lines: string[];
  source: string;
}

const repositoryRoot = resolve(import.meta.dirname, "../..");
const docsRoot = resolve(repositoryRoot, "docs");
const publicRoot = resolve(repositoryRoot, "public");

function readContentFiles(directory: string): ContentFile[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      return entry.name.startsWith("_") ? [] : readContentFiles(path);
    }

    if (!entry.isFile() || !/\.mdx?$/.test(entry.name)) {
      return [];
    }

    const source = readFileSync(path, "utf8");
    return [{ path, lines: source.split(/\r?\n/), source }];
  });
}

const contentFiles = readContentFiles(docsRoot);
const mdxProcessor = createProcessor();

interface MdxNode {
  attributes?: Array<{ name: string; value?: unknown }>;
  children?: MdxNode[];
  name?: string;
  meta?: string;
  position?: { start: { line: number } };
  type: string;
}

const parsedContentFiles = contentFiles.map((file) => ({ ...file, tree: mdxProcessor.parse(file.source) as MdxNode }));

function walkMdx(node: MdxNode, ancestors: MdxNode[], visit: (node: MdxNode, ancestors: MdxNode[]) => void) {
  visit(node, ancestors);
  for (const child of node.children ?? []) walkMdx(child, [...ancestors, node], visit);
}

function hasCode(node: MdxNode): boolean {
  return node.type === "code" || (node.children ?? []).some(hasCode);
}

function stringAttribute(node: MdxNode, name: string): string | undefined {
  const value = node.attributes?.find((attribute) => attribute.name === name)?.value;
  return typeof value === "string" ? value : undefined;
}

function locationsMatching(pattern: RegExp): string[] {
  return contentFiles.flatMap(({ path, lines }) =>
    lines.flatMap((line, index) =>
      pattern.test(line) ? [`${relative(repositoryRoot, path)}:${index + 1}: ${line.trim()}`] : [],
    ),
  );
}

function sourceLocationsMatching(pattern: RegExp): string[] {
  return contentFiles.flatMap(({ path, source }) => {
    const matches = source.matchAll(
      new RegExp(pattern, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`),
    );

    return Array.from(matches, (match) => {
      const line = source.slice(0, match.index ?? 0).split(/\r?\n/).length;
      return `${relative(repositoryRoot, path)}:${line}`;
    });
  });
}

function withoutFencedCode(source: string): string {
  let fence: string | undefined;

  return source
    .split(/\r?\n/)
    .map((line) => {
      const marker = line.match(/^\s*(`{3,}|~{3,})/)?.[1];
      if (!fence && marker) {
        fence = marker;
        return "";
      }
      if (fence && marker?.[0] === fence[0] && marker.length >= fence.length) {
        fence = undefined;
        return "";
      }
      return fence ? "" : line;
    })
    .join("\n");
}

function contentImageReferences(): Array<{ location: string; url: string }> {
  return contentFiles.flatMap(({ path, source }) => {
    const searchableSource = withoutFencedCode(source);
    const references: Array<{ location: string; url: string }> = [];
    const patterns = [
      /!\[[^\]]*\]\(<?([^\s)>]+)>?(?:\s+["'][^"']*["'])?\)/g,
      /<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi,
    ];

    for (const pattern of patterns) {
      for (const match of searchableSource.matchAll(pattern)) {
        const line = searchableSource.slice(0, match.index ?? 0).split(/\r?\n/).length;
        references.push({ location: `${relative(repositoryRoot, path)}:${line}`, url: match[1] });
      }
    }

    return references;
  });
}

function section(source: string, start: string, end: string): string {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  if (startIndex < 0 || endIndex < 0) throw new Error(`Missing section between ${start} and ${end}`);
  return source.slice(startIndex, endIndex);
}

function tabsDirectlyWrappingCode(): string[] {
  const violations: string[] = [];

  for (const { path, lines } of contentFiles) {
    for (let index = 0; index < lines.length; index += 1) {
      if (!/<Tabs\b[^>]*>/.test(lines[index])) continue;

      let cursor = index + 1;
      while (lines[cursor]?.trim() === "") cursor += 1;

      const openingFence = lines[cursor]?.trim().match(/^(`{3,}|~{3,})/);
      if (!openingFence) continue;

      const closingFence = new RegExp(`^${openingFence[1][0]}{${openingFence[1].length},}\\s*$`);
      cursor += 1;
      while (cursor < lines.length && !closingFence.test(lines[cursor].trim())) cursor += 1;
      if (cursor === lines.length) continue;

      cursor += 1;
      while (lines[cursor]?.trim() === "") cursor += 1;

      if (lines[cursor]?.trim() === "</Tabs>") {
        violations.push(`${relative(repositoryRoot, path)}:${index + 1}`);
      }
    }
  }

  return violations;
}

function tabsWithoutTabChildren(): string[] {
  const violations: string[] = [];

  for (const { path, source } of contentFiles) {
    const stack: Array<{ hasTab: boolean; line: number }> = [];
    const tokens = source.matchAll(/<Tabs\b[^>]*>|<\/Tabs>|<Tab\b[^>]*>/g);

    for (const token of tokens) {
      if (token[0].startsWith("<Tabs")) {
        stack.push({ hasTab: false, line: source.slice(0, token.index).split(/\r?\n/).length });
      } else if (token[0] === "</Tabs>") {
        const tabs = stack.pop();
        if (tabs && !tabs.hasTab) violations.push(`${relative(repositoryRoot, path)}:${tabs.line}`);
      } else {
        for (const tabs of stack) tabs.hasTab = true;
      }
    }
  }

  return violations;
}

function stepsWithoutStepChildren(): string[] {
  const violations: string[] = [];

  for (const { path, tree } of parsedContentFiles) {
    walkMdx(tree, [], (node) => {
      if (node.name === "Steps" && !node.children?.some((child) => child.name === "Step")) {
        violations.push(`${relative(repositoryRoot, path)}:${node.position?.start.line ?? 1}`);
      }
    });
  }

  return violations;
}

describe("published documentation invariants", () => {
  it("does not end an outer code fence at a shorter nested fence", () => {
    expect(withoutFencedCode("````md\n```md\n![Example](/img/missing.png)\n```\n````")).toBe("\n\n\n\n");
  });

  it("recognizes common package-manager tab groups", () => {
    expect(
      annotateTabGroups('<Tabs><Tab title="npm"></Tab><Tab title="yarn"></Tab><Tab title="pnpm"></Tab></Tabs>'),
    ).toContain('<Tabs group="package-managers">');
  });

  it("recognizes package-manager script tab groups", () => {
    expect(
      annotateTabGroups(
        '<Tabs><Tab title="npm run"></Tab><Tab title="yarn run"></Tab><Tab title="pnpm run"></Tab></Tabs>',
      ),
    ).toContain('<Tabs group="package-manager-scripts">');
  });

  it('does not publish placeholder tabs titled "Option"', () => {
    expect(locationsMatching(/<Tab\s+title=(["'])Option\1\s*>/)).toEqual([]);
  });

  it('does not publish dependent controls labeled "Example"', () => {
    expect(locationsMatching(/<DependentContent\b[^>]*\blabel=(["'])Example\1/)).toEqual([]);
  });

  it("does not use Tabs as a wrapper for a lone code fence", () => {
    expect(tabsDirectlyWrappingCode()).toEqual([]);
  });

  it("does not publish tab groups without Tab children", () => {
    expect(tabsWithoutTabChildren()).toEqual([]);
  });

  it("does not publish Steps without Step children", () => {
    expect(stepsWithoutStepChildren()).toEqual([]);
  });

  it("does not publish highlighted code lines", () => {
    expect(locationsMatching(/^\s*(?:`{3,}|~{3,})[^\s]+\s+\{[0-9, -]+\}(?:\s|$)/)).toEqual([]);
  });

  it("uses canonical mobile option labels", () => {
    expect(locationsMatching(/title=(['"])(?:Reactnative|Ios)\1/)).toEqual([]);
  });

  it("does not publish nested or unbalanced tab controls", () => {
    const violations = contentFiles.flatMap(({ path, source }) => {
      const validation = validateTabStructure(source);
      return validation.nestedTabs || validation.unbalanced.length
        ? [`${relative(repositoryRoot, path)}: ${validation.nestedTabs} nested, ${validation.unbalanced.join(", ")}`]
        : [];
    });
    expect(violations).toEqual([]);
  });

  it("keeps Web and Mobile as primary tabs", () => {
    expect(locationsMatching(/<DependentContent\b(?![^>]*\bpassive\b)[^>]*\bgroup=(["'])frontend-custom-ui\1/)).toEqual(
      [],
    );
    expect(locationsMatching(/<PlatformTypeSwitch\b|storageKey=(["'])platform-type\1/)).toEqual([]);
  });

  it("does not publish explicit anchors that collide with heading IDs", () => {
    const collisions = contentFiles.flatMap(({ path, source }) =>
      anchorHeadingCollisions(source).map((id) => `${relative(repositoryRoot, path)}: #${id}`),
    );
    expect(collisions).toEqual([]);
  });

  it("does not publish duplicate explicit anchors", () => {
    const duplicates = contentFiles.flatMap(({ path, source }) => {
      const ids = explicitAnchorIds(source);
      return [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))].map(
        (id) => `${relative(repositoryRoot, path)}: #${id}`,
      );
    });
    expect(duplicates).toEqual([]);
  });

  it("does not publish recognizable selector tabs without semantic groups", () => {
    const violations = contentFiles
      .filter(({ source }) => annotateTabGroups(source) !== source)
      .map(({ path }) => relative(repositoryRoot, path));
    expect(violations).toEqual([]);
  });

  it("keeps grouped selection ownership out of Tabs", () => {
    expect(locationsMatching(/<Tabs\b[^>]*\bgroup=/)).toEqual([]);
  });

  it("does not use prop-based CodeBlock components", () => {
    expect(locationsMatching(/<CodeBlock\b/)).toEqual([]);
  });

  it("keeps CodeGroup options code-only", () => {
    const structural = new Set(["Tab", "DependentContent", "ContentOption", "ConditionalContent"]);
    const violations: string[] = [];
    for (const { path, tree } of parsedContentFiles) {
      walkMdx(tree, [], (node) => {
        if (node.name !== "CodeGroup") return;
        const inspect = (parent: MdxNode) => {
          for (const child of parent.children ?? []) {
            if (child.type === "code") continue;
            if (child.name && structural.has(child.name)) inspect(child);
            else violations.push(`${relative(repositoryRoot, path)}:${child.position?.start.line ?? 1}`);
          }
        };
        inspect(node);
      });
    }
    expect(violations).toEqual([]);
  });

  it("does not leave selectable code in standalone DependentContent", () => {
    const violations: string[] = [];
    for (const { path, tree } of parsedContentFiles) {
      walkMdx(tree, [], (node, ancestors) => {
        if (
          node.name === "DependentContent" &&
          hasCode(node) &&
          !node.attributes?.some(({ name }) => name === "passive") &&
          !ancestors.some((ancestor) => ancestor.name === "CodeGroup")
        ) {
          violations.push(`${relative(repositoryRoot, path)}:${node.position?.start.line ?? 1}`);
        }
      });
    }
    expect(violations).toEqual([]);
  });

  it("keeps every passive prose choice reachable from an owning CodeGroup", () => {
    const violations: string[] = [];
    for (const { path, tree } of parsedContentFiles) {
      const owners = new Map<string, Set<string>>();
      const scopeFor = (ancestors: MdxNode[]) =>
        ancestors
          .filter((ancestor) => ancestor.name === "VariantContent")
          .map((ancestor) => `${stringAttribute(ancestor, "storageKey")}:${stringAttribute(ancestor, "value")}`)
          .join("/");
      const ownerKey = (group: string, ancestors: MdxNode[]) => `${scopeFor(ancestors)}|${group}`;
      walkMdx(tree, [], (node, ancestors) => {
        if (node.name !== "CodeGroup" || node.attributes?.some(({ name }) => name === "passive")) return;
        const group = stringAttribute(node, "group");
        if (!group) return;
        const key = ownerKey(group, ancestors);
        const values = owners.get(key) ?? new Set<string>();
        for (const child of node.children ?? []) {
          if (child.name === "Tab") {
            const value = stringAttribute(child, "value");
            if (value) values.add(value);
          }
        }
        owners.set(key, values);
      });
      walkMdx(tree, [], (node, ancestors) => {
        if (
          node.name === "DependentContent" &&
          !node.attributes?.some(({ name }) => name === "passive") &&
          ancestors.some((ancestor) => {
            if (ancestor.name !== "CodeGroup") return false;
            if (!ancestor.attributes?.some(({ name }) => name === "passive")) return true;
            return stringAttribute(ancestor, "secondaryControls")
              ?.split(",")
              .includes(stringAttribute(node, "group") ?? "");
          })
        ) {
          const group = stringAttribute(node, "group");
          if (group) {
            const key = ownerKey(group, ancestors);
            const values = owners.get(key) ?? new Set<string>();
            for (const child of node.children ?? []) {
              const value = child.name === "ContentOption" ? stringAttribute(child, "value") : undefined;
              if (value) values.add(value);
            }
            owners.set(key, values);
          }
        }
        if (node.type !== "code" || !node.meta) return;
        const option = /(?:^|\s)option=["']([^:"']+):([^"']+)["']/.exec(node.meta);
        if (option) {
          const codeGroup = ancestors.findLast((ancestor) => ancestor.name === "CodeGroup");
          const canOwn =
            codeGroup &&
            (!codeGroup.attributes?.some(({ name }) => name === "passive") ||
              stringAttribute(codeGroup, "secondaryControls")?.split(",").includes(option[1]));
          if (canOwn) {
            const key = ownerKey(option[1], ancestors);
            const values = owners.get(key) ?? new Set<string>();
            values.add(option[2]);
            owners.set(key, values);
          }
        }
        const codeGroup = ancestors.findLast((ancestor) => ancestor.name === "CodeGroup");
        const group = codeGroup ? stringAttribute(codeGroup, "group") : undefined;
        const title = /(?:^|\s)title=["']([^"']+)["']/.exec(node.meta)?.[1];
        const value = group && title ? tabValue(group as TabGroup, title) : undefined;
        if (group && value && !codeGroup?.attributes?.some(({ name }) => name === "passive")) {
          const key = ownerKey(group, ancestors);
          const values = owners.get(key) ?? new Set<string>();
          values.add(value);
          owners.set(key, values);
        }
      });
      walkMdx(tree, [], (node, ancestors) => {
        if (node.name !== "DependentContent" || !node.attributes?.some(({ name }) => name === "passive")) return;
        const group = stringAttribute(node, "group");
        if (!group) return;
        const values = owners.get(ownerKey(group, ancestors));
        for (const child of node.children ?? []) {
          const value = child.name === "ContentOption" ? stringAttribute(child, "value") : undefined;
          if (value && !values?.has(value)) {
            violations.push(`${relative(repositoryRoot, path)}:${child.position?.start.line ?? 1} ${group}:${value}`);
          }
        }
      });
    }
    expect(violations).toEqual([]);
  });

  it("keeps manually migrated procedures in single ordered Steps containers", () => {
    const sourceForPath = (suffix: string) => contentFiles.find(({ path }) => path.endsWith(suffix))!.source;
    const passkeySignup = section(
      sourceForPath("authentication/passkeys/initial-setup.mdx"),
      "#### 2.1 Add the sign up form",
      "#### 2.2 Add the login form",
    );
    const passkeySignin = section(
      sourceForPath("authentication/passkeys/initial-setup.mdx"),
      "#### 2.2 Add the login form",
      "</VariantContent>",
    );

    expect(passkeySignup.match(/<Steps>/g)).toHaveLength(1);
    expect(passkeySignup.match(/<Step\b/g)).toHaveLength(4);
    expect(passkeySignin.match(/<Steps>/g)).toHaveLength(1);
    expect(passkeySignin.match(/<Step\b/g)).toHaveLength(4);
  });

  it("does not publish raw YouTube iframes", () => {
    expect(
      sourceLocationsMatching(
        /<iframe\b(?=[^>]*\bsrc=["']https?:\/\/(?:www\.)?(?:youtube\.com|youtube-nocookie\.com|youtu\.be)\/)[^>]*>/i,
      ),
    ).toEqual([]);
  });

  it("does not prefix public images with the documentation base path", () => {
    expect(
      contentImageReferences()
        .filter(({ url }) => url.startsWith("/docs/img/"))
        .map(({ location, url }) => `${location}: ${url}`),
    ).toEqual([]);
  });

  it("only references public images that exist", () => {
    const missing = contentImageReferences().flatMap(({ location, url }) => {
      if (!url.startsWith("/") || url.startsWith("//")) return [];

      let pathname: string;
      try {
        pathname = decodeURIComponent(new URL(url, "https://docs.example.com").pathname);
      } catch {
        return [`${location}: invalid URL ${url}`];
      }

      const assetPath = resolve(publicRoot, `.${pathname}`);
      return assetPath.startsWith(`${publicRoot}/`) && existsSync(assetPath) ? [] : [`${location}: ${url}`];
    });

    expect(missing).toEqual([]);
  });

  it("serves standalone SDK logos as valid SVG documents", () => {
    for (const file of [
      "js.svg",
      "nodejs-small.svg",
      "fastify.svg",
      "flask.svg",
      "koa.svg",
      "loopback.svg",
      "php.svg",
      "serverless.svg",
    ]) {
      const source = readFileSync(resolve(publicRoot, "img/logos", file), "utf8");
      expect(source, file).toMatch(/<svg\b[^>]*\bxmlns="http:\/\/www\.w3\.org\/2000\/svg"/u);
      expect(source, file).toMatch(/<svg\b[^>]*(?:\bviewBox="[^"]+"|\bwidth="\d+"[^>]*\bheight="\d+")/u);
    }
  });

  it("does not leak typecheck-only source lines", () => {
    expect(locationsMatching(/#\s*typecheck-only,\s*removed from output\s*$/)).toEqual([]);
  });

  it("rejects the known appInfo text fence with malformed metadata", () => {
    expect(locationsMatching(/^\s*```text\s+appInfo\s*=\s*\{\s*$/)).toEqual([]);
  });
});
