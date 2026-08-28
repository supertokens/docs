import { describe, expect, it } from "vitest";

import { optionsForGroup, resolveSelection, resolveSelectionState } from "./docs-selection";

function wrapper(options: Array<[value: string, title: string]>, active = true): HTMLElement {
  const panels = options.map(([tabId, title]) => ({ dataset: { tabId, title } }));
  return {
    closest: () => (active ? null : { hidden: true }),
    querySelectorAll: () => panels,
  } as unknown as HTMLElement;
}

function rootWith(...wrappers: HTMLElement[]): ParentNode {
  return { querySelectorAll: () => wrappers } as unknown as ParentNode;
}

describe("resolveSelection", () => {
  const availableValues = ["express", "fastify", "koa"];

  it("uses valid choices in migrated, stored, legacy, default, then first order", () => {
    expect(
      resolveSelection({
        availableValues,
        migratedValue: "fastify",
        storedValue: "koa",
        defaultValue: "express",
      }),
    ).toBe("fastify");
    expect(
      resolveSelection({ availableValues, storedValue: "koa", defaultValue: "fastify", legacyValue: "express" }),
    ).toBe("koa");
    expect(
      resolveSelection({ availableValues, storedValue: "invalid", defaultValue: "fastify", legacyValue: "express" }),
    ).toBe("express");
    expect(
      resolveSelection({ availableValues, storedValue: "invalid", defaultValue: "invalid", legacyValue: "express" }),
    ).toBe("express");
    expect(resolveSelection({ availableValues, storedValue: "invalid", defaultValue: "invalid" })).toBe("express");
  });

  it("returns undefined when there are no choices", () => {
    expect(resolveSelection({ availableValues: [] })).toBeUndefined();
  });

  it("persists a valid migrated value over an existing stored value", () => {
    expect(
      resolveSelectionState({
        availableValues,
        migratedValue: "fastify",
        storedValue: "koa",
      }),
    ).toEqual({ shouldPersist: true, unavailableStoredValue: false, value: "fastify" });
  });

  it("uses legacy selection without overwriting an unavailable stored value", () => {
    expect(
      resolveSelectionState({
        availableValues,
        legacyValue: "koa",
        storedValue: "invalid",
      }),
    ).toEqual({ shouldPersist: false, unavailableStoredValue: true, value: "koa" });
  });

  it("marks unavailable stored values so passive followers can remain hidden", () => {
    expect(
      resolveSelectionState({
        availableValues: ["express"],
        defaultValue: "express",
        storedValue: "koa",
      }),
    ).toEqual({ shouldPersist: false, unavailableStoredValue: true, value: "express" });
  });
});

describe("optionsForGroup", () => {
  it("returns a stable first-seen union from active wrappers", () => {
    const root = rootWith(
      wrapper([
        ["reactjs", "Reactjs"],
        ["angular", "Angular"],
      ]),
      wrapper([
        ["vue", "Vue"],
        ["reactjs", "Different React label"],
      ]),
      wrapper([["svelte", "Svelte"]], false),
      wrapper([
        ["angular", "Angular"],
        ["solid", "Solid"],
      ]),
    );

    expect(optionsForGroup("frontend-prebuilt-ui", root)).toEqual([
      { value: "reactjs", label: "React" },
      { value: "angular", label: "Angular" },
      { value: "vue", label: "Vue" },
      { value: "solid", label: "Solid" },
    ]);
  });
});
