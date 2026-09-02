import { readFile } from "node:fs/promises";

import { parse } from "@astrojs/compiler";
import { describe, expect, it } from "vitest";

const componentUrl = new URL("./PaidFeatureCallout.astro", import.meta.url);
const themeUrl = new URL("../theme.css", import.meta.url);

describe("PaidFeatureCallout", () => {
  it("is valid Astro and exposes the paid feature notice and dialog controls", async () => {
    const source = await readFile(componentUrl, "utf8");
    const { diagnostics } = await parse(source, { position: true });

    expect(diagnostics).toEqual([]);
    expect(source).toContain("<p>This feature is only available to paid users.</p>");
    expect(source).toContain("View Details");
    expect(source).toContain('aria-haspopup="dialog"');
    expect(source).toContain('aria-label="Enable paid features"');
    expect(source).toContain("data-paid-feature-close");
    expect(source.indexOf("st-paid-feature-card-icon")).toBeLessThan(
      source.indexOf("This feature is only available to paid users."),
    );
    expect(source.indexOf("st-paid-feature-card-icon")).toBeLessThan(source.indexOf("data-paid-feature-trigger"));
    expect(source).toContain("dialog.showModal()");
    expect(source).toContain("if (trigger.isConnected) trigger.focus()");
  });

  it("documents both deployment types and existing-key development behavior", async () => {
    const source = await readFile(componentUrl, "utf8");

    expect(source).toContain("Managed Service");
    expect(source).toContain("Self Hosted");
    expect(source).toContain("test paid features for free in development environments");
    expect(source).toMatch(/Update this key instead of creating a\s+new one/u);
    expect(source).toContain('withBase("/deployment/self-host-supertokens#5-add-license-keys")');
    expect(source).not.toContain('withBase("/docs/');
    expect(source).toContain("available only with the SuperTokens Managed Service");
    expect(source).toMatch(/!managedOnly\s+&&\s+\([\s\S]*Self Hosted/u);
  });

  it("places the drawer on the right and makes it full-width on small screens", async () => {
    const theme = await readFile(themeUrl, "utf8");

    expect(theme).toMatch(/\.st-paid-feature-drawer\s*\{[^}]*inset:\s*0 0 0 auto;/su);
    expect(theme).toMatch(/@media \(max-width: 30rem\)[\s\S]*?\.st-paid-feature-drawer\s*\{[^}]*width:\s*100%;/u);
    expect(theme).toMatch(/\.st-paid-feature-callout\s*\{[^}]*grid-template-columns:\s*auto minmax\(0, 1fr\) auto;/su);
    expect(theme).toMatch(/@media \(max-width: 30rem\)[\s\S]*?\.st-paid-feature-card-icon\s*\{[^}]*grid-column:\s*1;/u);
  });
});
