import { describe, expect, it } from "vitest";

import { validateCodeGroupMaxHeight } from "./code-group";

describe("CodeGroup maxHeight", () => {
  it.each(["0px", "0.5rem", "24rem", "100em", "75vh", "50dvh", "25svh", "10lvh"])("accepts %s", (value) => {
    expect(validateCodeGroupMaxHeight(value)).toBe(value);
  });

  it.each(["", "24", "-1rem", ".5rem", "01rem", "24%", "calc(100vh - 1rem)", "none", "24REM"])(
    "rejects %s",
    (value) => {
      expect(() => validateCodeGroupMaxHeight(value)).toThrowError(/Invalid CodeGroup maxHeight.*non-negative number/u);
    },
  );
});
