import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const theme = readFileSync(resolve(import.meta.dirname, "../../theme.css"), "utf8");

function neutralOklchLightness(source: string, selector: string) {
  const block = source.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]+)\\}`))?.[1];
  const value = block?.match(/--st-control-border:\s*oklch\(([\d.]+)\s+0\s+0\)/)?.[1];
  if (!value) throw new Error(`Missing neutral --st-control-border in ${selector}`);
  return Number(value);
}

function contrastRatio(firstLightness: number, secondLightness: number) {
  const firstLuminance = firstLightness ** 3;
  const secondLuminance = secondLightness ** 3;
  return (Math.max(firstLuminance, secondLuminance) + 0.05) / (Math.min(firstLuminance, secondLuminance) + 0.05);
}

describe("control border contrast", () => {
  it("meets non-text contrast in light and dark themes", () => {
    const lightBorder = neutralOklchLightness(theme, ":root");
    const darkBorder = neutralOklchLightness(theme, ':root[data-theme="dark"]');

    expect(contrastRatio(lightBorder, 1)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(darkBorder, 0.085)).toBeGreaterThanOrEqual(3);
  });
});
