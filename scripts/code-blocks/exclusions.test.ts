import { describe, expect, it } from "vitest";

import {
  isExcludedFromChecking,
  isExcludedFromTypeChecking,
  parseExclusionMarkers,
  parseFenceMetadata,
} from "./exclusions";

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

  it("parses attributes without treating quoted title text as metadata", () => {
    expect(parseFenceMetadata('title="example check=false.ts" check=false reason="Needs setup" {1}')).toEqual({
      attributes: [
        { name: "title", value: "example check=false.ts", quote: '"', closed: true },
        { name: "check", value: "false", quote: undefined, closed: true },
        { name: "reason", value: "Needs setup", quote: '"', closed: true },
      ],
      errors: [],
    });
  });

  it("only parses boundary-delimited attributes and reports malformed metadata", () => {
    expect(parseFenceMetadata('{check=false} title="unterminated')).toEqual({
      attributes: [{ name: "title", value: "unterminated", quote: '"', closed: false }],
      errors: ["unclosed quoted value for code fence metadata attribute 'title'"],
    });
    expect(parseFenceMetadata('title="example"check=false @bad')).toMatchObject({
      attributes: [{ name: "title", value: "example", quote: '"', closed: true }],
      errors: [
        "code fence metadata entries must be separated by whitespace",
        "unexpected code fence metadata punctuation '@'",
      ],
    });
  });

  it("excludes only valid metadata and legacy comment opt-outs", () => {
    expect(isExcludedFromChecking({ meta: 'check=false reason="Needs setup"', value: "const value=1" })).toBe(true);
    expect(isExcludedFromChecking({ meta: 'title="check=false"', value: "const value=1" })).toBe(false);
    expect(isExcludedFromChecking({ meta: undefined, value: "// exclude-from-type-checking\nconst value=1" })).toBe(
      true,
    );

    for (const meta of [
      'check=false check=false reason="Duplicate"',
      'check=true check=false reason="Contradictory"',
      'check=false reason="One" reason="Two"',
      'check=false reason="Contains {braces}"',
      'check=false reason="Contains \\ slash"',
      'check=false reason="Contains \\"quote\\""',
      'check=false reason="Line\nbreak"',
      'check=false reason="unterminated',
      'title="unterminated check=false reason="Hidden"',
      'check=false reason="Valid" @unexpected',
    ]) {
      expect(isExcludedFromChecking({ meta, value: "const value=1" }), meta).toBe(false);
    }
  });
});
