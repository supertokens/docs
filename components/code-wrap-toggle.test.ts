import { describe, expect, it } from "vitest";

import { codeWrapButtonLabel, codeWrapIcons, codeWrapPresentation } from "./code-wrap-toggle";

describe("code wrap toggle presentation", () => {
  it("uses a stable accessible name", () => {
    expect(codeWrapButtonLabel).toBe("Wrap code lines");
  });

  it("describes wrapped code", () => {
    expect(codeWrapPresentation(true)).toEqual({
      icon: "unwrap",
      pressed: "true",
      title: "Unwrap code lines",
      unwrapped: false,
    });
  });

  it("describes unwrapped code", () => {
    expect(codeWrapPresentation(false)).toEqual({
      icon: "wrap",
      pressed: "false",
      title: "Wrap code lines",
      unwrapped: true,
    });
  });

  it("uses distinct decorative icons for each action", () => {
    expect(codeWrapIcons.wrap).not.toBe(codeWrapIcons.unwrap);
    expect(codeWrapIcons.wrap).toContain('aria-hidden="true"');
    expect(codeWrapIcons.unwrap).toContain('aria-hidden="true"');
  });
});
