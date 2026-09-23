import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

import { create, insertMultiple, search } from "@orama/orama";
import { joinBase } from "blume/components/islands/base-path.ts";
import { buildResult } from "blume/components/layout/search/types.ts";
import type { SearchFn } from "blume/components/layout/search/types.ts";
import { withBasePath } from "blume/core/base-path.ts";
import { ModuleKind, ScriptTarget, transpileModule } from "typescript";

const source = readFileSync(new URL("./Search.astro", import.meta.url), "utf8");
const frontmatter = source.split("---")[1];
const clientScript = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];

function compile(script: string, deploymentBase: string) {
  return transpileModule(script.replaceAll("import.meta.env.BASE_URL", JSON.stringify(deploymentBase)), {
    compilerOptions: { module: ModuleKind.CommonJS, target: ScriptTarget.ES2022, esModuleInterop: false },
  }).outputText;
}

describe("custom search loader routing", () => {
  it.each([
    ["", "/", "/blume-search.json"],
    ["/docs", "/", "/docs/blume-search.json"],
    ["/docs/reference", "/", "/docs/reference/blume-search.json"],
    ["/docs", "/host", "/host/docs/blume-search.json"],
    ["/docs", "/host/", "/host/docs/blume-search.json"],
  ])("uses basePath %j and deployment base %j", async (basePath, deploymentBase, expectedUrl) => {
    // Evaluate the component's server code, then carry only its URL through the markup.
    const indexUrl: string = runInNewContext(`${compile(frontmatter, deploymentBase)}\nindexUrl;`, {
      exports: {},
      Astro: { props: {} },
      require: (id: string) => {
        if (id === "blume:data") return { default: { config: { basePath } } };
        if (id === "blume/components/islands/base-path.ts") return { joinBase };
        if (id === "blume/core/base-path.ts") return { withBasePath };
        throw new Error(`Unexpected server import: ${id}`);
      },
    });
    expect(indexUrl).toBe(expectedUrl);
    expect(source).toContain('<div class="contents" data-st-search-index-url={indexUrl}>');
    expect(clientScript).toBeDefined();

    const element = {
      dataset: {},
      loaded: false,
      searchFn: null as SearchFn | null,
      closest: vi.fn((selector: string) =>
        selector === "[data-st-search-index-url]" ? { dataset: { stSearchIndexUrl: indexUrl } } : null,
      ),
      querySelector: () => null,
    };
    const fetchIndex = vi.fn(async () =>
      Response.json([
        {
          title: "Sessions",
          content: "Session authentication guide",
          description: "Session management",
          route: `${basePath}/sessions`,
        },
      ]),
    );

    // Run the entire client script so this exercises the installed searchFn override.
    runInNewContext(compile(clientScript!, deploymentBase), {
      exports: {},
      URL,
      window: { location: { origin: "https://example.com" } },
      document: { querySelectorAll: () => [element], addEventListener: vi.fn() },
      customElements: { whenDefined: async () => undefined },
      fetch: fetchIndex,
      require: (id: string) => {
        if (id === "@orama/orama") return { create, insertMultiple, search };
        if (id === "blume/components/layout/search/types.ts") return { buildResult };
        if (id === "./control-tooltip") return { initializeControlTooltip: vi.fn() };
        throw new Error(`Unexpected client import: ${id}`);
      },
    });
    await vi.waitFor(() => expect(element.loaded).toBe(true));
    expect(element.searchFn).toBeTypeOf("function");
    const result = await element.searchFn!("session");
    expect(fetchIndex).toHaveBeenCalledExactlyOnceWith(expectedUrl);
    expect(result.hits).toHaveLength(1);
    expect(result.hits[0].url).toBe(`${basePath}/sessions`);
    await element.searchFn!("authentication");
    expect(fetchIndex).toHaveBeenCalledTimes(1);
  });
});
