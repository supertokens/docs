import { existsSync } from "node:fs";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

import { generateRuntime } from "../../node_modules/blume/src/astro/generate.ts";
import { joinBase } from "../../node_modules/blume/src/components/islands/base-path.ts";
import { scanProject } from "../../node_modules/blume/src/core/project-graph.ts";

interface SearchOptions {
  indexUrl: string;
  locale?: string;
}

// Execute the emitted client with an identity provider, without fetching an index.
function clientOptions(client: string, deploymentBase: string): SearchOptions {
  const executable = client
    .replace(/^import .+;\n/gm, "")
    .replaceAll("import.meta.env.BASE_URL", JSON.stringify(deploymentBase))
    .replace("export const createSearch", "const createSearch");
  return new Function("joinBase", "create", `${executable}\nreturn createSearch();`)(
    joinBase,
    (options: SearchOptions) => options,
  );
}

describe("patched Blume static search routing", () => {
  let root: string;

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), "blume-search-routing-"));
    await mkdir(join(root, "docs"));
    await writeFile(join(root, "docs/index.md"), "---\ntitle: Search fixture\n---\nSearchable documentation.\n");
  });

  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it.each([
    ["orama", "", "/blume-search.json"],
    ["orama", "/docs", "/docs/blume-search.json"],
    ["orama", "/docs/reference/", "/docs/reference/blume-search.json"],
    ["flexsearch", "/docs", "/docs/blume-search.json"],
  ])("pairs %s's client and endpoint with basePath %j", async (provider, basePath, expectedRoute) => {
    await writeFile(
      join(root, "blume.config.mjs"),
      `export default ${JSON.stringify({
        basePath,
        publicAssetBasePath: "/docs-assets",
        search: { provider },
        i18n: { defaultLocale: "en", locales: [{ code: "en", label: "English" }] },
        ai: { ask: { enabled: true } },
      })};`,
    );
    const project = await scanProject(root);
    expect(project.diagnostics.filter(({ severity }) => severity === "error")).toEqual([]);
    await generateRuntime(project);

    const srcDir = join(project.context.outDir, "src");
    const client = await readFile(join(srcDir, "generated/search-client.ts"), "utf8");
    expect(clientOptions(client, "/")).toEqual({
      indexUrl: expectedRoute,
      ...(provider === "orama" ? { locale: "en" } : {}),
    });
    for (const deploymentBase of ["/host", "/host/"]) {
      expect(clientOptions(client, deploymentBase).indexUrl).toBe(`/host${expectedRoute}`);
    }

    const endpointFile = join(srcDir, "pages", `${expectedRoute.slice(1)}.ts`);
    const endpoint = await readFile(endpointFile, "utf8");
    const dataImport = endpoint.match(/import documents from "([^"]+)";/)?.[1];
    expect(dataImport).toBeDefined();
    const dataFile = resolve(dirname(endpointFile), dataImport!);
    expect(dataFile).toBe(join(srcDir, "generated/search.json"));
    expect(JSON.parse(await readFile(dataFile, "utf8"))).not.toHaveLength(0);
    expect(endpoint).toContain("export const prerender = true;");

    const askRoute = `${project.config.basePath}/api/ask`;
    const data = JSON.parse(await readFile(join(srcDir, "generated/data.json"), "utf8"));
    expect(data.config.ask.endpoint).toBe(askRoute);
    expect(existsSync(join(srcDir, "pages", `${askRoute.slice(1)}.ts`))).toBe(true);

    // Moving the mount point must prune the old endpoint, not leave two routes.
    project.config.basePath = "/moved";
    await generateRuntime(project);
    expect(existsSync(endpointFile)).toBe(false);
    expect(existsSync(join(srcDir, "pages/moved/blume-search.json.ts"))).toBe(true);
    const movedClient = await readFile(join(srcDir, "generated/search-client.ts"), "utf8");
    expect(clientOptions(movedClient, "/").indexUrl).toBe("/moved/blume-search.json");
  });
});
