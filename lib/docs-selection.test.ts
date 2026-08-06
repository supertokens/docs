import { describe, expect, it } from "vitest";

import { resolveSelection } from "./docs-selection";

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
});
