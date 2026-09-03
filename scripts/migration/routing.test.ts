import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const vercel = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));
const routeManifest = JSON.parse(readFileSync(resolve(root, "scripts/blume/route-manifest.json"), "utf8"));
const microfrontends = JSON.parse(
  readFileSync(resolve(root, "microfrontends.jsonc"), "utf8").replace(/,\s*([}\]])/g, "$1"),
);

const sdkEntrypoints = {
  nodejs: "modules.html",
  python: "index.html",
  "auth-react": "modules.html",
  "web-js": "modules.html",
  website: "modules.html",
  "react-native": "modules.html",
  android: "index.html",
  ios: "index.html",
  flutter: "index.html",
};

describe("microfrontend routing", () => {
  it("matches the documented dashboard-owned semantic contract", () => {
    const docs = microfrontends.applications.docs;
    expect(microfrontends.options).toEqual({ disableOverrides: true });
    expect(docs.packageName).toBe("@supertokens/docs");
    expect(docs.assetPrefix).toBe("docs-assets");
    expect(docs.routing).toEqual([
      { group: "docs", flag: "docs-microfrontend", paths: ["/docs/:path*"] },
      { group: "docs-assets", paths: ["/docs-assets/:path*"] },
    ]);
  });

  it("serves docs assets directly without deployment-only bridge rewrites", () => {
    expect(vercel.rewrites.filter(({ source }) => source.startsWith("/docs-assets/"))).toEqual([]);
  });

  it("proxies every SDK namespace and redirects roots through latest", () => {
    for (const [sdk, entrypoint] of Object.entries(sdkEntrypoints)) {
      expect(vercel.redirects).toContainEqual({
        source: `/docs/${sdk}`,
        destination: `/docs/${sdk}/latest/${entrypoint}`,
        permanent: true,
      });
      expect(vercel.rewrites).toContainEqual({
        source: `/docs/${sdk}/:path*`,
        destination: `https://sdk.supertokens.com/${sdk}/:path*`,
      });
    }
  });

  it("serves the advertised API catalog while leaving MCP well-known ownership to the dashboard", () => {
    expect(vercel.rewrites).toEqual(
      expect.arrayContaining([
        { source: "/docs/api/ask", destination: "/api/ask" },
        { source: "/docs/llms.txt", destination: "/llms.txt" },
        { source: "/docs/llms-full.txt", destination: "/llms-full.txt" },
        { source: "/docs/agent-readability.json", destination: "/agent-readability.json" },
        { source: "/docs/.well-known/api-catalog", destination: "/.well-known/api-catalog" },
        {
          source: "/docs/sdk-manifest.json",
          destination: "https://sdk.supertokens.com/manifest.json",
        },
      ]),
    );
    const wellKnownSources = vercel.rewrites
      .map(({ source }) => source)
      .filter((source) => source.includes(".well-known"));
    expect(wellKnownSources).toEqual(["/docs/.well-known/api-catalog"]);
    expect(JSON.stringify(vercel)).not.toContain("/.well-known/mcp");
  });

  it("routes CDI and FDI aliases to the authored references", () => {
    expect(vercel.redirects).toEqual(
      expect.arrayContaining([
        { source: "/docs/cdi", destination: "/docs/references/cdi", permanent: true },
        { source: "/docs/fdi", destination: "/docs/references/fdi", permanent: true },
      ]),
    );
  });

  it("covers every authored route with security headers without matching SDK proxy routes", () => {
    const cspRules = vercel.headers.filter(({ headers }) =>
      headers.some(({ key }) => key === "Content-Security-Policy"),
    );
    expect(cspRules.map(({ source }) => source)).toEqual([
      "/docs",
      "/docs/:section(additional-verification|authentication|deployment|integrate-with-ai|integrations|legacy|migration|platform-configuration|post-authentication|quickstart|references)/:path*",
      "/docs/api-reference-embed/:path*",
    ]);
    const authoredSections = [
      ...new Set(routeManifest.pages.map(({ route }) => route.split("/")[1]).filter(Boolean)),
    ].sort();
    const authoredRule = cspRules[1].source;
    for (const section of authoredSections) expect(authoredRule).toContain(section);
    for (const sdk of Object.keys(sdkEntrypoints)) expect(authoredRule).not.toContain(sdk);
    expect(
      cspRules.every(({ headers }) =>
        headers.find(({ key }) => key === "Content-Security-Policy").value.includes("object-src 'none'"),
      ),
    ).toBe(true);
    expect(vercel.headers.some(({ source }) => source === "/docs/:path*")).toBe(false);

    for (const extension of ["js", "css", "woff2"]) {
      expect(vercel.headers).toContainEqual({
        source: `/docs-assets/:path*.${extension}`,
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      });
    }
  });
});
