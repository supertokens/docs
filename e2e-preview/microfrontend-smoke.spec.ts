import { expect, test } from "@playwright/test";

test("serves authored docs and docs-owned assets from the shared preview", async ({ page, request }) => {
  const response = await page.goto("/docs");
  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle(/SuperTokens/);

  const assetUrls = await page
    .locator('link[rel="stylesheet"], script[src], img[src]')
    .evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("href") ?? element.getAttribute("src")).filter(Boolean),
    );
  expect(assetUrls.some((url) => url?.startsWith("/docs-assets/"))).toBe(true);
  expect(assetUrls.some((url) => url?.startsWith("/_astro/"))).toBe(false);

  for (const url of assetUrls.filter((url): url is string => Boolean(url?.startsWith("/docs-assets/")))) {
    expect((await request.get(url)).ok(), url).toBe(true);
  }
});

test("serves machine-readable docs endpoints", async ({ request }) => {
  for (const path of [
    "/docs/llms.txt",
    "/docs/llms-full.txt",
    "/docs/agent-readability.json",
    "/docs/.well-known/api-catalog",
    "/docs/sdk-manifest.json",
    "/docs/cdi.json",
    "/docs/cdi.yml",
    "/docs/cdi-mapping.json",
    "/docs/fdi.json",
    "/docs/fdi.yml",
    "/docs/fdi-mapping.json",
  ]) {
    expect((await request.get(path)).ok(), path).toBe(true);
  }

  expect((await request.get("/docs/integrate-with-ai.md")).ok()).toBe(true);
  const invalidAskRequest = await request.post("/docs/api/ask", { data: {} });
  expect(invalidAskRequest.status()).toBe(400);
  expect(await invalidAskRequest.text()).toContain("Invalid request:");
  expect((await request.get("/docs/mcp")).status()).toBe(405);
});

test("initializes MCP through the shared origin", async ({ request }, testInfo) => {
  const baseURL = testInfo.project.use.baseURL;
  if (typeof baseURL !== "string") throw new Error("A string baseURL is required");

  const response = await request.post("/docs/mcp", {
    data: {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-03-26",
        capabilities: {},
        clientInfo: { name: "docs-preview-smoke", version: "1.0.0" },
      },
    },
    headers: {
      Accept: "application/json, text/event-stream",
      Origin: new URL(baseURL).origin,
    },
  });

  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toMatchObject({ jsonrpc: "2.0", id: 1, result: { serverInfo: {} } });
});

test("keeps dashboard-owned MCP discovery separate from the docs child", async ({ request }) => {
  const catalog = await request.get("/docs/.well-known/api-catalog");
  expect(catalog.headers()["content-type"]).toContain("application/linkset+json");

  for (const path of ["/.well-known/mcp.json", "/.well-known/mcp/server-card.json"]) {
    const response = await request.get(path);
    expect(response.ok(), `${path} must be supplied by the dashboard preview`).toBe(true);
    expect((await response.text()).replaceAll("\\/", "/")).toContain("/docs/mcp");
  }
});

for (const path of [
  "/docs/nodejs/latest/modules.html",
  "/docs/python/latest/index.html",
  "/docs/auth-react/latest/modules.html",
  "/docs/web-js/latest/modules.html",
  "/docs/website/latest/modules.html",
  "/docs/react-native/latest/modules.html",
  "/docs/android/latest/index.html",
  "/docs/ios/latest/index.html",
  "/docs/flutter/latest/index.html",
]) {
  test(`proxies ${path} and its relative assets without changing the public URL`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.ok(), path).toBe(true);
    expect(new URL(page.url()).pathname).toBe(path);

    const assetUrls = await page
      .locator('link[rel="stylesheet"], script[src], img[src], iframe[src]')
      .evaluateAll((elements) =>
        elements.map((element) => element.getAttribute("href") ?? element.getAttribute("src")).filter(Boolean),
      );
    const pageUrl = new URL(page.url());
    const sameOriginAssets = new Set(
      assetUrls
        .map((assetUrl) => new URL(assetUrl as string, pageUrl))
        .filter((url) => url.origin === pageUrl.origin)
        .map((url) => url.href),
    );
    await Promise.all(
      [...sameOriginAssets].map(async (url) => {
        expect((await page.request.get(url)).ok(), url).toBe(true);
      }),
    );
  });
}

test("exposes configured, legacy, and external redirects directly", async ({ request }) => {
  const cases = [
    ["/docs/quickstart/frontend-setup", "/docs/quickstart#1-integrate-the-frontend-sdk"],
    ["/docs/guides", "/docs"],
    ["/docs/golang", "https://pkg.go.dev/github.com/supertokens/supertokens-golang"],
  ] as const;

  for (const [source, location] of cases) {
    const response = await request.get(source, { maxRedirects: 0 });
    expect(response.status(), source).toBeGreaterThanOrEqual(300);
    expect(response.status(), source).toBeLessThan(400);
    expect(response.headers().location, source).toBe(location);
  }
});

test("returns a real unknown-route failure", async ({ request }) => {
  expect((await request.get("/docs/__microfrontend-smoke-missing__")).status()).toBe(404);
});

test("preview responses are not indexable", async ({ request }) => {
  const response = await request.get("/docs");
  expect(response.headers()["x-robots-tag"]).toContain("noindex");
});

test("applies authored security headers without replacing SDK origin headers", async ({ request }) => {
  const authored = await request.get("/docs/authentication/email-password/introduction");
  expect(authored.headers()["content-security-policy"]).toContain("object-src 'none'");

  const embed = await request.get("/docs/api-reference-embed/cdi/importoneuserwithbulkimport");
  expect(embed.headers()["content-security-policy"]).toContain("frame-ancestors 'self'");

  const sdk = await request.get("/docs/nodejs/latest/modules.html");
  expect(
    sdk.headers()["content-security-policy"],
    "SDK headers must come from sdk-references.supertokens.com",
  ).not.toBe(authored.headers()["content-security-policy"]);

  const android = await request.get("/docs/android/latest/index.html");
  expect(android.headers()["x-frame-options"]).toBe("SAMEORIGIN");
  expect(android.headers()["content-security-policy"]).toContain("frame-ancestors 'self'");
});
