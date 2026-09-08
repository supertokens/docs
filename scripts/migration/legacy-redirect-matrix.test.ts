import routeManifest from "../blume/route-manifest.json";
import { configuredRedirects } from "../blume/configured-redirects.mjs";
import vercel from "../../vercel.json";
import {
  configuredAliasLegacySources,
  ignoredDuplicateLegacySources,
  legacyRedirectDiagnostics,
  legacyRedirects,
} from "./legacy-redirects";

const redirects = new Map(legacyRedirects.map(({ from, to }) => [from, to]));

describe("generated legacy redirect matrix", () => {
  it("locks generated artifact counts", () => {
    expect(routeManifest.counts).toEqual({ pages: 429, openapiOperations: 205 });
    expect(legacyRedirects).toHaveLength(1566);
    expect(legacyRedirectDiagnostics.retained).toHaveLength(1566);
    expect(legacyRedirectDiagnostics.ignored).toHaveLength(7);
    expect(ignoredDuplicateLegacySources).toHaveLength(5);
    expect(configuredAliasLegacySources).toHaveLength(0);
  });

  it("keeps only intentionally unresolved legacy destinations", () => {
    expect(legacyRedirectDiagnostics.ignored.filter(({ reason }) => reason === "missing-target")).toEqual([
      expect.objectContaining({
        from: "/docs/unified-login/customizations/custom-ui",
        target: "/docs/authentication/unified-login/customizations/custom-ui",
      }),
      expect.objectContaining({
        from: "/docs/unified-login/customizations/multi-tenancy",
        target: "/docs/authentication/unified-login/customizations/multi-tenancy",
      }),
    ]);
  });

  it.each([
    ["/guides", "/"],
    ["/attackprotectionsuite/introduction", "/additional-verification/attack-protection-suite/introduction"],
    ["/emailpassword/advanced-customizations/apis-override/about", "/references"],
    ["/passwordless/advanced-customizations/apis-override/about", "/references"],
    [
      "/thirdparty/add-multiple-clients-for-the-same-provider",
      "/authentication/social/add-multiple-clients-for-the-same-provider",
    ],
    [
      "/thirdpartyemailpassword/add-multiple-clients-for-the-same-provider",
      "/authentication/social/add-multiple-clients-for-the-same-provider",
    ],
    ["/session/advanced-customizations/apis-override/about", "/references"],
    ["/mfa/backend-setup", "/additional-verification/mfa/initial-setup"],
    ["/quickstart/integrations/vercel/about", "/integrations/vercel"],
    ["/emailpassword/quickstart/frontend-setup", "/quickstart#1-integrate-the-frontend-sdk"],
  ])("maps %s to its canonical destination", (from, to) => {
    expect(redirects.get(from)).toBe(to);
  });

  it("only contains authored or external final destinations", () => {
    const authoredRoutes = new Set(routeManifest.pages.map(({ route }) => route));

    for (const { from, to } of legacyRedirects) {
      const path = to.split(/[?#]/u, 1)[0].replace(/\/$/u, "") || "/";
      expect(/^https?:\/\//u.test(to) || authoredRoutes.has(path), `${from} -> ${to}`).toBe(true);
    }
  });

  it("keeps configured and legacy sources unique and targets valid", () => {
    const authoredRoutes = new Set(routeManifest.pages.map(({ route }) => route));
    const allRedirects = [...configuredRedirects, ...legacyRedirects];
    const sources = allRedirects.map(({ from }) => from.split(/[?#]/u, 1)[0].replace(/\/$/u, "") || "/");

    expect(new Set(sources).size).toBe(sources.length);
    for (const { from, to } of allRedirects) {
      const target = new URL(to, "https://docs.supertokens.invalid");
      expect(
        target.origin !== "https://docs.supertokens.invalid" || authoredRoutes.has(target.pathname),
        `${from} -> ${to}`,
      ).toBe(true);
    }
  });

  it("stays below the Vercel route budget with reserved headroom", () => {
    const routeCount =
      configuredRedirects.length +
      legacyRedirects.length +
      vercel.redirects.length +
      vercel.rewrites.length +
      vercel.headers.length;
    expect(routeCount).toBe(1877);
    expect(routeCount).toBeLessThanOrEqual(1900);
    expect(2048 - routeCount).toBeGreaterThanOrEqual(148);
  });

  it("uses unique API-qualified synthetic OpenAPI file identities", () => {
    const synthetic = routeManifest.pages.filter(({ file }) => file.startsWith("openapi/"));
    expect(new Set(synthetic.map(({ file }) => file)).size).toBe(synthetic.length);
    expect(synthetic.every(({ file }) => /^openapi\/(?:cdi|fdi)\//u.test(file))).toBe(true);
    expect(new Set(routeManifest.openapi.map(({ from }) => from)).size).toBe(routeManifest.openapi.length);
    expect(new Set(routeManifest.openapi.map(({ to }) => to)).size).toBe(routeManifest.openapi.length);
  });
});
