import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";

import { describe, expect, it } from "vitest";

import { formatCodeBlocksInSource } from "../format-code-blocks";

describe("code block formatting", () => {
  it("changes only fence content and keeps later blocks located after size changes", async () => {
    const source = [
      "# Before",
      "",
      '```json title="one.json" {1}',
      '{"first":1,"second":2}',
      "```",
      "",
      "Between <Component value={1} />",
      "",
      "```ts",
      "const result={nested:true}",
      "```",
      "",
      "After",
    ].join("\n");

    await expect(formatCodeBlocksInSource(source, "/docs/example.mdx")).resolves.toBe(
      [
        "# Before",
        "",
        '```json title="one.json" {1}',
        '{ "first": 1, "second": 2 }',
        "```",
        "",
        "Between <Component value={1} />",
        "",
        "```ts",
        "const result = { nested: true };",
        "```",
        "",
        "After",
      ].join("\n"),
    );
  });

  it("preserves fence metadata, indentation, and CRLF newlines", async () => {
    const source = [
      "<section>",
      '  ```tsx title="view.tsx" lineNumbers',
      "  export const View=()=> <div><span>Hi</span></div>",
      "  ```",
      "</section>",
    ].join("\r\n");

    const formatted = await formatCodeBlocksInSource(source, "/docs/nested.mdx");

    expect(formatted).toContain('  ```tsx title="view.tsx" lineNumbers\r\n');
    expect(formatted).toContain("\r\n  ```\r\n</section>");
    expect(formatted.replaceAll("\r\n", "")).not.toContain("\n");
    expect(formatted.split("\r\n").filter((line) => line.includes("export") || line.includes("<div"))).toEqual([
      "  export const View = () => (",
      "    <div>",
    ]);
  });

  it("normalizes CRLF Prettier output before reconstructing source newlines", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "format-code-block-crlf-"));
    const docsRoot = path.join(root, "docs");
    const sourcePath = path.join(docsRoot, "example.mdx");
    await mkdir(docsRoot);
    await writeFile(path.join(root, ".prettierrc"), JSON.stringify({ endOfLine: "crlf", printWidth: 20 }));
    const source = ["```json", '{"first":1,"second":2}', "```"].join("\r\n");

    const formatted = await formatCodeBlocksInSource(source, sourcePath);

    expect(formatted).toBe(["```json", "{", '  "first": 1,', '  "second": 2', "}", "```"].join("\r\n"));
    expect(formatted).not.toContain("\r\r\n");
    expect(formatted.replaceAll("\r\n", "")).not.toMatch(/[\r\n]/);
  });

  it("leaves excluded and unsupported blocks unchanged", async () => {
    const source = [
      "```ts",
      "// exclude-from-type-checking",
      "const excluded={value:true}",
      "```",
      "",
      "```go",
      'func main(){fmt.Println("unchanged")}',
      "```",
    ].join("\n");

    await expect(formatCodeBlocksInSource(source, "/docs/skipped.mdx")).resolves.toBe(source);
  });

  it("has no import side effect", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "format-code-block-import-"));
    const sentinel = path.join(root, "sentinel.mdx");
    await writeFile(sentinel, "```ts\nconst value=1\n```");
    const moduleUrl = new URL("../format-code-blocks.ts", import.meta.url).href;

    await promisify(execFile)("bun", ["-e", `await import(${JSON.stringify(moduleUrl)})`], { cwd: root });

    await expect(readFile(sentinel, "utf8")).resolves.toBe("```ts\nconst value=1\n```");
  });
});
