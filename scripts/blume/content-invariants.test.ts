import { existsSync, readdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { annotateTabGroups } from "./annotate-tab-groups.mjs";

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

  it("does not use Tabs as a wrapper for a lone code fence", () => {
    expect(tabsDirectlyWrappingCode()).toEqual([]);
  });

  it("does not publish tab groups without Tab children", () => {
    expect(tabsWithoutTabChildren()).toEqual([]);
  });

  it("does not publish recognizable selector tabs without semantic groups", () => {
    const violations = contentFiles
      .filter(({ source }) => annotateTabGroups(source) !== source)
      .map(({ path }) => relative(repositoryRoot, path));
    expect(violations).toEqual([]);
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

  it("does not leak typecheck-only source lines", () => {
    expect(locationsMatching(/#\s*typecheck-only,\s*removed from output\s*$/)).toEqual([]);
  });

  it("rejects the known appInfo text fence with malformed metadata", () => {
    expect(locationsMatching(/^\s*```text\s+appInfo\s*=\s*\{\s*$/)).toEqual([]);
  });
});
