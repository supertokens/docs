import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { normalizeSidebarOrders } from "./normalize-sidebar-orders";

describe("normalizeSidebarOrders", () => {
  it("preserves order groups and resolves ties alphabetically", async () => {
    const docsRoot = await mkdtemp(path.join(os.tmpdir(), "sidebar-orders-"));
    const groupPath = path.join(docsRoot, "group");
    await mkdir(groupPath);
    await writeFile(path.join(docsRoot, "first.mdx"), "---\ntitle: First\nsidebar:\n  order: 1\n---\n");
    await writeFile(path.join(groupPath, "meta.ts"), 'export default {\n  "title": "Group",\n  "order": 1.2,\n};\n');
    await writeFile(path.join(docsRoot, "later.mdx"), "---\ntitle: Later\nsidebar:\n  order: 1.2\n---\n");

    const firstRun = await normalizeSidebarOrders(docsRoot);
    const secondRun = await normalizeSidebarOrders(docsRoot);

    expect(firstRun).toEqual({ directoriesChanged: 1, filesChanged: 3 });
    expect(secondRun).toEqual({ directoriesChanged: 0, filesChanged: 0 });
    expect(await readFile(path.join(docsRoot, "first.mdx"), "utf8")).toContain("order: 10");
    expect(await readFile(path.join(groupPath, "meta.ts"), "utf8")).toContain('"order": 20');
    expect(await readFile(path.join(docsRoot, "later.mdx"), "utf8")).toContain("order: 30");
  });
});
