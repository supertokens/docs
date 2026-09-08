import { describe, expect, it } from "vitest";

import { firstVisibleOwner, isVisibilityChainVisible } from "./dependent-content-state";

describe("dependent content visibility", () => {
  it("requires every relevant ancestor to be visible", () => {
    expect(
      isVisibilityChainVisible([
        { hidden: false, hiddenClass: false },
        { hidden: false, hiddenClass: false },
      ]),
    ).toBe(true);
    expect(
      isVisibilityChainVisible([
        { hidden: false, hiddenClass: false },
        { hidden: true, hiddenClass: false },
      ]),
    ).toBe(false);
    expect(isVisibilityChainVisible([{ hidden: false, hiddenClass: true }])).toBe(false);
  });
});

describe("dependent content ownership", () => {
  it("selects the first visible candidate in DOM order", () => {
    expect(
      firstVisibleOwner([
        { owner: "first", visible: false },
        { owner: "second", visible: true },
        { owner: "third", visible: true },
      ]),
    ).toBe("second");
  });

  it("transfers ownership when the current owner is hidden", () => {
    const candidates = [
      { owner: "first", visible: true },
      { owner: "second", visible: true },
    ];
    expect(firstVisibleOwner(candidates)).toBe("first");

    candidates[0].visible = false;
    expect(firstVisibleOwner(candidates)).toBe("second");
  });
});
