import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { expect, test as base } from "@playwright/test";
import { load } from "js-yaml";

interface OpenApiOperation {
  operationId?: string;
  requestBody?: {
    content?: Record<
      string,
      {
        example?: unknown;
        examples?: Record<string, { value?: unknown }>;
      }
    >;
  };
  summary?: string;
}

interface OpenApiDocument {
  info?: {
    title?: string;
    version?: string;
  };
  openapi?: string;
  paths: Record<string, Record<string, OpenApiOperation>>;
}

const cdiSpec = load(readFileSync(resolve("openapi/cdi.yml"), "utf8")) as OpenApiDocument;
const fdiSpec = load(readFileSync(resolve("openapi/fdi.yml"), "utf8")) as OpenApiDocument;

const apiRequestCases = [
  {
    canonicalPath: "/docs/references/cdi/bulk-import/importoneuserwithbulkimport",
    embedKey: "importoneuserwithbulkimport",
    hasRequestExample: true,
    method: "POST",
    operationId: "importOneUserWithBulkImport",
    path: "/appid-{appId}/bulk-import/import",
    title: "Import one user directly",
    url: "<CORE_API_ENDPOINT>/appid-public/bulk-import/import",
  },
  {
    canonicalPath: "/docs/references/cdi/bulk-import/addbulkimportusers",
    embedKey: "addbulkimportusers",
    hasRequestExample: true,
    method: "POST",
    operationId: "addBulkImportUsers",
    path: "/appid-{appId}/bulk-import/users",
    title: "Add bulk import users",
    url: "<CORE_API_ENDPOINT>/appid-public/bulk-import/users",
  },
  {
    canonicalPath: "/docs/references/cdi/bulk-import/countbulkimportusers",
    embedKey: "countbulkimportusers",
    hasRequestExample: false,
    method: "GET",
    operationId: "countBulkImportUsers",
    path: "/appid-{appId}/bulk-import/users/count",
    title: "Count bulk import users",
    url: "<CORE_API_ENDPOINT>/appid-public/bulk-import/users/count?status=PROCESSING",
  },
  {
    canonicalPath: "/docs/references/cdi/bulk-import/getbulkimportusers",
    embedKey: "getbulkimportusers",
    hasRequestExample: false,
    method: "GET",
    operationId: "getBulkImportUsers",
    path: "/appid-{appId}/bulk-import/users",
    title: "List bulk import users",
    url: "<CORE_API_ENDPOINT>/appid-public/bulk-import/users?status=FAILED",
  },
  {
    canonicalPath: "/docs/references/cdi/bulk-import/deletebulkimportusers",
    embedKey: "deletebulkimportusers",
    hasRequestExample: false,
    method: "POST",
    operationId: "deleteBulkImportUsers",
    path: "/appid-{appId}/bulk-import/users/remove",
    title: "Delete bulk import users",
    url: "<CORE_API_ENDPOINT>/appid-{appId}/bulk-import/users/remove",
  },
] as const;

const requestExample = (path: string): unknown => {
  const operation = cdiSpec.paths[path]?.post;
  const media = operation?.requestBody?.content?.["application/json"];
  const example = media?.example ?? media?.examples?.default?.value;
  if (example === undefined) throw new Error(`Missing application/json request example for POST ${path}`);
  return example;
};

const curlBody = (code: string): unknown => {
  const body = /(?:^|\n)\s*-d '([\s\S]*)'\s*$/u.exec(code)?.[1];
  if (!body) throw new Error("Expected a JSON body in the cURL snippet");
  return JSON.parse(body);
};

const test = base.extend<{ runtimeErrors: string[] }>({
  runtimeErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(String(error)));
      await use(errors);
      expect(errors).toEqual([]);
    },
    { auto: true },
  ],
});

test("mobile Ask AI behaves as a modal", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs");

  const trigger = page.getByRole("button", { name: "Ask AI" });
  await expect(page.locator("#blume-ask-panel")).toHaveAttribute("role", "dialog");
  await trigger.click();

  const panel = page.getByRole("dialog", { name: "Ask AI" });
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("textbox", { name: "Ask a question" })).toBeFocused();
  await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");
  await expect(page.locator("[data-blume-header]")).toHaveJSProperty("inert", true);

  await page.keyboard.press("Tab");
  expect(await panel.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Shift+Tab");
  expect(await panel.evaluate((element) => element.contains(document.activeElement))).toBe(true);

  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator("[data-blume-header]")).toHaveJSProperty("inert", false);
  await expect.poll(() => page.evaluate(() => document.documentElement.style.overflow)).toBe("");
});

test("mobile header fits and exposes navigation state", async ({ page }) => {
  for (const width of [320, 390, 430]) {
    await page.setViewportSize({ width, height: 700 });
    await page.goto("/docs");

    const header = page.locator("[data-blume-header]");
    const dimensions = await header.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

    const visibleControls = header.locator("a:visible, button:visible");
    for (let index = 0; index < (await visibleControls.count()); index += 1) {
      const box = await visibleControls.nth(index).boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  }

  const header = page.locator("[data-blume-header]");
  const navToggle = header.getByRole("button", { name: "Toggle navigation" });
  await expect(navToggle).toHaveAttribute("aria-expanded", "false");
  await navToggle.click();
  await expect(navToggle).toHaveAttribute("aria-expanded", "true");
  await expect(navToggle).toHaveAttribute("aria-controls", "blume-nav-drawer");
  await expect(page.locator("#blume-nav-drawer")).toBeInViewport();
});

test("desktop header brand and section links are vertically aligned", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/docs");

  const header = page.locator("[data-blume-header]");
  const logo = header.locator("[data-st-logo] > a");
  const documentation = header.getByRole("link", { name: "Documentation", exact: true });
  const references = header.getByRole("link", { name: "References", exact: true });
  await expect(logo).toBeVisible();
  await expect(logo.locator("svg")).toBeVisible();
  await expect(logo.locator("svg")).toHaveCSS("color", "rgb(237, 238, 240)");
  await expect(logo.locator("img")).toHaveCount(0);
  await expect(documentation).toBeVisible();
  await expect(references).toBeVisible();

  const centers = await Promise.all(
    [logo, documentation, references].map((element) =>
      element.evaluate((node) => {
        const bounds = node.getBoundingClientRect();
        return bounds.top + bounds.height / 2;
      }),
    ),
  );
  expect(Math.max(...centers) - Math.min(...centers)).toBeLessThanOrEqual(1);
});

test("desktop section tabs clearly identify the active section", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/docs");

  const documentation = page.getByRole("link", { name: "Documentation", exact: true });
  const references = page.getByRole("link", { name: "References", exact: true });
  await expect(documentation).toHaveAttribute("aria-current", "page");
  await expect(references).not.toHaveAttribute("aria-current");
  expect(await documentation.evaluate((link) => getComputedStyle(link).backgroundColor)).not.toBe(
    await references.evaluate((link) => getComputedStyle(link).backgroundColor),
  );

  await references.click();
  await expect(page).toHaveURL(/\/docs\/references\/?$/u);
  await expect(references).toHaveAttribute("aria-current", "page");
  await expect(documentation).not.toHaveAttribute("aria-current");
});

test("active sidebar item has no accent edge", async ({ page }) => {
  await page.goto("/docs/quickstart");

  const activeLink = page.getByRole("link", { name: "Quickstart Guide", exact: true });
  await expect(activeLink).toBeVisible();
  await expect(activeLink).not.toHaveCSS("box-shadow", /inset/);
});

test("TOC activation does not change item geometry", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/docs/quickstart");

  const toc = page.getByRole("navigation", { name: "On this page" });
  const target = toc.locator('a[href="#1-integrate-the-frontend-sdk"]');
  const before = await target.boundingBox();
  await page.locator('[id="1-integrate-the-frontend-sdk"]').evaluate((heading) => {
    window.scrollTo(0, heading.getBoundingClientRect().top + window.scrollY - 70);
    dispatchEvent(new Event("scroll"));
  });
  await expect(target).toHaveAttribute("aria-current", "location");
  const after = await target.boundingBox();
  expect({ width: after?.width, x: after?.x }).toEqual({ width: before?.width, x: before?.x });
});

test("dark theme softens page contrast and preferences keep readable text", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/docs/quickstart");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(24, 24, 26)");
  await expect(page.locator("body")).toHaveCSS("color", "rgb(237, 238, 240)");

  await page.getByRole("button", { name: /Configure example preferences/ }).click();
  const minimumFontSize = await page.getByRole("dialog", { name: "Your Setup" }).evaluate((dialog) => {
    const visibleText = [...dialog.querySelectorAll<HTMLElement>("*")].filter((element) => {
      const style = getComputedStyle(element);
      return element.textContent?.trim() && style.display !== "none" && style.visibility !== "hidden";
    });
    return Math.min(...visibleText.map((element) => Number.parseFloat(getComputedStyle(element).fontSize)));
  });
  expect(minimumFontSize).toBeGreaterThanOrEqual(12);
});

test("references overview keeps its page title and card icon", async ({ page }) => {
  await page.goto("/docs/references");

  await expect(page.getByRole("heading", { level: 1, name: "References", exact: true })).toBeVisible();
  await expect(
    page.locator("[data-blume-nav-drawer]").getByRole("link", { name: "Overview", exact: true }),
  ).toBeVisible();

  const frontendHooksCard = page.getByRole("link", { name: /Frontend Hooks/ });
  await expect(frontendHooksCard).toBeVisible();
  await expect(frontendHooksCard.locator("svg")).toBeVisible();
});

test("quickstart preferences include options from all selection groups", async ({ page }) => {
  await page.goto("/docs/quickstart");

  const preferences = page.locator("[data-docs-preferences]");
  const summary = preferences.locator(".preferences-summary");
  await expect(summary.locator(".preferences-summary-row").filter({ hasText: "Frontend" })).toContainText("React");
  await expect(summary.locator(".preferences-summary-row").filter({ hasText: "Backend" })).toContainText("Node.js");

  await preferences.getByRole("button", { name: /Configure example preferences/ }).click();
  const dialog = page.getByRole("dialog", { name: "Your Setup" });
  const frontend = dialog.getByRole("group", { name: "Frontend" });
  const backend = dialog.getByRole("group", { name: "Backend" });
  expect(
    await frontend.getByRole("radio").evaluateAll((radios) => radios.map((radio) => (radio as HTMLInputElement).value)),
  ).toEqual(["reactjs", "angular", "vue"]);
  expect(
    await backend.getByRole("radio").evaluateAll((radios) => radios.map((radio) => radio.getAttribute("value"))),
  ).toEqual(["nodejs", "go", "python"]);

  await frontend.getByRole("radio", { name: "Angular", exact: true }).check({ force: true });
  await backend.getByRole("radio", { name: "Go", exact: true }).check({ force: true });
  await expect(summary.locator(".preferences-summary-row").filter({ hasText: "Frontend" })).toContainText("Angular");
  await expect(summary.locator(".preferences-summary-row").filter({ hasText: "Backend" })).toContainText("Go");
});

test("preference technology marks are monochrome and theme-aware", async ({ page }) => {
  await page.goto("/docs/quickstart");

  const trigger = page.getByRole("button", { name: /Configure example preferences/ });
  const technologyMark = trigger.locator(".preferences-option-mark:has(.preferences-option-logo)").first();
  await expect(technologyMark).toBeVisible();
  await expect(technologyMark.locator("img")).toHaveCount(0);

  const markPresentation = async () =>
    technologyMark.evaluate((mark) => {
      const styles = getComputedStyle(mark);
      const logo = mark.querySelector<HTMLElement>(".preferences-option-logo")!;
      const logoStyles = getComputedStyle(logo);
      const context = document.createElement("canvas").getContext("2d")!;
      const rgba = (color: string) => {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        return [...context.getImageData(0, 0, 1, 1).data];
      };
      const luminance = (color: string) => {
        const [red, green, blue] = rgba(color).map((channel) => channel / 255);
        const linear = [red, green, blue].map((channel) =>
          channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
        );
        return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
      };
      const markBounds = mark.getBoundingClientRect();
      const logoBounds = logo.getBoundingClientRect();

      return {
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        borderWidth: styles.borderWidth,
        logoLuminance: luminance(logoStyles.backgroundColor),
        logoHeight: logoBounds.height,
        logoMaskImage: logoStyles.maskImage,
        logoWidth: logoBounds.width,
        markHeight: markBounds.height,
        markWidth: markBounds.width,
      };
    });
  const lightPresentation = await markPresentation();
  expect(lightPresentation.markHeight).toBeGreaterThanOrEqual(28);
  expect(lightPresentation.markWidth).toBeGreaterThanOrEqual(28);
  expect(lightPresentation.logoHeight).toBeGreaterThanOrEqual(18);
  expect(lightPresentation.logoWidth).toBeGreaterThanOrEqual(18);
  expect(lightPresentation.logoMaskImage).not.toBe("none");
  expect(lightPresentation).toMatchObject({
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderRadius: "0px",
    borderWidth: "0px",
  });
  expect(lightPresentation.logoLuminance).toBeLessThan(0.1);

  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  const darkPresentation = await markPresentation();
  expect(darkPresentation.markHeight).toBeGreaterThanOrEqual(28);
  expect(darkPresentation.markWidth).toBeGreaterThanOrEqual(28);
  expect(darkPresentation.logoHeight).toBeGreaterThanOrEqual(18);
  expect(darkPresentation.logoWidth).toBeGreaterThanOrEqual(18);
  expect(darkPresentation.logoMaskImage).not.toBe("none");
  expect(darkPresentation).toMatchObject({
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderRadius: "0px",
    borderWidth: "0px",
  });
  expect(darkPresentation.logoLuminance).toBeGreaterThan(0.8);

  await page.goto("/docs/migration/rownd/sdk-integration-guide");
  await trigger.click();
  const preferencesDialog = page.getByRole("dialog", { name: "Your Setup" });
  const webJsRadio = preferencesDialog.getByRole("radio", { name: "Web JS", exact: true });
  const webJsOption = preferencesDialog.locator("label").filter({ hasText: "Web JS" });
  const webJsMark = webJsOption.locator(".preferences-option-mark");
  await expect(webJsRadio).toBeVisible();
  await expect(webJsOption).toHaveCount(1);
  await expect(webJsMark).toHaveCount(0);
});

test("legacy example applications route redirects to quickstart", async ({ page }) => {
  await page.goto("/docs/quickstart/example-applications");

  await expect(page).toHaveURL(/\/docs\/quickstart\/?$/u);
});

test("SDK symbol hashes target symbol headings", async ({ page }) => {
  await page.goto("/docs/references/frontend-sdks/supertokens-auth-react/types#navigate");

  const heading = page.locator("h3#navigate");
  await expect(heading).toHaveText("Navigate");
  await expect(heading).toBeInViewport();
  await expect
    .poll(async () => {
      const headingBox = await heading.boundingBox();
      const headerBox = await page.locator("[data-blume-header]").boundingBox();
      if (!headingBox || !headerBox) return false;
      const headerBottom = headerBox.y + headerBox.height;
      return headingBox.y >= headerBottom;
    })
    .toBe(true);
  await expect(page.locator('[id="navigate"]')).toHaveCount(1);
});

test("search results distinguish documentation sections", async ({ page }) => {
  await page.goto("/docs");
  await page.getByRole("button", { name: "Search" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("Introduction", { exact: true })).toHaveCount(1);
  await expect(dialog.getByText("References", { exact: true })).toBeVisible();
});

test("search discloses additional filters without a nested scrolling strip", async ({ page }) => {
  await page.goto("/docs");
  await page.getByRole("button", { name: "Search" }).click();

  const dialog = page.getByRole("dialog");
  await dialog.getByRole("combobox", { name: "Search docs" }).fill("session");
  const filters = dialog.locator("[data-blume-search-filters]");
  const pills = filters.locator("button:not([data-st-filter-disclosure])");
  const more = filters.getByRole("button", { name: "Show more search filters" });
  await expect(more).toBeVisible();
  expect(await pills.count()).toBeGreaterThan(4);
  await expect(pills.locator(":visible")).toHaveCount(4);
  await expect(more).toHaveText("More");
  await expect(more).toHaveAttribute("aria-expanded", "false");
  await expect(more).toHaveAttribute("aria-controls", await filters.getAttribute("id"));
  await expect(filters).toHaveCSS("overflow-y", "visible");

  await more.click();
  const less = filters.getByRole("button", { name: "Show fewer search filters" });
  await expect(pills.locator(":visible")).toHaveCount(await pills.count());
  await expect(less).toHaveText("Less");
  await expect(less).toHaveAttribute("aria-expanded", "true");
  await expect(less).toBeFocused();
  expect(await filters.evaluate((element) => element.scrollHeight <= element.clientHeight)).toBe(true);
});

test("query selections override storage and persist the shared state", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("supertokens-docs:ui-type", "prebuilt");
    localStorage.setItem("supertokens-docs:selection:frontend-custom-ui", "mobile");
    localStorage.setItem("supertokens-docs:selection:backend-language", "nodejs");
  });
  await page.goto("/docs/quickstart?ui=custom&frontend=web&backend=go");

  await expect(page.getByRole("group", { name: "UI type" }).getByRole("radio", { name: /^Custom UI/ })).toBeChecked();
  await expect(page.getByRole("combobox", { name: "Platform" }).first()).toContainText("Web");
  await expect(page.getByRole("combobox", { name: "Language" }).first()).toContainText("Go");
  await expect
    .poll(() =>
      page.evaluate(() => ({
        backend: localStorage.getItem("supertokens-docs:selection:backend-language"),
        frontend: localStorage.getItem("supertokens-docs:selection:frontend-custom-ui"),
        ui: localStorage.getItem("supertokens-docs:ui-type"),
      })),
    )
    .toEqual({ backend: "go", frontend: "web", ui: "custom" });
});

test("stored selections remain the fallback when the URL omits them", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("supertokens-docs:ui-type", "custom");
    localStorage.setItem("supertokens-docs:selection:frontend-custom-ui", "mobile");
    localStorage.setItem("supertokens-docs:selection:backend-language", "python");
  });
  await page.goto("/docs/quickstart?campaign=qa");

  await expect(page.getByRole("group", { name: "UI type" }).getByRole("radio", { name: /^Custom UI/ })).toBeChecked();
  await expect(page.getByRole("combobox", { name: "Platform" }).first()).toContainText("Mobile");
  await expect(page.getByRole("combobox", { name: "Language" }).first()).toContainText("Python");
  await expect
    .poll(() =>
      page.evaluate(() => {
        const query = new URL(location.href).searchParams;
        return {
          backend: query.get("backend"),
          campaign: query.get("campaign"),
          frontend: query.get("frontend"),
          q: query.get("q"),
          ui: query.get("ui"),
        };
      }),
    )
    .toEqual({
      backend: null,
      campaign: "qa",
      frontend: null,
      q: expect.stringMatching(/^B[A-Za-z0-9_-]+$/u),
      ui: null,
    });
});

test("preference controls share selections through URL and storage", async ({ browser, page }) => {
  await page.goto("/docs/quickstart?campaign=qa#2-integrate-the-backend-sdk");

  const frontend = page.locator('[data-docs-selection-group="frontend-prebuilt-ui"]').first();
  const packageManager = frontend.getByRole("combobox", { name: "Package manager" });
  await packageManager.click();
  await page.getByRole("option", { name: "pnpm", exact: true }).click();
  await frontend.getByRole("combobox", { name: "Frontend framework" }).click();
  await page.getByRole("option", { name: "Angular", exact: true }).click();

  const backend = page
    .getByRole("heading", { name: /2\.3 Add the SuperTokens APIs and configure CORS/ })
    .locator('~ .st-code-group[data-docs-selection-group="backend-language"]')
    .first();
  await backend.getByRole("combobox", { name: "Language" }).click();
  await page.getByRole("option", { name: "Go", exact: true }).click();
  await backend.getByRole("combobox", { name: "Go framework" }).click();
  await page.getByRole("option", { name: "Gin", exact: true }).click();
  await page
    .getByRole("group", { name: "UI type" })
    .getByRole("radio", { name: /^Custom UI/ })
    .click();

  await expect
    .poll(() =>
      page.evaluate(() => ({
        hash: location.hash,
        query: (() => {
          const params = new URL(location.href).searchParams;
          return {
            backend: params.get("backend"),
            campaign: params.get("campaign"),
            frontend: params.get("frontend"),
            framework: params.get("backend-framework"),
            packageManager: params.get("package-manager"),
            q: params.get("q"),
            ui: params.get("ui"),
          };
        })(),
        storage: {
          backend: localStorage.getItem("supertokens-docs:selection:backend-language"),
          framework: localStorage.getItem("supertokens-docs:selection:go-frameworks"),
          frontend: localStorage.getItem("supertokens-docs:selection:frontend-prebuilt-ui"),
          packageManager: localStorage.getItem("supertokens-docs:selection:package-managers"),
          ui: localStorage.getItem("supertokens-docs:ui-type"),
        },
      })),
    )
    .toEqual({
      hash: "#2-integrate-the-backend-sdk",
      query: {
        backend: null,
        campaign: "qa",
        frontend: null,
        framework: null,
        packageManager: null,
        q: expect.stringMatching(/^B[A-Za-z0-9_-]+$/u),
        ui: null,
      },
      storage: { backend: "go", framework: "gin", frontend: "angular", packageManager: "pnpm", ui: "custom" },
    });

  const generatedUrl = page.url();
  const freshContext = await browser.newContext();
  try {
    const freshPage = await freshContext.newPage();
    await freshPage.goto(generatedUrl);
    await expect(
      freshPage.getByRole("group", { name: "UI type" }).getByRole("radio", { name: /^Custom UI/ }),
    ).toBeChecked();
    await expect(freshPage.getByRole("combobox", { name: "Platform" }).first()).toContainText("Web");
    await expect(freshPage.getByRole("combobox", { name: "Language" }).first()).toContainText("Go");
    await expect(freshPage.getByRole("combobox", { name: "Go framework" }).first()).toContainText("Gin");
    await expect(
      freshPage.getByRole("combobox", { name: "Package manager", includeHidden: true }).first(),
    ).toContainText("pnpm");
    expect(freshPage.url()).toBe(generatedUrl);
  } finally {
    await freshContext.close();
  }
});

test("popstate reapplies query selections", async ({ page }) => {
  await page.goto("/docs/quickstart?frontend=reactjs");
  const framework = page
    .locator('[data-docs-selection-group="frontend-prebuilt-ui"]')
    .first()
    .getByRole("combobox", { name: "Frontend framework" });
  await expect(framework).toContainText("React");

  await page.evaluate(() => {
    history.pushState({}, "", "?frontend=angular");
    dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(framework).toContainText("Angular");
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("supertokens-docs:selection:frontend-prebuilt-ui")))
    .toBe("angular");

  await page.goBack();
  await expect(page).toHaveURL(/\/docs\/quickstart\?q=B[A-Za-z0-9_-]+$/u);
  await expect(framework).toContainText("React");
});

test("backend language and framework use synchronized header selects", async ({ page }) => {
  await page.goto("/docs/quickstart#2-integrate-the-backend-sdk");

  const sectionHeading = page.getByRole("heading", {
    name: /2\.3 Add the SuperTokens APIs and configure CORS/,
  });
  const languageGroup = sectionHeading
    .locator('~ .st-code-group[data-docs-selection-group="backend-language"]')
    .first();
  const languageSelect = languageGroup.getByRole("combobox", { name: "Language" });
  await expect(languageSelect).toBeVisible();
  await expect(languageSelect).toContainText("Node.js");
  await expect(languageSelect.locator("[data-option-icon]")).toBeVisible();
  await expect(languageGroup.locator("[data-blume-tablist] > [role='tab']").first()).toBeHidden();
  await expect(languageGroup.locator("[data-blume-tab-panel]:not(.hidden)")).toHaveAttribute("role", "region");
  await expect(languageGroup.locator("[data-blume-tab-panel]:not(.hidden)")).toHaveAttribute("aria-label", "Node.js");

  const nodeFramework = languageGroup.getByRole("combobox", { name: "Node.js framework" });
  await expect(nodeFramework).toBeVisible();
  await expect(nodeFramework).toHaveAccessibleName("Node.js framework");
  await expect(nodeFramework).toContainText("Express");

  const labelId = await nodeFramework.getAttribute("aria-labelledby");
  expect(labelId).not.toBeNull();
  const visualLabel = page.locator(`[id="${labelId}"]`);
  const labelPresentation = await visualLabel.evaluate((label) => {
    const styles = getComputedStyle(label);
    const bounds = label.getBoundingClientRect();
    return {
      clipPath: styles.clipPath,
      height: bounds.height,
      position: styles.position,
      width: bounds.width,
    };
  });
  expect(labelPresentation).toEqual({
    clipPath: "inset(50%)",
    height: 1,
    position: "absolute",
    width: 1,
  });

  const controlStyles = await languageGroup.evaluate((group) => {
    const selects = group.querySelectorAll<HTMLElement>('[role="combobox"]');
    const language = selects[0];
    const select = selects[1];
    if (!language || !select) throw new Error("Expected language and framework selects");

    const languageStyles = getComputedStyle(language);
    const selectStyles = getComputedStyle(select);
    return {
      select: {
        backgroundColor: selectStyles.backgroundColor,
        borderStyle: selectStyles.borderStyle,
        borderWidth: selectStyles.borderWidth,
        fontSize: selectStyles.fontSize,
        fontWeight: selectStyles.fontWeight,
      },
      language: {
        fontSize: languageStyles.fontSize,
        fontWeight: languageStyles.fontWeight,
      },
    };
  });
  expect(controlStyles.select).toMatchObject({
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderStyle: "none",
    borderWidth: "0px",
    fontSize: controlStyles.language.fontSize,
    fontWeight: controlStyles.language.fontWeight,
  });

  await nodeFramework.click();
  await page.getByRole("option", { name: "Fastify", exact: true }).click();

  await expect(languageGroup.locator('[data-code-option="node-frameworks:fastify"]')).toBeVisible();
  await expect(languageGroup.locator('[data-code-option="node-frameworks:express"]')).toBeHidden();

  await languageSelect.click();
  const goOption = page.getByRole("option", { name: "Go", exact: true });
  await expect(goOption.locator("[data-option-icon]")).toBeVisible();
  await expect(goOption.locator('[data-option-logo-size="wide"]')).toBeVisible();
  await goOption.click();
  await expect(nodeFramework).toBeHidden();
  const goFramework = languageGroup.getByRole("combobox", { name: "Go framework" });
  await expect(goFramework).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  const triggerBounds = await goFramework.boundingBox();
  expect(triggerBounds?.height).toBeGreaterThanOrEqual(44);

  const overflow = await languageGroup.evaluate((group) => {
    const bounds = group.getBoundingClientRect();
    return {
      groupLeft: bounds.left,
      groupRight: bounds.right,
      pageClientWidth: document.documentElement.clientWidth,
      pageScrollWidth: document.documentElement.scrollWidth,
    };
  });
  expect(overflow.pageScrollWidth).toBeLessThanOrEqual(overflow.pageClientWidth);
  expect(overflow.groupLeft).toBeGreaterThanOrEqual(0);
  expect(overflow.groupRight).toBeLessThanOrEqual(overflow.pageClientWidth);
});

test("custom frontend setup uses primary and dependent selects", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("supertokens-docs:platform-type", "mobile"));
  await page.goto("/docs/quickstart#1-integrate-the-frontend-sdk");

  const uiType = page.getByRole("group", { name: "UI type" });
  await uiType.getByRole("radio", { name: /^Custom UI/ }).click();

  const customFlow = page.locator('[data-variant-content="ui-type"][data-variant-value="custom"]');
  const installHeading = customFlow.getByRole("heading", { name: /1\.1 Install the SDK/ });
  const platformGroup = installHeading
    .locator('~ .st-code-group[data-docs-selection-group="frontend-custom-ui"]')
    .first();
  const platformTabs = platformGroup.locator("[data-blume-tablist]");
  const directPlatformTabs = platformTabs.locator(":scope > [role='tab']");
  const platformSelect = platformGroup.getByRole("combobox", { name: "Platform" });

  await expect(directPlatformTabs).toHaveCount(2);
  await expect(directPlatformTabs.first()).toBeHidden();
  await expect(platformSelect).toContainText("Mobile");
  await expect(platformSelect.locator("[data-option-icon]")).toBeVisible();
  await expect(platformGroup.getByRole("combobox", { name: "Mobile framework" })).toBeVisible();
  await expect(platformGroup.getByRole("combobox", { name: "Installation method" })).toBeHidden();
  await expect(platformGroup.locator('[data-blume-tab-panel] [role="tablist"]')).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(() => ({
        canonical: localStorage.getItem("supertokens-docs:selection:frontend-custom-ui"),
        migrated: localStorage.getItem("supertokens-docs:platform-type"),
      })),
    )
    .toEqual({ canonical: "mobile", migrated: null });

  await platformSelect.click();
  await page.getByRole("option", { name: "Web", exact: true }).click();
  await expect(platformGroup.getByRole("combobox", { name: "Installation method" })).toBeVisible();
  await expect(platformGroup.getByRole("combobox", { name: "Mobile framework" })).toBeHidden();

  const nextPlatformGroup = customFlow
    .locator('[data-docs-selection-group="frontend-custom-ui"]:not([data-docs-selection-passive="true"])')
    .nth(1);
  await expect(nextPlatformGroup.getByRole("combobox", { name: "Platform" })).toContainText("Web");
});

test("frontend primary select keeps package manager choice in the header", async ({ page }) => {
  await page.goto("/docs/quickstart#1-integrate-the-frontend-sdk");

  const group = page.locator('[data-docs-selection-group="frontend-prebuilt-ui"]').first();
  const framework = group.getByRole("combobox", { name: "Frontend framework" });
  const packageManager = group.getByRole("combobox", { name: "Package manager" });
  await expect(framework).toContainText("React");
  await expect(packageManager).toContainText("npm");
  await expect(packageManager.locator("[data-option-icon]")).toHaveCount(0);

  const npmWidth = (await packageManager.boundingBox())?.width || 0;
  await packageManager.click();
  const pnpm = page.getByRole("option", { name: "pnpm", exact: true });
  await expect(pnpm.locator("[data-option-icon]")).toHaveCount(0);
  await pnpm.click();
  await expect(group.locator('[data-code-option="package-managers:pnpm"]:visible')).toHaveCount(1);
  expect((await packageManager.boundingBox())?.width).not.toBe(npmWidth);

  await page.setViewportSize({ width: 320, height: 700 });
  await expect(framework).toHaveCSS("min-height", "44px");
  await expect(packageManager).toHaveCSS("min-height", "44px");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test("passive quickstart prose follows the primary selection without adding a control", async ({ page }) => {
  await page.goto("/docs/quickstart#1-integrate-the-frontend-sdk");

  const heading = page.getByRole("heading", { name: /^1\.3 Configure routing/ });
  const passiveContent = page
    .locator('[data-docs-dependent-content="frontend-prebuilt-ui"][data-docs-dependent-content-passive="true"]')
    .filter({ hasText: "In order for the pre-built UI to be rendered" });
  const reactProse = passiveContent.locator(':scope > [data-selection-value="reactjs"]');
  const angularProse = passiveContent.locator(':scope > [data-selection-value="angular"]');
  const group = heading.locator('~ .st-code-group[data-docs-selection-group="frontend-prebuilt-ui"]').first();
  const framework = group.getByRole("combobox", { name: "Frontend framework" });
  const follower = group
    .locator('~ .st-code-group[data-docs-selection-group="frontend-prebuilt-ui"][data-docs-selection-passive="true"]')
    .first();

  await expect(group.getByRole("combobox", { name: "Frontend framework" })).toHaveCount(1);
  await expect(group.getByRole("combobox", { name: "Do you use react-router-dom?" })).toHaveCount(1);
  await expect(group.getByRole("combobox")).toHaveCount(2);
  await expect(passiveContent.getByRole("combobox")).toHaveCount(0);
  await expect(follower.getByRole("combobox")).toHaveCount(0);
  await expect(follower).toBeVisible();
  await expect(follower.locator("[data-blume-tablist]")).toBeHidden();
  await expect(follower.locator('[role="tab"]:visible')).toHaveCount(0);
  await expect(reactProse).toBeVisible();
  await expect(reactProse).toContainText("In order for the pre-built UI to be rendered");
  await expect(angularProse).toBeHidden();

  await framework.click();
  await page.getByRole("option", { name: "Angular", exact: true }).click();

  await expect(reactProse).toBeHidden();
  await expect(angularProse).toBeVisible();
  await expect(angularProse).toContainText("Update your angular router");
  await expect(follower).toHaveAttribute("data-docs-code-empty", "");
  await expect(follower).toBeHidden();
});

test("fence CodeGroups deduplicate primary choices and synchronize secondary options", async ({ page }) => {
  await page.goto("/docs/quickstart#2-integrate-the-backend-sdk");

  const group = page.locator('.st-code-group[data-docs-selection-group="backend-language"]').nth(1);
  const language = group.getByRole("combobox", { name: "Language" });
  const framework = group.getByRole("combobox", { name: "Node.js framework" });

  await expect(group.locator("[data-blume-tab-panel]")).toHaveCount(3);
  await expect(group.locator('[data-code-option^="node-frameworks:"]')).toHaveCount(5);
  await expect(language).toContainText("Node.js");
  await expect(framework).toContainText("Express");
  await expect(group.locator('[data-code-option="node-frameworks:express"]')).toBeVisible();
  await expect(group.locator('[data-code-option="node-frameworks:fastify"]')).toBeHidden();

  await framework.click();
  await page.getByRole("option", { name: "Fastify", exact: true }).click();

  await expect(group.locator('[data-code-option="node-frameworks:express"]')).toBeHidden();
  await expect(group.locator('[data-code-option="node-frameworks:fastify"]')).toBeVisible();
});

test("fence CodeGroups use recoverable local fallbacks for unavailable stored values", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("supertokens-docs:selection:backend-language", "java");
    localStorage.setItem("supertokens-docs:selection:node-frameworks", "nextjs");
  });
  await page.goto("/docs/quickstart#2-integrate-the-backend-sdk");

  const group = page.locator('.st-code-group[data-docs-selection-group="backend-language"]').nth(1);
  await expect(group.getByRole("combobox", { name: "Language" })).toContainText("Node.js");
  await expect(group.getByRole("combobox", { name: "Node.js framework" })).toContainText("Express");
  await expect(group).toHaveAttribute("data-docs-selection-unavailable", "");
  await expect(group.locator('[data-tab-id="nodejs"]')).toHaveAttribute(
    "data-docs-secondary-selection-unavailable",
    "",
  );
  await expect(group.locator('[data-code-option="node-frameworks:express"]')).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => ({
        primary: localStorage.getItem("supertokens-docs:selection:backend-language"),
        secondary: localStorage.getItem("supertokens-docs:selection:node-frameworks"),
      })),
    )
    .toEqual({ primary: "java", secondary: "nextjs" });
});

test("secondary fence selections synchronize through storage events", async ({ context, page }) => {
  const follower = await context.newPage();
  await Promise.all([
    page.goto("/docs/quickstart#2-integrate-the-backend-sdk"),
    follower.goto("/docs/quickstart#2-integrate-the-backend-sdk"),
  ]);

  const leaderGroup = page.locator('.st-code-group[data-docs-selection-group="backend-language"]').nth(1);
  const followerGroup = follower.locator('.st-code-group[data-docs-selection-group="backend-language"]').nth(1);
  await leaderGroup.getByRole("combobox", { name: "Node.js framework" }).click();
  await page.getByRole("option", { name: "Fastify", exact: true }).click();

  await expect(followerGroup.getByRole("combobox", { name: "Node.js framework" })).toContainText("Fastify");
  await expect(followerGroup.locator('[data-code-option="node-frameworks:fastify"]')).toBeVisible();

  await page.evaluate(() => localStorage.removeItem("supertokens-docs:selection:node-frameworks"));
  await expect(followerGroup.getByRole("combobox", { name: "Node.js framework" })).toContainText("Express");
  await expect(followerGroup.locator('[data-code-option="node-frameworks:express"]')).toBeVisible();
  await follower.close();
});

test("standalone cURL fences preserve continuation backslashes and newlines", async ({ page }) => {
  await page.goto("/docs/quickstart#1-integrate-the-frontend-sdk");
  await page
    .getByRole("group", { name: "UI type" })
    .getByRole("radio", { name: /^Custom UI/ })
    .click();

  const snippet = page.locator("pre").filter({ hasText: "/auth/session/refresh" }).first();
  await expect(snippet).toBeVisible();
  expect(await snippet.textContent()).toContain(" \\\n--header 'Cookie: sRefreshToken=...'");
});

test("code snippets wrap by default and can be unwrapped independently", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/quickstart#1-integrate-the-frontend-sdk");
  await page
    .getByRole("group", { name: "UI type" })
    .getByRole("radio", { name: /^Custom UI/ })
    .click();

  const snippet = page.locator("pre:visible").filter({ hasText: "/auth/session/refresh" }).first();
  const code = snippet.locator(":scope > code");
  const toggle = snippet.locator(":scope > [data-docs-code-wrap-toggle]");
  const stableSnippet = page.locator("pre:visible").filter({ hasText: "npm i -s supertokens-web-js" }).first();
  const stableToggle = stableSnippet.locator(":scope > [data-docs-code-wrap-toggle]");
  const dimensions = () =>
    code.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
  const geometry = (block: typeof snippet) =>
    block.evaluate((pre) => {
      const bounds = (element: Element) => {
        const { height, width, x, y } = element.getBoundingClientRect();
        return { height, width, x: x + window.scrollX, y: y + window.scrollY };
      };
      return { code: bounds(pre.querySelector(":scope > code")!), pre: bounds(pre) };
    });

  await expect(page.locator("body")).toHaveAttribute("data-blume-code-wrap", "");
  await expect(toggle).toHaveAttribute("type", "button");
  await expect(toggle).toHaveAttribute("aria-label", "Wrap code lines");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(toggle).toHaveAttribute("title", "Unwrap code lines");
  await expect(toggle.locator('[data-docs-code-wrap-icon="unwrap"]')).toHaveCount(1);
  await expect(toggle.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await expect(toggle).toHaveCSS("opacity", "0");
  await expect(toggle).toHaveCSS("visibility", "hidden");
  const geometryBeforeReveal = await geometry(snippet);
  await snippet.hover();
  await expect(toggle).toHaveCSS("opacity", "1");
  await expect(toggle).toHaveCSS("visibility", "visible");
  expect(await geometry(snippet)).toEqual(geometryBeforeReveal);

  const geometryBeforeIconSwap = await geometry(stableSnippet);
  await stableSnippet.hover();
  await stableToggle.click();
  await expect(stableToggle.locator('[data-docs-code-wrap-icon="wrap"]')).toHaveCount(1);
  expect(await geometry(stableSnippet)).toEqual(geometryBeforeIconSwap);
  await stableToggle.click();
  await page.mouse.move(0, 0);
  await code.focus();
  await expect(toggle).toHaveCSS("opacity", "1");
  await expect(toggle).toHaveCSS("visibility", "visible");
  await toggle.focus();
  await expect(toggle).toHaveCSS("opacity", "1");
  await expect(toggle).toHaveCSS("visibility", "visible");

  const expectNeutralColor = async () => {
    const colors = await toggle.evaluate((button) => {
      const reference = document.createElement("span");
      reference.style.color = "var(--blume-foreground)";
      document.body.append(reference);
      const result = { button: getComputedStyle(button).color, foreground: getComputedStyle(reference).color };
      reference.remove();
      return result;
    });
    expect(colors.button).toBe(colors.foreground);
  };
  await expectNeutralColor();
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expectNeutralColor();
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(snippet).toHaveCSS("white-space", "pre-wrap");
  await expect(code).toHaveCSS("white-space", "pre-wrap");
  expect((await dimensions()).scrollWidth).toBeLessThanOrEqual((await dimensions()).clientWidth);

  await snippet.hover();
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(toggle).toHaveAttribute("title", "Wrap code lines");
  await expect(toggle.locator('[data-docs-code-wrap-icon="wrap"]')).toHaveCount(1);
  await expect(snippet).toHaveCSS("white-space", "pre");
  await expect(code).toHaveCSS("overflow-wrap", "normal");
  const unwrapped = await dimensions();
  expect(unwrapped.scrollWidth).toBeGreaterThan(unwrapped.clientWidth);
  await code.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
  });
  expect(await code.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(code).toHaveCSS("white-space", "pre-wrap");

  const cappedGroup = page.locator('.st-code-group[data-docs-code-max-height="24rem"]');
  const cappedPre = cappedGroup.locator("pre:visible").first();
  await expect(cappedPre.locator(":scope > [data-docs-code-wrap-toggle]")).toHaveCount(1);
  await expect(cappedPre.locator(":scope > code")).toHaveCSS("max-height", "384px");

  const getEligibleControlCounts = () =>
    page.locator(".prose pre").evaluateAll((blocks) =>
      blocks
        .filter((block) => {
          if (block.parentElement?.closest("pre")) return false;
          if (block.matches(".twoslash, .blume-source")) return false;
          if (block.closest("blume-panel-tabs, .api-request-snippet")) return false;
          return block.querySelector(":scope > code") && block.querySelector(":scope > [data-blume-copy]");
        })
        .map((block) => block.querySelectorAll(":scope > [data-docs-code-wrap-toggle]").length),
    );
  const controlCounts = await getEligibleControlCounts();
  expect(controlCounts.length).toBeGreaterThan(1);
  expect(controlCounts.every((count) => count === 1)).toBe(true);

  await toggle.click();
  await page.emulateMedia({ media: "print" });
  await expect(toggle).toBeHidden();
  await expect(code).toHaveCSS("white-space", "pre-wrap");
  await page.emulateMedia({ media: "screen" });
  await page.setViewportSize({ width: 1280, height: 800 });

  await page.getByRole("link", { name: "References", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/references\/?$/u);
  await page.getByRole("link", { name: "Documentation", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/?$/u);
  await page.getByRole("link", { name: "Quickstart Guide", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/quickstart\/?$/u);
  const routeSwapControlCounts = await getEligibleControlCounts();
  expect(routeSwapControlCounts.length).toBeGreaterThan(0);
  expect(routeSwapControlCounts.every((count) => count === 1)).toBe(true);
});

test("code wrap toggles remain visible and usable on touch devices", async ({ browser }, testInfo) => {
  const context = await browser.newContext({
    baseURL: testInfo.project.use.baseURL as string,
    hasTouch: true,
    viewport: { height: 844, width: 390 },
  });

  try {
    const page = await context.newPage();
    await page.goto("/docs/quickstart");

    expect(await page.evaluate(() => matchMedia("(hover: none)").matches)).toBe(true);
    const snippet = page.locator(".prose pre:has(> [data-docs-code-wrap-toggle])").first();
    const toggle = snippet.locator(":scope > [data-docs-code-wrap-toggle]");
    await expect(toggle).toHaveCSS("opacity", "1");
    await expect(toggle).toHaveCSS("visibility", "visible");
    await expect(toggle).toHaveCSS("pointer-events", "auto");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(snippet).toHaveAttribute("data-docs-code-unwrapped", "");
  } finally {
    await context.close();
  }
});

test("code snippets expand by default and CodeGroups opt into a maximum height", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/quickstart#2-integrate-the-backend-sdk");
  await page
    .getByRole("group", { name: "UI type" })
    .getByRole("radio", { name: /^Custom UI/ })
    .click();

  const cappedGroup = page.locator('.st-code-group[data-docs-code-max-height="24rem"]');
  const cappedCode = cappedGroup.locator("pre:visible code").first();
  const uncappedCode = page.locator(".st-code-group:not([data-docs-code-max-height]) pre:visible code").first();
  const standaloneCode = page.locator("pre:visible").filter({ hasText: "/auth/session/refresh" }).locator("code");

  await expect(cappedGroup).toHaveCSS("--st-code-group-max-height", "24rem");
  await expect(cappedCode).toHaveCSS("max-height", "384px");
  await expect(cappedCode).toHaveCSS("overflow-y", "auto");
  await expect(uncappedCode).toHaveCSS("max-height", "none");
  await expect(standaloneCode).toHaveCSS("max-height", "none");

  const dimensions = async (code: typeof cappedCode) =>
    code.evaluate((element) => ({
      clientHeight: element.clientHeight,
      clientWidth: element.clientWidth,
      scrollHeight: element.scrollHeight,
      scrollWidth: element.scrollWidth,
    }));
  const cappedDimensions = await dimensions(cappedCode);
  const uncappedDimensions = await dimensions(uncappedCode);
  const standaloneDimensions = await dimensions(standaloneCode);
  expect(cappedDimensions.scrollHeight).toBeGreaterThan(cappedDimensions.clientHeight);
  expect(uncappedDimensions.scrollHeight).toBeLessThanOrEqual(uncappedDimensions.clientHeight);
  expect(standaloneDimensions.scrollHeight).toBeLessThanOrEqual(standaloneDimensions.clientHeight);
  expect(standaloneDimensions.scrollWidth).toBeLessThanOrEqual(standaloneDimensions.clientWidth);
  await expect(standaloneCode).toHaveCSS("overflow-x", "auto");

  await page.emulateMedia({ media: "print" });
  await expect(cappedCode).toHaveCSS("max-height", "none");
  await expect(cappedCode).toHaveCSS("overflow-y", "visible");
  const printedDimensions = await dimensions(cappedCode);
  expect(printedDimensions.scrollHeight).toBeLessThanOrEqual(printedDimensions.clientHeight);
});

test("structural CodeGroups expand and nested groups own their height", async ({ page }) => {
  await page.goto("/docs/post-authentication/dashboard/initial-setup");

  const structuralCode = page
    .locator('.st-code-group[data-docs-selection-group="backend-language"] pre:visible code')
    .first();
  await expect(structuralCode).toHaveCSS("max-height", "none");
  expect(await structuralCode.evaluate((code) => code.scrollHeight <= code.clientHeight)).toBe(true);

  const nestedHeights = await page.locator(".prose").evaluate((prose) => {
    const fixture = document.createElement("div");
    fixture.className = "st-code-group";
    fixture.dataset.docsCodeMaxHeight = "1px";
    fixture.style.setProperty("--st-code-group-max-height", "1px");
    fixture.innerHTML = `
      <pre><code data-outer-code>outer\ncode</code></pre>
      <div class="st-code-group"><pre><code data-inner-code>inner\ncode</code></pre></div>
    `;
    prose.append(fixture);
    const outer = getComputedStyle(fixture.querySelector("[data-outer-code]")!).maxHeight;
    const inner = getComputedStyle(fixture.querySelector("[data-inner-code]")!).maxHeight;
    fixture.remove();
    return { inner, outer };
  });
  expect(nestedHeights).toEqual({ inner: "none", outer: "1px" });
});

test("standalone package-manager choices use CodeGroup", async ({ page }) => {
  await page.goto("/docs/authentication/ai-authentication");

  const group = page.locator('.st-code-group[data-docs-selection-group="package-managers"]');
  const packageManager = group.getByRole("combobox", { name: "Package manager" });
  await expect(packageManager).toBeVisible();
  await packageManager.click();
  await page.getByRole("option", { name: "yarn", exact: true }).click();

  await expect(group.locator('[data-tab-id="npm"]')).toBeHidden();
  await expect(group.locator('[data-tab-id="yarn"]')).toBeVisible();
});

test("prose-only Dashboard choices remain selectable without fallback code", async ({ page }) => {
  await page.goto("/docs/authentication/social/built-in-providers-config");
  await page.getByRole("group", { name: "Tenant setup" }).getByRole("radio", { name: "Multi-tenant" }).click();

  const multiTenant = page.locator('[data-variant-content="tenant-type"][data-variant-value="multi"]');
  const prose = multiTenant.locator('[data-docs-dependent-content="backend-language"]').first();
  const group = multiTenant.locator('.st-code-group[data-docs-selection-group="backend-language"]').first();

  await group.getByRole("combobox", { name: "Language" }).click();
  await page.getByRole("option", { name: "Dashboard", exact: true }).click();

  await expect(prose.locator('[data-selection-value="dashboard"]')).toBeVisible();
  await expect(group).toHaveAttribute("data-docs-code-empty", "");
  await expect(group.locator("pre:visible, figure:visible")).toHaveCount(0);
  await expect(group).not.toHaveAttribute("data-docs-selection-unavailable", "");
});

test("passive primary groups can introduce a secondary selector", async ({ page }) => {
  await page.goto("/docs/authentication/passwordless/initial-setup");

  const group = page.locator('.st-code-group[data-docs-secondary-controls="react-router"]').first();
  const router = group.getByRole("combobox", { name: "Do you use react-router-dom?" });
  await expect(router).toBeVisible();
  await router.click();
  await page.getByRole("option", { name: "No", exact: true }).click();
  await expect(group.locator('[data-selection-value="no"]')).toBeVisible();
});

test("CodeGroups show fenced fallbacks and hide passive followers without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/docs/quickstart");

  const group = page.locator('.st-code-group[data-docs-selection-group="frontend-prebuilt-ui"]').first();
  const fences = group.locator(":scope > blume-tabs > [data-blume-tab-content] > pre");
  expect(await fences.count()).toBeGreaterThan(1);
  await expect(group.locator(":scope > blume-tabs > [data-blume-tab-content] > pre:visible")).toHaveCount(1);

  const cappedGroup = page.locator('.st-code-group[data-docs-code-max-height="24rem"]');
  await expect(cappedGroup.locator("pre:visible code").first()).toHaveCSS("max-height", "384px");
  await expect(cappedGroup.locator("pre:visible code").first()).toHaveCSS("overflow-y", "auto");
  await expect(cappedGroup.locator("pre:visible code").first()).toHaveCSS("white-space", "pre-wrap");
  await expect(page.getByRole("button", { name: "Wrap code lines" })).toHaveCount(0);

  const passiveFollower = page.locator('.st-code-group[data-docs-selection-passive="true"]').first();
  await expect(passiveFollower.locator('[data-title="Angular"]')).toHaveCount(1);
  await expect(passiveFollower.locator("[data-blume-tablist]")).toBeHidden();
  await expect(passiveFollower).toBeHidden();

  await page.goto("/docs/authentication/ai-authentication");
  const tabGroup = page.locator('.st-code-group[data-docs-selection-group="package-managers"]').first();
  expect(await tabGroup.locator("[data-blume-tab-panel]").count()).toBeGreaterThan(1);
  await expect(tabGroup.locator("[data-blume-tab-panel]:visible")).toHaveCount(1);
  await context.close();
});

test("passive dependent content shows its first option without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/docs/quickstart");

  const content = page
    .locator('[data-docs-dependent-content="frontend-prebuilt-ui"][data-docs-dependent-content-passive="true"]')
    .first();
  const options = content.locator("[data-docs-content-option]");
  await expect(options).toHaveCount(3);
  await expect(options.nth(0)).toBeVisible();
  await expect(options.nth(1)).toBeHidden();
  await expect(options.nth(2)).toBeHidden();
  await expect(content.locator("[data-standalone-accessory-host]")).toBeHidden();
  await context.close();
});

test("ungrouped tabs remain accessible tabs", async ({ page }) => {
  await page.goto("/docs");

  const group = page.locator("blume-tabs").filter({ hasText: "Managed service" }).first();
  const tablist = group.getByRole("tablist");
  await expect(tablist).toBeVisible();
  await expect(tablist.getByRole("tab")).toHaveText(["Managed service", "Self-hosted"]);
  await expect(group.locator('[role="tabpanel"]:not(.hidden)')).toBeVisible();
  await expect(group.getByRole("combobox")).toHaveCount(0);
});

test("account migration API snippets match the CDI specification", async ({ page }) => {
  await page.goto("/docs/migration/account-migration");

  const snippets = page.locator(".api-request-snippet");
  await expect(snippets).toHaveCount(apiRequestCases.length);
  await expect(snippets.locator("select")).toHaveCount(0);
  await expect(snippets.locator("[data-docs-code-wrap-toggle]")).toHaveCount(0);
  await expect(snippets.locator("pre code").first()).toHaveCSS("white-space", "pre");

  const firstSnippet = snippets.nth(0);
  const secondSnippet = snippets.nth(1);
  const firstLanguage = firstSnippet.getByRole("combobox", { name: "Language" });
  await firstLanguage.click();
  await expect(page.getByRole("option").locator(".preferences-option-logo")).toHaveCount(0);
  await page.getByRole("option", { name: "JavaScript", exact: true }).click();
  await expect(firstSnippet.locator('[data-blume-tab-panel][data-title="JavaScript"]')).toBeVisible();
  await expect(secondSnippet.locator('[data-blume-tab-panel][data-title="cURL"]')).toBeVisible();
  await expect(secondSnippet.locator('[data-blume-tab-panel][data-title="JavaScript"]')).toBeHidden();
  await firstLanguage.click();
  await page.getByRole("option", { name: "cURL", exact: true }).click();

  for (const apiRequest of apiRequestCases) {
    const snippet = snippets.filter({
      has: page.locator(`a[data-api-reference-trigger][href="${apiRequest.canonicalPath}"]`),
    });
    const language = snippet.getByRole("combobox", { name: "Language" });
    const panels = snippet.locator("[data-blume-tab-panel]");

    await expect(snippet).toHaveCount(1);
    await expect(language).toContainText("cURL");
    await expect(panels).toHaveCount(4);
    const apiReference = snippet.getByRole("link", { name: `API Reference: ${apiRequest.title}`, exact: true });
    await expect(apiReference).toHaveAttribute("href", apiRequest.canonicalPath);
    await expect(apiReference).toHaveAttribute(
      "data-api-reference-embed-href",
      `/docs/api-reference-embed/cdi/${apiRequest.embedKey}`,
    );
    await expect(apiReference).toHaveAttribute("data-api-reference-spec-href", "/docs/api-spec/cdi.json");

    const languages = [
      { label: "cURL", method: `curl -X ${apiRequest.method}` },
      { label: "JavaScript", method: `method: "${apiRequest.method}"` },
      { label: "Go", method: `http.NewRequest("${apiRequest.method}"` },
      { label: "Python", method: `requests.${apiRequest.method.toLowerCase()}(` },
    ] as const;

    for (const languageCase of languages) {
      await language.click();
      await page.getByRole("option", { name: languageCase.label, exact: true }).click();
      const panel = panels.filter({ has: page.locator(`code`) }).filter({ hasText: languageCase.method });

      await expect(panel).toBeVisible();
      await expect(snippet.locator("[data-blume-tab-panel]:visible")).toHaveCount(1);
      const code = await panel.locator("code").innerText();
      expect(code).toContain(JSON.stringify(apiRequest.url));
      expect(code).toContain(languageCase.method);
      expect(code).toContain("api-key");
      expect(code).toContain("YOUR_API_KEY");
      if (apiRequest.method === "POST") {
        expect(code).toContain("Content-Type");
        expect(code).toContain("application/json");
      } else {
        expect(code).not.toContain("Content-Type");
        expect(code).not.toContain("application/json");
      }
    }

    if (apiRequest.hasRequestExample) {
      await language.click();
      await page.getByRole("option", { name: "cURL", exact: true }).click();
      const curlCode = await snippet.locator('[data-blume-tab-panel][data-title="cURL"] code').innerText();
      expect(curlBody(curlCode)).toEqual(requestExample(apiRequest.path));
    }
  }
});

test("account migration API links selectively preload a reusable reference drawer", async ({ page }) => {
  const embedDocumentRequests: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "document" && request.url().includes("/docs/api-reference-embed/")) {
      embedDocumentRequests.push(request.url());
    }
  });
  await page.goto("/docs/migration/account-migration");

  const links = page.locator("[data-api-reference-trigger]");
  const frames = page.locator("[data-api-reference-frame]");
  const pageUrl = page.url();
  const embedUrls = apiRequestCases.map(
    ({ embedKey }) => new URL(`/docs/api-reference-embed/cdi/${embedKey}`, pageUrl).href,
  );
  const frameFor = (url: string) => page.locator(`[data-api-reference-frame][data-api-reference-url="${url}"]`);
  const requestCountFor = (url: string) => embedDocumentRequests.filter((requestUrl) => requestUrl === url).length;
  const expectEmbeddedOperation = async (url: string, apiRequest: (typeof apiRequestCases)[number]) => {
    const embeddedPage = frameFor(url).contentFrame();
    await expect(embeddedPage.getByText(apiRequest.method, { exact: true }).first()).toBeVisible();
    await expect(embeddedPage.getByText(apiRequest.path, { exact: true })).toBeVisible();
    if (apiRequest.method === "POST") {
      await expect(embeddedPage.getByRole("heading", { name: "Request body" })).toBeVisible();
    }
    await expect(embeddedPage.getByRole("heading", { name: "Responses" })).toBeVisible();
    await expect(
      embeddedPage.locator("header, nav, aside, [data-blume-header], [data-blume-nav-drawer], [data-blume-sidebar]"),
    ).toHaveCount(0);
  };

  await expect(links).toHaveCount(apiRequestCases.length);
  for (const [index, apiRequest] of apiRequestCases.entries()) {
    await expect(links.nth(index)).toHaveAttribute("href", apiRequest.canonicalPath);
    await expect(links.nth(index)).toHaveAttribute("data-api-reference-spec-href", "/docs/api-spec/cdi.json");
    await expect(links.nth(index)).toHaveAccessibleName(`API Reference: ${apiRequest.title}`);
  }

  await page.waitForLoadState("networkidle");
  expect(await frames.count()).toBeLessThan(apiRequestCases.length);
  expect(new Set(embedDocumentRequests).size).toBeLessThan(apiRequestCases.length);

  const initiallyLoadedUrls = await frames.evaluateAll((loadedFrames) =>
    loadedFrames.filter((frame) => frame.dataset.loaded === "true").map((frame) => frame.dataset.apiReferenceUrl),
  );
  const preloadIndex = embedUrls.findIndex((url) => !initiallyLoadedUrls.includes(url));
  expect(preloadIndex).toBeGreaterThanOrEqual(0);

  const preloadCase = apiRequestCases[preloadIndex];
  const preloadLink = links.nth(preloadIndex);
  const preloadEmbedUrl = embedUrls[preloadIndex];
  const preloadFrame = frameFor(preloadEmbedUrl);
  const preloadDialog = page.getByRole("dialog", { name: preloadCase.title, exact: true });
  await preloadLink.scrollIntoViewIfNeeded();
  await expect(preloadFrame).toHaveAttribute("data-loaded", "true");
  await expect(preloadFrame).toBeHidden();
  await expect(page.locator("[data-api-reference-drawer]")).not.toHaveAttribute("open", "");
  expect(requestCountFor(preloadEmbedUrl)).toBe(1);

  const preloadedRequestCount = embedDocumentRequests.length;
  await preloadLink.click();

  await expect(page).toHaveURL(pageUrl);
  await expect(preloadDialog).toBeVisible();
  await expect(preloadDialog.getByRole("button", { name: "Close API reference" })).toBeFocused();
  await expect(preloadFrame).toBeVisible();
  await expect(page.locator("[data-api-reference-frame]:visible")).toHaveCount(1);
  await expect(preloadFrame).toHaveAttribute("src", preloadEmbedUrl);
  await expect(preloadFrame).toHaveAttribute("title", `API reference: ${preloadCase.title}`);
  const openPage = preloadDialog.getByRole("button", { name: "Open Page", exact: true });
  await expect(openPage).toBeVisible();
  await expect(openPage.locator('svg[aria-hidden="true"]')).toHaveCount(1);
  await expectEmbeddedOperation(preloadEmbedUrl, preloadCase);
  expect(embedDocumentRequests).toHaveLength(preloadedRequestCount);
  expect(requestCountFor(preloadEmbedUrl)).toBe(1);

  await page.keyboard.press("Escape");
  await expect(preloadDialog).toBeHidden();
  await expect(preloadLink).toBeFocused();

  for (const modifier of ["ctrlKey", "metaKey"] as const) {
    await preloadLink.evaluate((link, key) => {
      window.addEventListener("click", (event) => event.preventDefault(), { once: true });
      link.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0, cancelable: true, [key]: true }));
    }, modifier);
    await expect(preloadDialog).toBeHidden();
    await expect(page).toHaveURL(pageUrl);
  }
  expect(requestCountFor(preloadEmbedUrl)).toBe(1);

  await preloadLink.click();
  await expect(preloadDialog).toBeVisible();
  await expect(preloadFrame).toBeVisible();
  expect(requestCountFor(preloadEmbedUrl)).toBe(1);

  await page.keyboard.press("Escape");
  const alternateIndex = (preloadIndex + 1) % apiRequestCases.length;
  const alternateCase = apiRequestCases[alternateIndex];
  const alternateEmbedUrl = embedUrls[alternateIndex];
  const alternateLink = links.nth(alternateIndex);
  const alternateFrame = frameFor(alternateEmbedUrl);
  await alternateLink.scrollIntoViewIfNeeded();
  await expect(alternateFrame).toHaveAttribute("data-loaded", "true");
  const alternateRequestCount = requestCountFor(alternateEmbedUrl);
  await alternateLink.click();
  await expect(page.getByRole("dialog", { name: alternateCase.title, exact: true })).toBeVisible();
  await expect(alternateFrame).toBeVisible();
  await expect(preloadFrame).toBeHidden();
  await expect(page.locator("[data-api-reference-frame]:visible")).toHaveCount(1);
  expect(requestCountFor(alternateEmbedUrl)).toBe(alternateRequestCount);

  await page.keyboard.press("Escape");
  await page.getByRole("link", { name: "Documentation", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/?$/u);
  await expect(frames).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(pageUrl);

  const restoredLink = page.locator("[data-api-reference-trigger]").nth(preloadIndex);
  await restoredLink.click();
  await expect(page.locator("[data-api-reference-drawer]")).toHaveCount(1);
  await expect(frameFor(preloadEmbedUrl)).toBeVisible();
  await expect(page.locator("[data-api-reference-frame]:visible")).toHaveCount(1);
  await expect(page).toHaveURL(pageUrl);
  const restoredDialog = page.getByRole("dialog", { name: preloadCase.title, exact: true });
  await expect(restoredDialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(restoredDialog).toBeHidden();
  await expect(restoredLink).toBeFocused();
});

test("API reference drawer copies the full normalized CDI specification", async ({ context, page }) => {
  const origin = new URL(test.info().project.use.baseURL as string).origin;
  const specUrl = new URL("/docs/api-spec/cdi.json", origin).href;
  const specRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url() === specUrl) specRequests.push(request.url());
  });
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin });
  await page.goto("/docs/migration/account-migration");

  const apiRequest = apiRequestCases[0];
  await page.getByRole("link", { name: `API Reference: ${apiRequest.title}`, exact: true }).click();
  const dialog = page.getByRole("dialog", { name: apiRequest.title, exact: true });
  const copy = dialog.getByRole("button", { name: "Copy", exact: true });
  await expect.poll(() => specRequests).toEqual([specUrl]);
  await expect(copy.locator('svg[aria-hidden="true"]')).toHaveCount(1);
  await copy.click();
  await expect(dialog.getByRole("button", { name: "Copied" })).toBeVisible();
  expect(specRequests).toEqual([specUrl]);

  const copiedSpec = JSON.parse(await page.evaluate(() => navigator.clipboard.readText())) as OpenApiDocument;
  expect(copiedSpec.openapi).toBe("3.1.1");
  expect(copiedSpec.info).toEqual(cdiSpec.info);
  expect(Object.keys(copiedSpec.paths).sort()).toEqual(Object.keys(cdiSpec.paths).sort());
  expect(copiedSpec.paths[apiRequest.path]?.post?.operationId).toBe(cdiSpec.paths[apiRequest.path]?.post?.operationId);
  expect(copiedSpec.paths[apiRequest.path]?.post?.summary).toBe(cdiSpec.paths[apiRequest.path]?.post?.summary);
});

test("API reference drawer opens the canonical operation page", async ({ page }) => {
  await page.goto("/docs/migration/account-migration");

  const apiRequest = apiRequestCases[0];
  const canonicalUrl = new URL(apiRequest.canonicalPath, page.url()).href;
  await page.getByRole("link", { name: `API Reference: ${apiRequest.title}`, exact: true }).click();
  const dialog = page.getByRole("dialog", { name: apiRequest.title, exact: true });

  const openPage = dialog.getByRole("button", { name: "Open Page", exact: true });
  await expect(openPage.locator('svg[aria-hidden="true"]')).toHaveCount(1);
  await openPage.click();
  await expect(page).toHaveURL(canonicalUrl);
});

test("API reference intent signals preload hidden frames without opening the drawer", async ({ page }) => {
  await page.addInitScript(() => Reflect.deleteProperty(window, "IntersectionObserver"));
  await page.goto("/docs/migration/account-migration");

  const drawer = page.locator("[data-api-reference-drawer]");
  const frameFor = (index: number) => {
    const embedUrl = new URL(`/docs/api-reference-embed/cdi/${apiRequestCases[index].embedKey}`, page.url()).href;
    return page.locator(`[data-api-reference-frame][data-api-reference-url="${embedUrl}"]`);
  };
  const linkFor = (index: number) =>
    page.getByRole("link", { name: `API Reference: ${apiRequestCases[index].title}`, exact: true });

  await linkFor(0).hover();
  await expect(frameFor(0)).toHaveAttribute("data-loaded", "true");
  await expect(frameFor(0)).toBeHidden();

  await linkFor(1).evaluate((link) => link.focus({ preventScroll: true }));
  await expect(frameFor(1)).toHaveAttribute("data-loaded", "true");
  await expect(frameFor(1)).toBeHidden();

  await linkFor(2).dispatchEvent("pointerdown", { pointerType: "touch" });
  await expect(frameFor(2)).toHaveAttribute("data-loaded", "true");
  await expect(frameFor(2)).toBeHidden();
  await expect(drawer).not.toHaveAttribute("open", "");
});

test("a cold API reference click stays load-gated", async ({ page }) => {
  await page.addInitScript(() => Reflect.deleteProperty(window, "IntersectionObserver"));

  const apiRequest = apiRequestCases[0];
  const embedUrl = new URL(
    `/docs/api-reference-embed/cdi/${apiRequest.embedKey}`,
    test.info().project.use.baseURL as string,
  ).href;
  let releaseEmbed: () => void = () => {};
  const embedBlocked = new Promise<void>((resolve) => {
    releaseEmbed = resolve;
  });
  const embedRequests: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "document" && request.url() === embedUrl) embedRequests.push(request.url());
  });
  await page.route(embedUrl, async (route) => {
    await embedBlocked;
    await route.continue();
  });
  await page.goto("/docs/migration/account-migration");

  const link = page.getByRole("link", { name: `API Reference: ${apiRequest.title}`, exact: true });
  const frame = page.locator(`[data-api-reference-frame][data-api-reference-url="${embedUrl}"]`);
  const dialog = page.getByRole("dialog", { name: apiRequest.title, exact: true });
  await link.evaluate((trigger) =>
    trigger.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0, cancelable: true })),
  );

  await expect.poll(() => embedRequests).toEqual([embedUrl]);
  await expect(frame).toHaveCount(1);
  await expect(frame).not.toHaveAttribute("data-loaded", "true");
  await expect(dialog).toBeHidden();

  releaseEmbed();
  await expect(frame).toHaveAttribute("data-loaded", "true");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close API reference" })).toBeFocused();
});

test("account migration API reference drawer fills a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/migration/account-migration");
  await page.locator("[data-api-reference-trigger]").first().click();

  const dialog = page.getByRole("dialog", { name: "Import one user directly" });
  await expect(dialog).toBeVisible();
  const bounds = await dialog.boundingBox();
  expect(bounds?.x).toBe(0);
  expect(bounds?.width).toBe(390);
});

test("CDI and FDI embed routes render their referenced operations without documentation chrome", async ({ page }) => {
  const cases = [
    {
      key: apiRequestCases[0].embedKey,
      method: "POST",
      operationId: apiRequestCases[0].operationId,
      path: apiRequestCases[0].path,
      source: "cdi",
      spec: cdiSpec,
      title: apiRequestCases[0].title,
    },
    {
      key: "signin",
      method: "POST",
      operationId: "signIn",
      path: "/{apiBasePath}/{tenantId}/signin",
      source: "fdi",
      spec: fdiSpec,
      title: "Sign in with email",
    },
  ] as const;

  for (const operationCase of cases) {
    const operation = operationCase.spec.paths[operationCase.path]?.[operationCase.method.toLowerCase()];
    expect(operation?.operationId).toBe(operationCase.operationId);
    expect(operation?.summary).toBe(operationCase.title);

    await page.goto(`/docs/api-reference-embed/${operationCase.source}/${operationCase.key}`);

    await expect(page).toHaveTitle(`${operationCase.title} API reference`);
    await expect(page.getByText(operationCase.method, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(operationCase.path, { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Request body" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Responses" })).toBeVisible();
    await expect(
      page.locator("header, nav, aside, [data-blume-header], [data-blume-nav-drawer], [data-blume-sidebar]"),
    ).toHaveCount(0);
  }
});
