import { mkdtemp, mkdir, readFile, realpath, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { writeCodeBlocks } from "../write-code-blocks";
import { extractCodeBlocks, resolveMarkdownSourcePaths, scanCodeBlocks } from "./extract";
import { getLanguageDefinition, languageRegistry } from "./languages";

describe("code block extraction", () => {
  it("extracts all registered blocks with metadata and source locations", async () => {
    const blocks = await extractCodeBlocks(
      ["# Example", "", '```javascript title="example.js"', "const value = 1;", "```", "", "```json", "{}", "```"].join(
        "\n",
      ),
      "/docs/example.mdx",
    );

    expect(blocks.map(({ position: _position, ...block }) => block)).toEqual([
      {
        definition: languageRegistry.javascript,
        language: "javascript",
        meta: 'title="example.js"',
        sourcePath: "/docs/example.mdx",
        sourceLine: 3,
        value: "const value = 1;",
      },
      {
        definition: languageRegistry.json,
        language: "json",
        meta: undefined,
        sourcePath: "/docs/example.mdx",
        sourceLine: 7,
        value: "{}",
      },
    ]);
    expect(blocks.map(({ position }) => position.start)).toEqual([
      { line: 3, column: 1, offset: 11 },
      { line: 7, column: 1, offset: 66 },
    ]);
  });

  it("reports positions from the original nested MDX source", async () => {
    const source = [
      "# Example",
      "",
      '<Steps items={["First"]}>',
      '<Step title="First">',
      "",
      "## Nested heading",
      "",
      "Text",
      "",
      "```",
      "value",
      "```",
      "</Step>",
      "</Steps>",
    ].join("\n");

    await expect(extractCodeBlocks(source, "nested.mdx")).rejects.toThrow(
      "nested.mdx:10: code fence language must be a non-empty string",
    );
  });

  it("parses Markdown separately from MDX", async () => {
    const blocks = await extractCodeBlocks("Use {placeholder}.\n\n```python\nprint('ok')\n```", "/docs/template.md");

    expect(blocks[0]).toMatchObject({ language: "python", sourceLine: 3 });
  });

  it("fails for missing and unknown languages", async () => {
    await expect(extractCodeBlocks("```\nvalue\n```", "missing.mdx")).rejects.toThrow(
      "missing.mdx:1: code fence language must be a non-empty string",
    );
    await expect(extractCodeBlocks("```rust\nvalue\n```", "unknown.mdx")).rejects.toThrow(
      "unknown.mdx:1: unknown code fence language 'rust'",
    );
    expect(() => getLanguageDefinition(42, "non-string.mdx", 7)).toThrow(
      "non-string.mdx:7: code fence language must be a non-empty string",
    );
  });

  it("fails on MDX parse errors", async () => {
    await expect(extractCodeBlocks("{", "broken.mdx")).rejects.toThrow();
  });

  it("scans files in deterministic path order", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "code-block-scan-"));
    await writeFile(path.join(root, "z.md"), "```go\nfunc z() {}\n```");
    await writeFile(path.join(root, "a.mdx"), "```ts\nconst a = 1\n```");

    const blocks = await scanCodeBlocks(root);

    expect(blocks.map((block) => path.basename(block.sourcePath))).toEqual(["a.mdx", "z.md"]);
  });

  it("resolves mixed files and directories deterministically without duplicates", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "code-block-resolve-"));
    const nested = path.join(root, "nested");
    const markdownPath = path.join(root, "a.md");
    const mdxPath = path.join(nested, "z.mdx");
    await mkdir(nested);
    await writeFile(markdownPath, "# Markdown");
    await writeFile(mdxPath, "# MDX");
    await writeFile(path.join(nested, "ignored.txt"), "ignored");
    const mdxAliasPath = path.join(root, "z-alias.mdx");
    await symlink(mdxPath, mdxAliasPath);
    const [canonicalMarkdownPath, canonicalMdxPath] = await Promise.all([realpath(markdownPath), realpath(mdxPath)]);

    await expect(resolveMarkdownSourcePaths([nested, markdownPath, root, mdxPath, mdxAliasPath])).resolves.toEqual([
      canonicalMarkdownPath,
      canonicalMdxPath,
    ]);
  });

  it("supports an explicit empty selection and rejects invalid inputs", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "code-block-resolve-invalid-"));
    const unsupportedPath = path.join(root, "example.txt");
    await writeFile(unsupportedPath, "text");

    await expect(resolveMarkdownSourcePaths([])).resolves.toEqual([]);
    await expect(resolveMarkdownSourcePaths([unsupportedPath])).rejects.toThrow(
      "expected a Markdown file or directory",
    );
    await expect(resolveMarkdownSourcePaths([path.join(root, "missing.md")])).rejects.toThrow("path does not exist");
    await expect(resolveMarkdownSourcePaths([""])).rejects.toThrow("source path must not be empty");
  });
});

describe("language registry", () => {
  it("contains every supported language and correct JavaScript and Dart extensions", () => {
    expect(Object.keys(languageRegistry)).toEqual([
      "ts",
      "tsx",
      "typescript",
      "js",
      "javascript",
      "go",
      "py",
      "python",
      "kotlin",
      "swift",
      "dart",
      "php",
      "java",
      "csharp",
      "text",
      "json",
      "bash",
      "html",
      "yaml",
      "sql",
      "batch",
      "xml",
      "gradle",
      "objc",
    ]);
    expect(languageRegistry.javascript).toMatchObject({ kind: "compilable", extension: "js" });
    expect(languageRegistry.dart).toMatchObject({ kind: "compilable", extension: "dart" });
    expect(languageRegistry.xml.kind).toBe("render-only");
  });
});

describe("code block writing", () => {
  it("clears snippets, exposes source lines, preserves exclusions, and applies transformations", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "code-block-write-"));
    const docsRoot = path.join(root, "docs");
    const outputRoot = path.join(root, "output");
    await mkdir(docsRoot);
    await mkdir(path.join(outputRoot, "javascript", "snippets"), { recursive: true });
    await writeFile(path.join(outputRoot, "javascript", "snippets", "stale.ts"), "stale");
    await writeFile(
      path.join(docsRoot, "example.mdx"),
      [
        "```javascript",
        'import "supertokens-web-js-script";',
        "```",
        "",
        "```json",
        "{}",
        "```",
        "",
        "```dart",
        "void main() {}",
        "```",
        "",
        "```ts",
        "// exclude-from-type-checking",
        "const excluded = true;",
        "```",
        "",
        '```ts check=false reason="Requires application context"',
        "const metadataExcluded = true;",
        "```",
      ].join("\n"),
    );

    await writeCodeBlocks({ docsRoot, outputRoot });

    const javascriptPath = path.join(outputRoot, "javascript/snippets/example.mdx/1-line-1/code-block.js");
    const dartPath = path.join(outputRoot, "dart/snippets/example.mdx/1-line-9/code-block.dart");
    await expect(readFile(javascriptPath, "utf8")).resolves.toBe('import "supertokens-web-js";\nexport {}');
    await expect(readFile(dartPath, "utf8")).resolves.toBe("void main() {}");
    await expect(
      readFile(path.join(outputRoot, "javascript/snippets/example.mdx/2-line-18/code-block.ts")),
    ).rejects.toThrow();
    await expect(readFile(path.join(outputRoot, "javascript", "snippets", "stale.ts"))).rejects.toThrow();
  });

  it("rejects invalid exclusion metadata before clearing generated snippets", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "code-block-write-invalid-"));
    const docsRoot = path.join(root, "docs");
    const outputRoot = path.join(root, "output");
    const stalePath = path.join(outputRoot, "javascript/snippets/stale.ts");
    await mkdir(docsRoot);
    await mkdir(path.dirname(stalePath), { recursive: true });
    await writeFile(stalePath, "stale");
    await writeFile(
      path.join(docsRoot, "invalid.mdx"),
      '```ts check=false check=true reason="Contradictory"\nconst value = 1;\n```',
    );

    await expect(writeCodeBlocks({ docsRoot, outputRoot })).rejects.toThrow(
      "invalid.mdx:1: code fence metadata must contain exactly one check attribute",
    );
    await expect(readFile(stalePath, "utf8")).resolves.toBe("stale");
  });

  it("writes selected files relative to the docs root and leaves snippets untouched for an empty selection", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "code-block-write-selected-"));
    const docsRoot = path.join(root, "docs");
    const outputRoot = path.join(root, "output");
    const selectedPath = path.join(docsRoot, "guide", "selected.mdx");
    const unselectedPath = path.join(docsRoot, "other.mdx");
    const stalePath = path.join(outputRoot, "javascript", "snippets", "stale.ts");
    await mkdir(path.dirname(selectedPath), { recursive: true });
    await mkdir(path.dirname(stalePath), { recursive: true });
    await writeFile(selectedPath, "```ts\nconst selected = true;\n```");
    await writeFile(unselectedPath, "```ts\nconst unselected = true;\n```");
    await writeFile(stalePath, "stale");

    await writeCodeBlocks({ docsRoot, outputRoot, inputs: [selectedPath] });

    const selectedOutput = path.join(outputRoot, "javascript/snippets/guide/selected.mdx/1-line-1/code-block.ts");
    await expect(readFile(selectedOutput, "utf8")).resolves.toContain("const selected = true;");
    await expect(
      readFile(path.join(outputRoot, "javascript/snippets/other.mdx/1-line-1/code-block.ts")),
    ).rejects.toThrow();

    await writeCodeBlocks({ docsRoot, outputRoot, inputs: [] });
    await expect(readFile(selectedOutput, "utf8")).resolves.toContain("const selected = true;");
  });

  it("rejects source symlinks that escape the canonical docs root", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "code-block-write-symlink-"));
    const docsRoot = path.join(root, "docs");
    const outsidePath = path.join(root, "outside.mdx");
    const linkedPath = path.join(docsRoot, "linked.mdx");
    await mkdir(docsRoot);
    await writeFile(outsidePath, "```ts\nconst escaped = true;\n```");
    await symlink(outsidePath, linkedPath);

    await expect(
      writeCodeBlocks({ docsRoot, outputRoot: path.join(root, "output"), inputs: [linkedPath] }),
    ).rejects.toThrow("source must be inside");
  });

  it("produces identical Kotlin output for full and selective extraction", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "code-block-write-kotlin-"));
    const docsRoot = path.join(root, "docs");
    const outputRoot = path.join(root, "output");
    const selectedPath = path.join(docsRoot, "z-selected.mdx");
    await mkdir(docsRoot);
    await writeFile(path.join(docsRoot, "a-earlier.mdx"), "```kotlin\nclass NetworkManager\n```");
    await writeFile(selectedPath, "```kotlin\nclass NetworkManager\nclass MainApplication\n```");

    await writeCodeBlocks({ docsRoot, outputRoot });
    const outputPath = path.join(outputRoot, "kotlin/snippets/z-selected.mdx/1-line-1/code-block.kt");
    const fullOutput = await readFile(outputPath, "utf8");

    await writeCodeBlocks({ docsRoot, outputRoot, inputs: [selectedPath] });
    await expect(readFile(outputPath, "utf8")).resolves.toBe(fullOutput);
  });
});
