import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { type ExtractedCodeBlock } from "./extract";
import { languageRegistry, type RegisteredLanguage } from "./languages";
import { lintCodeBlock, lintCodeBlocksInDirectory } from "./lint";

function block(language: RegisteredLanguage, value: string, meta?: string): ExtractedCodeBlock {
  return {
    language,
    definition: languageRegistry[language],
    meta,
    sourcePath: "docs/example.mdx",
    sourceLine: 10,
    position: {
      start: { line: 10, column: 1, offset: 0 },
      end: { line: 12, column: 4, offset: value.length },
    },
    value,
  };
}

describe("code block linting", () => {
  it("accepts formatted blocks, exclusions, and known non-highlight metadata", async () => {
    await expect(
      lintCodeBlock(block("ts", "const value = 1;", 'title="example{1}.ts" lineNumbers twoslash')),
    ).resolves.toEqual([]);
    await expect(lintCodeBlock(block("ts", "// exclude-from-type-checking\nconst value=1"))).resolves.toEqual([]);
    await expect(
      lintCodeBlock(block("ts", "const value=1", 'title="contains check=true" check=false reason="Needs context"')),
    ).resolves.toEqual([]);
  });

  it("validates check metadata at the fence source line", async () => {
    for (const meta of ["check", "check=true", 'check="false"']) {
      await expect(lintCodeBlock(block("ts", "const value = 1;", meta))).resolves.toContainEqual({
        sourcePath: "docs/example.mdx",
        sourceLine: 10,
        message: "unsupported check metadata value; use check=false",
      });
    }

    await expect(lintCodeBlock(block("ts", "const value = 1;", "check=false"))).resolves.toContainEqual({
      sourcePath: "docs/example.mdx",
      sourceLine: 10,
      message: 'check=false requires exactly one reason="..." attribute',
    });

    for (const meta of ["check=false reason=setup", 'check=false reason="   "', 'check=false reason="Uses {value}"']) {
      await expect(lintCodeBlock(block("ts", "const value = 1;", meta))).resolves.toContainEqual({
        sourcePath: "docs/example.mdx",
        sourceLine: 10,
        message: expect.stringContaining("reason must be a closed, non-empty double-quoted value"),
      });
    }
  });

  it("does not let invalid exclusion metadata bypass formatting", async () => {
    const violations = await lintCodeBlock(
      block("ts", "const value={nested:true}", 'check=false check=true reason="Contradictory"'),
    );

    expect(violations.map(({ message }) => message)).toEqual(
      expect.arrayContaining([
        "code fence metadata must contain exactly one check attribute",
        "unsupported check metadata value; use check=false",
        "code block is not formatted with Prettier",
      ]),
    );
  });

  it("reports empty blocks and misplaced exclusions with source locations", async () => {
    await expect(lintCodeBlock(block("text", "  \n"))).resolves.toContainEqual({
      sourcePath: "docs/example.mdx",
      sourceLine: 10,
      message: "code block must not be empty",
    });
    await expect(lintCodeBlock(block("ts", "const value = 1;\n// exclude-from-type-checking"))).resolves.toContainEqual(
      {
        sourcePath: "docs/example.mdx",
        sourceLine: 12,
        message: "exclude-from-type-checking marker must be the first content line",
      },
    );
    const occurrences = await lintCodeBlock(
      block("ts", "// exclude-from-type-checking trailing text\nconst marker = 'exclude-from-type-checking';"),
    );
    expect(occurrences.filter(({ message }) => message.includes("marker must"))).toHaveLength(2);
  });

  it("validates numeric highlight metadata", async () => {
    await expect(lintCodeBlock(block("text", "one\ntwo\nthree\nfour\nfive", "{1, 3-5} twoslash"))).resolves.toEqual([]);

    for (const meta of ["{0}", "{3-2}", "{6}", "{1,,2}"]) {
      const violations = await lintCodeBlock(block("text", "one\ntwo\nthree\nfour\nfive", meta));
      expect(violations, meta).toHaveLength(1);
      expect(violations[0].message).toMatch(/highlight/);
    }
  });

  it("uses language-specific Prettier parsers and reports parse errors", async () => {
    await expect(lintCodeBlock(block("tsx", "export const View = () => <div />;"))).resolves.toEqual([]);
    await expect(lintCodeBlock(block("json", '{"value":1}'))).resolves.toContainEqual(
      expect.objectContaining({ message: "code block is not formatted with Prettier" }),
    );
    await expect(lintCodeBlock(block("yaml", "value:\n  nested: ["))).resolves.toContainEqual({
      sourcePath: "docs/example.mdx",
      sourceLine: 12,
      message: expect.stringContaining("Prettier could not parse code block"),
    });
  });

  it("uses the Prettier configuration resolved for the source file", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "code-block-prettier-"));
    const docsRoot = path.join(root, "docs");
    await mkdir(docsRoot);
    await writeFile(path.join(root, ".prettierrc"), '{"semi":false}');
    await writeFile(path.join(docsRoot, "configured.mdx"), "```ts\nconst value = 1\n```");

    await expect(lintCodeBlocksInDirectory(docsRoot)).resolves.toEqual([]);
  });

  it("reports extraction failures and continues linting other files", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "code-block-lint-"));
    await writeFile(path.join(root, "missing.mdx"), "```\nvalue\n```");
    await writeFile(path.join(root, "format.mdx"), '```json\n{"value":1}\n```');

    const violations = await lintCodeBlocksInDirectory(root);

    expect(violations).toHaveLength(2);
    expect(violations.map(({ message }) => message)).toEqual([
      "code block is not formatted with Prettier",
      "code fence language must be a non-empty string",
    ]);
  });
});
