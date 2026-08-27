import { describe, expect, it } from "vitest";

import { isExcludedFromTypeChecking, parseExclusionMarkers } from "./exclusions";

describe("type-check exclusion markers", () => {
  it("only excludes an exact marker on the first line", () => {
    expect(isExcludedFromTypeChecking("// exclude-from-type-checking\nconst value=1")).toBe(true);
    expect(isExcludedFromTypeChecking("# exclude-from-type-checking\nvalue=1")).toBe(true);
    expect(isExcludedFromTypeChecking(" // exclude-from-type-checking\nconst value=1")).toBe(false);
    expect(isExcludedFromTypeChecking("// exclude-from-type-checking trailing\nconst value=1")).toBe(false);
  });

  it("finds every occurrence except a valid first-line marker", () => {
    expect(
      parseExclusionMarkers(
        "// exclude-from-type-checking\nconst marker = 'exclude-from-type-checking';\n# exclude-from-type-checking",
      ),
    ).toEqual({ isExcluded: true, misplacedLineIndexes: [1, 2] });
  });
});
