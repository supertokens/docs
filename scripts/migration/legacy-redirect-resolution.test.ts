import { applicableRedirects } from "./generate-legacy-redirects.mjs";

describe("legacy redirect target resolution", () => {
  it("resolves backend and configured alias chains to authored routes", () => {
    const result = applicableRedirects(
      [
        { from: "/docs/old", to: "/docs/backend-hop#details" },
        { from: "/docs/backend-hop", to: "/configured-hop" },
      ],
      new Set(["/current"]),
      [{ from: "/configured-hop", to: "/current" }],
    );

    expect(result.redirects).toEqual([
      { from: "/old", to: "/current#details" },
      { from: "/backend-hop", to: "/current" },
    ]);
  });

  it.each([
    ["/hop?incoming=1#incoming", "/current?target=1#target", "/current?incoming=1#incoming"],
    ["/hop?incoming=1", "/current?target=1#target", "/current?incoming=1#target"],
    ["/hop#incoming", "/current?target=1#target", "/current?target=1#incoming"],
    ["/hop", "/current?target=1#target", "/current?target=1#target"],
  ])("merges an incoming chain suffix from %s into %s", (incoming, target, expected) => {
    const result = applicableRedirects([{ from: "/docs/old", to: incoming }], new Set(["/current"]), [
      { from: "/hop", to: target },
    ]);

    expect(result.redirects).toEqual([{ from: "/old", to: expected }]);
    expect(result.redirects[0].to).not.toMatch(/#[^?]*\?/u);
  });

  it("retains external terminals", () => {
    const result = applicableRedirects([{ from: "/docs/old", to: "/external-hop" }], new Set(), [
      { from: "/external-hop", to: "https://supertokens.com/auth" },
    ]);

    expect(result.redirects).toEqual([{ from: "/old", to: "https://supertokens.com/auth" }]);
  });

  it("detects loops and excludes every affected redirect", () => {
    const result = applicableRedirects(
      [
        { from: "/docs/old", to: "/alias-a" },
        { from: "/docs/backend-loop", to: "/alias-a" },
      ],
      new Set(),
      [
        { from: "/alias-a", to: "/alias-b" },
        { from: "/alias-b", to: "/alias-a" },
      ],
    );

    expect(result.redirects).toEqual([]);
    expect(result.diagnostics.ignored).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ from: "/docs/old", reason: "redirect-cycle" }),
        expect.objectContaining({ from: "/docs/backend-loop", reason: "redirect-cycle" }),
      ]),
    );
  });

  it("gives configured aliases precedence over legacy sources", () => {
    const result = applicableRedirects(
      [
        { from: "/docs/owned", to: "/docs/legacy-target" },
        { from: "/docs/chain", to: "/docs/owned" },
      ],
      new Set(["/configured-target"]),
      [{ from: "/owned", to: "/configured-target" }],
    );

    expect(result.redirects).toEqual([{ from: "/chain", to: "/configured-target" }]);
    expect(result.crossSetDuplicates).toEqual(["/docs/owned"]);
    expect(result.diagnostics.ignored).toContainEqual({
      from: "/docs/owned",
      reason: "configured-alias-source",
      sourcePosition: undefined,
      target: "/docs/legacy-target",
    });
  });
});
