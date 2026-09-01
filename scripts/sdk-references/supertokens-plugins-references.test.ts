import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  analyzePublicApi,
  pluginReleases,
  releaseSourceUrl,
  renderPluginReference,
} from "./supertokens-plugins-references";

const temporaryDirectories: string[] = [];

async function createFixture(): Promise<{ directory: string; root: string }> {
  const directory = await mkdtemp(join(tmpdir(), "plugin-reference-test-"));
  temporaryDirectories.push(directory);
  await mkdir(join(directory, "dist"), { recursive: true });
  return { directory, root: join(directory, "dist/index.d.ts") };
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe("plugin reference generation", () => {
  it("contains released packages only", () => {
    const names = pluginReleases.map((release) => release.packageName);

    expect(names).not.toContain("@supertokens-plugins/profile-details-shared");
    expect(names).not.toContain("@supertokens-plugins/progressive-profiling-shared");
  });

  it("pins source links to immutable package tags or published commits", () => {
    for (const release of pluginReleases) {
      const sourceUrl = releaseSourceUrl(release);
      const revision = release.sourceRevision ?? encodeURIComponent(`${release.packageName}@${release.version}`);
      expect(sourceUrl).toContain(`/blob/${revision}/`);
      expect(sourceUrl).not.toContain("/main/");
      expect(sourceUrl).not.toContain("/master/");
    }
  });

  it("preserves root export forms and excludes non-root declarations", async () => {
    const { directory, root } = await createFixture();
    await mkdir(join(directory, "node_modules/external-public"), { recursive: true });
    await writeFile(
      root,
      [
        'export * from "./star";',
        'export * from "external-public";',
        'export { localName as renamed } from "./renamed";',
        'export type { TypeOnly } from "./types";',
        'export { default } from "./default";',
        'import type { Missing } from "@shared/missing";',
        "export type { Missing };",
      ].join("\n"),
    );
    await writeFile(join(directory, "dist/star.d.ts"), "export declare function fromStar(): void;\n");
    await writeFile(join(directory, "dist/renamed.d.ts"), "export declare const localName: string;\n");
    await writeFile(
      join(directory, "dist/types.d.ts"),
      "export interface TypeOnly { enabled: boolean; }\nexport interface InternalType { secret: string; }\n",
    );
    await writeFile(join(directory, "dist/default.d.ts"), "declare const value: number;\nexport default value;\n");
    await writeFile(
      join(directory, "node_modules/external-public/package.json"),
      JSON.stringify({ name: "external-public", version: "1.0.0", types: "index.d.ts" }),
    );
    await writeFile(
      join(directory, "node_modules/external-public/index.d.ts"),
      "export interface ExternalType { value: string; }\n",
    );

    const analysis = analyzePublicApi(root, directory);
    const exports = new Map(analysis.exports.map((item) => [item.name, item]));

    expect([...exports.keys()]).toEqual(["default", "ExternalType", "fromStar", "Missing", "renamed", "TypeOnly"]);
    expect(exports.get("fromStar")?.rootSyntax).toBe('export * from "./star";');
    expect(exports.get("ExternalType")?.rootSyntax).toBe('export * from "external-public";');
    expect(exports.get("renamed")?.rootSyntax).toBe('export { localName as renamed } from "./renamed";');
    expect(exports.get("TypeOnly")?.rootSyntax).toBe('export type { TypeOnly } from "./types";');
    expect(exports.get("default")?.rootSyntax).toBe('export { default } from "./default";');
    expect(exports.get("Missing")?.rootSyntax).toContain('import type { Missing } from "@shared/missing";');
    expect(analysis.exports.map((item) => item.name)).not.toContain("InternalType");
    expect(analysis.privateImports).toEqual(["@shared/missing"]);
  });

  it("emits transitive signature types and omits private class members", async () => {
    const { directory, root } = await createFixture();
    await writeFile(root, 'export { init, PublicService } from "./plugin";\n');
    await writeFile(
      join(directory, "dist/plugin.d.ts"),
      [
        'import type { ExternalInput } from "external-types";',
        "export type ShouldValidate = (input: ExternalInput) => boolean;",
        "export interface Config { shouldValidate: ShouldValidate; }",
        "export declare const init: (config: Config) => void;",
        "export declare class PublicService {",
        "  private secret;",
        "  visible(value: ShouldValidate): void;",
        "}",
        "export declare const deepInternal: unique symbol;",
      ].join("\n"),
    );

    const analysis = analyzePublicApi(root, directory);
    const supporting = analysis.signatureTypes.map((item) => item.name);
    const page = renderPluginReference(pluginReleases[1], "dist/index.d.ts", analysis);

    expect(analysis.exports.map((item) => item.name)).toEqual(["init", "PublicService"]);
    expect(supporting).toEqual(expect.arrayContaining(["Config", "ShouldValidate"]));
    expect(page).toContain('import type { ExternalInput } from "external-types";');
    expect(page).toContain("type ShouldValidate = (input: ExternalInput) => boolean;");
    expect(page).toContain("visible(value: ShouldValidate): void;");
    expect(page).not.toContain("private secret");
    expect(page).not.toContain("deepInternal");
  });

  it("distinguishes package and protocol versions", async () => {
    const { directory, root } = await createFixture();
    await writeFile(root, 'export declare const PLUGIN_VERSION = "0.0.1";\n');
    const analysis = analyzePublicApi(root, directory);
    const page = renderPluginReference(pluginReleases[0], "dist/index.d.ts", analysis);

    expect(page).toContain("**Package version:** `0.1.2`");
    expect(page).toContain("**Plugin protocol version (`PLUGIN_VERSION`):** `0.0.1`");
  });
});
