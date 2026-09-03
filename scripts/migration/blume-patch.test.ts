import { publicAssetHref } from "../../node_modules/blume/src/astro/generate.ts";

describe("patched Blume public asset URLs", () => {
  it("keeps conventional public icons root-relative when no asset prefix is configured", () => {
    expect(publicAssetHref(undefined, "favicon.ico")).toBe("/favicon.ico");
    expect(publicAssetHref(undefined, "apple-touch-icon.png")).not.toContain("undefined");
  });

  it("uses the configured microfrontend asset prefix", () => {
    expect(publicAssetHref("/docs-assets", "favicon.ico")).toBe("/docs-assets/favicon.ico");
  });
});
