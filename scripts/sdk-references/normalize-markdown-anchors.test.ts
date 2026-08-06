import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  anchorHeadingCollisions,
  namespaceCollidingMemberAnchors,
  normalizeMarkdownAnchors,
} from "./normalize-markdown-anchors";

describe("normalizeMarkdownAnchors", () => {
  it("namespaces member anchors that collide with symbol headings", () => {
    const source = `### AuthComponentProps

| Property |
| --- |
| <a id="navigate"></a> \`navigate\` |

### Navigate
`;

    const normalized = namespaceCollidingMemberAnchors(source);

    expect(normalized.renamed).toBe(1);
    expect(normalized.source).toContain('<a id="member-authcomponentprops-navigate"></a>');
    expect(anchorHeadingCollisions(normalized.source)).toEqual([]);
  });

  it("recognizes explicit anchors with additional attributes and single quotes", () => {
    const source = "<a className=\"member\" id='navigate'></a>\n\n### Navigate\n";
    expect(anchorHeadingCollisions(source)).toEqual(["navigate"]);
  });

  it("repairs local and cross-page links to canonical heading anchors", async () => {
    const tempRoot = await mkdtemp(path.join(os.tmpdir(), "docs-anchors-"));
    const docsRoot = path.join(tempRoot, "docs");
    const referencesRoot = path.join(docsRoot, "references");
    await mkdir(referencesRoot, { recursive: true });
    const typesPath = path.join(referencesRoot, "types.mdx");
    const packagePath = path.join(referencesRoot, "package.mdx");
    await writeFile(
      typesPath,
      `### AuthComponentProps

| Property |
| --- |
| <a id="navigate"></a> [Navigate](#navigate-1) |

### Navigate
`,
    );
    await writeFile(
      packagePath,
      "[Relative](types#navigate-1)\n[Docs absolute](/docs/references/types#navigate-1)\n[Site absolute](/references/types#navigate-1)\n",
    );

    const result = await normalizeMarkdownAnchors(referencesRoot);

    expect(result).toMatchObject({ linksRepaired: 4, memberAnchorsRenamed: 1 });
    expect(await readFile(typesPath, "utf8")).toContain("[Navigate](#navigate)");
    expect(await readFile(packagePath, "utf8")).toBe(
      "[Relative](types#navigate)\n[Docs absolute](/docs/references/types#navigate)\n[Site absolute](/references/types#navigate)\n",
    );
  });
});
