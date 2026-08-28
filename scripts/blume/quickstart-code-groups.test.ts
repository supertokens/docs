import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { parseCodeOption } from "../../lib/code-group-options";

const quickstart = readFileSync(resolve(import.meta.dirname, "../../docs/quickstart.mdx"), "utf8");

describe("quickstart code groups", () => {
  it("uses CodeGroup for synchronized code choices", () => {
    expect(quickstart).not.toMatch(/<Tabs\b[^>]*\bgroup=/);
    expect(quickstart.match(/<CodeGroup\b/g)?.length).toBeGreaterThan(0);
    for (const group of quickstart.matchAll(/<CodeGroup\b[^>]*>([\s\S]*?)<\/CodeGroup>/g)) {
      expect(group[1]).not.toMatch(/<(?:Tab|DependentContent|ContentOption)\b/);
      expect(group[1]).toMatch(/```\w+[^\n]*\btitle="[^"]+"/);
    }
    expect(quickstart).toContain('title="Node.js" option="node-frameworks:express"');
    expect(quickstart).toContain('title="Node.js" option="node-frameworks:fastify"');
    expect(quickstart).toContain('title="Go" option="go-frameworks:gin"');
  });

  it("uses fences for standalone and incidental snippets", () => {
    expect(quickstart).not.toMatch(/<CodeBlock\b/);
    expect(quickstart).toMatch(/```json/);
  });

  it("uses declared secondary option values", () => {
    const options = [...quickstart.matchAll(/\boption="([^"]+)"/g)].map((match) => match[1]);
    expect(options.length).toBeGreaterThan(0);
    for (const option of options) expect(parseCodeOption(option)).toBeDefined();
  });

  it("keeps the non-code Cookie and Header choices in Tabs", () => {
    expect(quickstart).toContain('<Tab title="Cookie">');
    expect(quickstart).toContain('<Tab title="Header (Authorization Bearer)">');
    const proseTabs = quickstart.match(/<Tabs>[\s\S]*?<\/Tabs>/)?.[0];
    expect(proseTabs).toBeDefined();
    expect(proseTabs).toMatch(/```/);
  });
});
