import { format } from "prettier";

import { applicableRedirects, parseRedirects, renderGeneratedRedirects } from "./generate-legacy-redirects.mjs";

describe("legacy redirect migration", () => {
  it("parses the exported redirect table without executing it", () => {
    expect(parseRedirects(`export const RouteRedirects = [{ from: "/docs/old", to: "/docs/new#section" }];`)).toEqual([
      {
        from: "/docs/old",
        sourcePosition: { column: 32, line: 1 },
        to: "/docs/new#section",
      },
    ]);
  });

  it("preserves the first duplicate and resolves chains to current routes", () => {
    const result = applicableRedirects(
      [
        { from: "/docs/old", to: "/docs/intermediate#details" },
        { from: "/docs/old", to: "/docs/wrong" },
        { from: "/docs/intermediate", to: "/docs/current" },
        { from: "/docs/stale", to: "/docs/missing" },
      ],
      new Set(["/current"]),
    );

    expect(result.duplicates).toEqual(["/docs/old"]);
    expect(result.redirects).toEqual([
      { from: "/old", to: "/current#details" },
      { from: "/intermediate", to: "/current" },
    ]);
    expect(result.diagnostics.retained).toEqual([
      { from: "/docs/old", sourcePosition: undefined, target: "/current#details" },
      { from: "/docs/intermediate", sourcePosition: undefined, target: "/current" },
    ]);
    expect(result.diagnostics.ignored).toEqual([
      { from: "/docs/old", reason: "duplicate-source", sourcePosition: undefined, target: "/docs/wrong" },
      { from: "/docs/stale", reason: "missing-target", sourcePosition: undefined, target: "/docs/missing" },
    ]);
  });

  it("records authored-source exclusions", () => {
    const result = applicableRedirects(
      [{ from: "/docs/current", sourcePosition: { column: 3, line: 8 }, to: "/docs/current" }],
      new Set(["/current"]),
    );

    expect(result.diagnostics.ignored).toEqual([
      {
        from: "/docs/current",
        reason: "authored-source",
        sourcePosition: { column: 3, line: 8 },
        target: "/docs/current",
      },
    ]);
  });

  it("renders Prettier-idempotent generated TypeScript", async () => {
    const result = applicableRedirects([{ from: "/docs/old", to: "/docs/current" }], new Set(["/current"]));
    const generated = await renderGeneratedRedirects(result);

    expect(await format(generated, { parser: "typescript" })).toBe(generated);
  });
});
