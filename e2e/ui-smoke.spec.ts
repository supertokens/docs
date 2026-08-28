import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { expect, test as base } from "@playwright/test";
import { load } from "js-yaml";

interface OpenApiOperation {
  requestBody?: {
    content?: Record<
      string,
      {
        example?: unknown;
        examples?: Record<string, { value?: unknown }>;
      }
    >;
  };
}

interface OpenApiDocument {
  paths: Record<string, Record<string, OpenApiOperation>>;
}

const cdiSpec = load(readFileSync(resolve("openapi/cdi.yml"), "utf8")) as OpenApiDocument;

const apiRequestCases = [
  {
    canonicalPath: "/docs/references/cdi/bulk-import/importoneuserwithbulkimport",
    method: "POST",
    operationId: "importOneUserWithBulkImport",
    path: "/appid-{appId}/bulk-import/import",
    snippetId: "migration-import-one-user",
    url: "<CORE_API_ENDPOINT>/appid-public/bulk-import/import",
  },
  {
    canonicalPath: "/docs/references/cdi/bulk-import/addbulkimportusers",
    method: "POST",
    operationId: "addBulkImportUsers",
    path: "/appid-{appId}/bulk-import/users",
    snippetId: "migration-add-bulk-users",
    url: "<CORE_API_ENDPOINT>/appid-public/bulk-import/users",
  },
  {
    canonicalPath: "/docs/references/cdi/bulk-import/countbulkimportusers",
    method: "GET",
    operationId: "countBulkImportUsers",
    path: "/appid-{appId}/bulk-import/users/count",
    snippetId: "migration-count-processing-users",
    url: "<CORE_API_ENDPOINT>/appid-public/bulk-import/users/count?status=PROCESSING",
  },
  {
    canonicalPath: "/docs/references/cdi/bulk-import/getbulkimportusers",
    method: "GET",
    operationId: "getBulkImportUsers",
    path: "/appid-{appId}/bulk-import/users",
    snippetId: "migration-get-failed-users",
    url: "<CORE_API_ENDPOINT>/appid-public/bulk-import/users?status=FAILED",
  },
] as const;

const snippetNamespace = (operationId: string, snippetId: string) =>
  `api-request-${operationId.toLowerCase()}-${snippetId}`;

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
  await page.goto("/docs");

  const header = page.locator("[data-blume-header]");
  const logo = header.locator("[data-st-logo] > a");
  const documentation = header.getByRole("link", { name: "Documentation", exact: true });
  const references = header.getByRole("link", { name: "References", exact: true });
  await expect(logo).toBeVisible();
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

test("active sidebar item has no accent edge", async ({ page }) => {
  await page.goto("/docs/quickstart");

  const activeLink = page.getByRole("link", { name: "Quickstart Guide", exact: true });
  await expect(activeLink).toBeVisible();
  await expect(activeLink).not.toHaveCSS("box-shadow", /inset/);
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

test("backend language and framework use synchronized header selects", async ({ page }) => {
  await page.goto("/docs/quickstart#2-integrate-the-backend-sdk");

  const sectionHeading = page.getByRole("heading", {
    name: /2\.3 Add the SuperTokens APIs and configure CORS/,
  });
  const languageGroup = sectionHeading.locator('~ .st-tab-group[data-docs-tab-group="backend-language"]').first();
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

  const nodeFrameworkContent = languageGroup.locator('[data-docs-dependent-content="node-frameworks"]');
  await expect(nodeFrameworkContent.locator('[data-selection-value="fastify"]')).toBeVisible();
  await expect(nodeFrameworkContent.locator('[data-selection-value="express"]')).toBeHidden();
  const contentOptionLayout = await nodeFrameworkContent
    .locator('[data-selection-value="fastify"]')
    .evaluate((activeOption) => {
      const optionStyles = getComputedStyle(activeOption);
      const heading = activeOption.querySelector<HTMLElement>(".st-content-option-heading");
      const host = activeOption.parentElement?.querySelector<HTMLElement>("[data-standalone-accessory-host]");
      if (!heading || !host) throw new Error("Expected content option heading and standalone host");
      const headingStyles = getComputedStyle(heading);
      const hostStyles = getComputedStyle(host);
      return {
        headingDisplay: headingStyles.display,
        hostMargin: hostStyles.margin,
        hostPadding: hostStyles.padding,
        optionBorderWidth: optionStyles.borderWidth,
        optionMargin: optionStyles.margin,
        optionPadding: optionStyles.padding,
      };
    });
  expect(contentOptionLayout).toEqual({
    headingDisplay: "none",
    hostMargin: "0px",
    hostPadding: "0px",
    optionBorderWidth: "0px",
    optionMargin: "0px",
    optionPadding: "0px",
  });

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
  const platformGroup = installHeading.locator('~ .st-tab-group[data-docs-tab-group="frontend-custom-ui"]').first();
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
    .locator('[data-docs-tab-group="frontend-custom-ui"]:not([data-docs-tab-passive="true"])')
    .nth(1);
  await expect(nextPlatformGroup.getByRole("combobox", { name: "Platform" })).toContainText("Web");
});

test("frontend primary select keeps package manager choice in the header", async ({ page }) => {
  await page.goto("/docs/quickstart#1-integrate-the-frontend-sdk");

  const group = page.locator('[data-docs-tab-group="frontend-prebuilt-ui"]').first();
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
  const group = heading.locator('~ .st-tab-group[data-docs-tab-group="frontend-prebuilt-ui"]').first();
  const framework = group.getByRole("combobox", { name: "Frontend framework" });
  const follower = group
    .locator('~ .st-tab-group[data-docs-tab-group="frontend-prebuilt-ui"][data-docs-tab-passive="true"]')
    .first();

  await expect(group.getByRole("combobox", { name: "Frontend framework" })).toHaveCount(1);
  await expect(group.getByRole("combobox", { name: "Already using React Router?" })).toHaveCount(1);
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

test("standalone cURL CodeBlocks preserve continuation backslashes and newlines", async ({ page }) => {
  await page.goto("/docs/quickstart#1-integrate-the-frontend-sdk");
  await page
    .getByRole("group", { name: "UI type" })
    .getByRole("radio", { name: /^Custom UI/ })
    .click();

  const snippet = page.locator("pre").filter({ hasText: "/auth/session/refresh" }).first();
  await expect(snippet).toBeVisible();
  expect(await snippet.textContent()).toContain(" \\\n--header 'Cookie: sRefreshToken=...'");
});

test("standalone dependent content stays flush around the active option", async ({ page }) => {
  await page.goto("/docs/authentication/ai-authentication");

  const content = page.locator('[data-docs-dependent-content="package-managers"]');
  const host = content.locator(":scope > [data-standalone-accessory-host]");
  const packageManager = host.getByRole("combobox", { name: "Package manager" });
  await expect(packageManager).toBeVisible();
  await packageManager.click();
  await page.getByRole("option", { name: "yarn", exact: true }).click();

  const npmOption = content.locator('[data-selection-value="npm"]');
  const yarnOption = content.locator('[data-selection-value="yarn"]');
  await expect(npmOption).toBeHidden();
  await expect(yarnOption).toBeVisible();
  const layout = await content.evaluate((wrapper) => {
    const activeOption = wrapper.querySelector<HTMLElement>('[data-selection-value="yarn"]')!;
    const accessoryHost = wrapper.querySelector<HTMLElement>("[data-standalone-accessory-host]")!;
    const heading = activeOption.querySelector<HTMLElement>(".st-content-option-heading")!;
    const stylesFor = (element: HTMLElement) => {
      const styles = getComputedStyle(element);
      return {
        borderWidth: styles.borderWidth,
        margin: styles.margin,
        padding: styles.padding,
      };
    };
    return {
      content: stylesFor(wrapper as HTMLElement),
      headingDisplay: getComputedStyle(heading).display,
      host: stylesFor(accessoryHost),
      option: stylesFor(activeOption),
    };
  });
  expect(layout).toEqual({
    content: { borderWidth: "0px", margin: "0px", padding: "0px" },
    headingDisplay: "none",
    host: { borderWidth: "0px", margin: "0px", padding: "0px" },
    option: { borderWidth: "0px", margin: "0px", padding: "0px" },
  });
});

test("grouped tabs use safe defaults and hide mismatched passive followers without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/docs/quickstart");

  const group = page.locator('.st-tab-group[data-docs-tab-group="frontend-prebuilt-ui"]').first();
  const panels = group.locator(":scope > blume-tabs > [data-blume-tab-content] > *");
  await expect(panels).toHaveCount(12);
  await expect(panels.nth(0)).toBeVisible();
  for (let index = 1; index < 12; index += 1) await expect(panels.nth(index)).toBeHidden();
  await expect(panels.nth(0)).toHaveAttribute("data-title", "Reactjs");
  await expect(panels.nth(0)).toHaveAttribute("data-code-option", "package-managers:npm");

  const passiveFollower = page.locator('.st-tab-group[data-docs-tab-passive="true"]').first();
  await expect(passiveFollower.locator('[data-title="Angular"]')).toHaveCount(1);
  await expect(passiveFollower.locator("[data-blume-tablist]")).toBeHidden();
  await expect(passiveFollower).toBeHidden();
  await context.close();
});

test("dependent content shows its first option without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/docs/authentication/ai-authentication");

  const content = page.locator('[data-docs-dependent-content="package-managers"]');
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

  const group = page.locator(".st-tab-group:not([data-docs-tab-group])").first();
  const tablist = group.getByRole("tablist");
  await expect(tablist).toBeVisible();
  await expect(tablist.getByRole("tab")).toHaveText(["Managed service", "Self-hosted"]);
  await expect(group.locator('[role="tabpanel"]:not(.hidden)')).toBeVisible();
  await expect(group.getByRole("combobox")).toHaveCount(0);
});

test("account migration API snippets match the CDI specification", async ({ page }) => {
  await page.goto("/docs/migration/account-migration");

  const snippets = page.locator("[data-api-request-tabs]");
  await expect(snippets).toHaveCount(apiRequestCases.length);

  const ids: string[] = [];
  for (const apiRequest of apiRequestCases) {
    const namespace = snippetNamespace(apiRequest.operationId, apiRequest.snippetId);
    const snippet = snippets.filter({ has: page.locator(`#${namespace}-tab-curl`) });
    const tabs = snippet.getByRole("tab");
    const panels = snippet.locator('[role="tabpanel"]');

    await expect(snippet).toHaveCount(1);
    await expect(tabs).toHaveText(["cURL", "JavaScript / Node.js", "Go", "Python"]);
    await expect(panels).toHaveCount(4);
    await expect(snippet.getByRole("link", { name: "View the full API schema and response details" })).toHaveAttribute(
      "href",
      apiRequest.canonicalPath,
    );

    const languages = [
      { id: "curl", method: `curl -X ${apiRequest.method}` },
      { id: "js", method: `method: "${apiRequest.method}"` },
      { id: "go", method: `http.NewRequest("${apiRequest.method}"` },
      { id: "python", method: `requests.${apiRequest.method.toLowerCase()}(` },
    ] as const;

    for (const language of languages) {
      const tabId = `${namespace}-tab-${language.id}`;
      const panelId = `${namespace}-panel-${language.id}`;
      const tab = snippet.locator(`#${tabId}`);
      const panel = snippet.locator(`#${panelId}`);

      await expect(tab).toHaveAttribute("aria-controls", panelId);
      await expect(panel).toHaveAttribute("aria-labelledby", tabId);
      await expect(page.locator(`#${tabId}`)).toHaveCount(1);
      await expect(page.locator(`#${panelId}`)).toHaveCount(1);
      ids.push(tabId, panelId);

      const code = await panel.locator("code").innerText();
      expect(code).toContain(JSON.stringify(apiRequest.url));
      expect(code).toContain(language.method);
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

    if (apiRequest.method === "POST") {
      const curlCode = await snippet.locator(`#${namespace}-panel-curl code`).innerText();
      expect(curlBody(curlCode)).toEqual(requestExample(apiRequest.path));
    }
  }

  expect(ids).toHaveLength(apiRequestCases.length * 8);
  expect(new Set(ids).size).toBe(ids.length);
});

test("account migration API links open a reusable reference drawer", async ({ page }) => {
  const embedDocumentRequests: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "document" && request.url().includes("/docs/api-reference-embed/")) {
      embedDocumentRequests.push(request.url());
    }
  });
  await page.goto("/docs/migration/account-migration");

  const links = page.getByRole("link", { name: "View the full API schema and response details" });
  const firstLink = links.nth(0);
  const secondLink = links.nth(1);
  const frames = page.locator("[data-api-reference-frame]");
  const pageUrl = page.url();
  const firstUrl = new URL(apiRequestCases[0].canonicalPath, pageUrl).href;
  const secondUrl = new URL(apiRequestCases[1].canonicalPath, pageUrl).href;
  const embedUrls = apiRequestCases.map(
    ({ operationId }) => new URL(`/docs/api-reference-embed/${operationId.toLowerCase()}`, pageUrl).href,
  );
  const [firstEmbedUrl, secondEmbedUrl] = embedUrls;
  const frameFor = (url: string) => page.locator(`[data-api-reference-frame][data-api-reference-url="${url}"]`);
  const expectPreloadedPool = async () => {
    const expected = embedUrls.map((url) => ({ loaded: "true", url })).sort((a, b) => a.url.localeCompare(b.url));
    await expect(frames).toHaveCount(embedUrls.length);
    await expect
      .poll(() =>
        frames.evaluateAll((elements) =>
          elements
            .map((element) => ({
              loaded: (element as HTMLIFrameElement).dataset.loaded,
              url: (element as HTMLIFrameElement).src,
            }))
            .sort((a, b) => a.url.localeCompare(b.url)),
        ),
      )
      .toEqual(expected);
    for (let index = 0; index < embedUrls.length; index += 1) {
      await expect(frames.nth(index)).toBeHidden();
    }
    await expect(page.locator("[data-api-reference-loading]")).toHaveCount(0);
  };
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

  await expect(firstLink).toHaveAttribute("href", apiRequestCases[0].canonicalPath);
  await expect(secondLink).toHaveAttribute("href", apiRequestCases[1].canonicalPath);
  await expectPreloadedPool();
  expect([...embedDocumentRequests].sort()).toEqual([...embedUrls].sort());
  const preloadedRequestCount = embedDocumentRequests.length;
  const firstFrame = frameFor(firstEmbedUrl);
  const secondFrame = frameFor(secondEmbedUrl);

  await firstLink.click();

  await expect(page).toHaveURL(pageUrl);
  const firstDialog = page.getByRole("dialog", { name: "Import one user directly" });
  await expect(firstDialog).toBeVisible();
  await expect(firstFrame).toBeVisible();
  await expect(page.locator("[data-api-reference-frame]:visible")).toHaveCount(1);
  await expect(firstFrame).toHaveAttribute("src", firstEmbedUrl);
  await expect(firstFrame).toHaveAttribute("title", "API reference: Import one user directly");
  await expect(firstDialog.getByRole("link", { name: "Open full page" })).toHaveAttribute("href", firstUrl);
  await expectEmbeddedOperation(firstEmbedUrl, apiRequestCases[0]);
  expect(embedDocumentRequests).toHaveLength(preloadedRequestCount);

  await page.keyboard.press("Escape");
  await expect(firstDialog).toBeHidden();
  await expect(firstLink).toBeFocused();

  for (const modifier of ["ctrlKey", "metaKey"] as const) {
    await firstLink.evaluate((link, key) => {
      window.addEventListener("click", (event) => event.preventDefault(), { once: true });
      link.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0, cancelable: true, [key]: true }));
    }, modifier);
    await expect(firstDialog).toBeHidden();
    await expect(page).toHaveURL(pageUrl);
  }

  await secondLink.click();

  const secondDialog = page.getByRole("dialog", { name: "Add bulk import users" });
  await expect(page.locator("[data-api-reference-drawer]")).toHaveCount(1);
  await expect(secondDialog).toBeVisible();
  await expect(secondFrame).toBeVisible();
  await expect(firstFrame).toBeHidden();
  await expect(page.locator("[data-api-reference-frame]:visible")).toHaveCount(1);
  await expect(secondFrame).toHaveAttribute("src", secondEmbedUrl);
  await expect(secondFrame).toHaveAttribute("title", "API reference: Add bulk import users");
  await expect(secondDialog.getByRole("link", { name: "Open full page" })).toHaveAttribute("href", secondUrl);
  await expectEmbeddedOperation(secondEmbedUrl, apiRequestCases[1]);
  expect(embedDocumentRequests).toHaveLength(preloadedRequestCount);

  await page.keyboard.press("Escape");
  await page.getByRole("link", { name: "Documentation", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/?$/u);
  await page.goBack();
  await expect(page).toHaveURL(pageUrl);
  await expectPreloadedPool();
  const restoredPreloadRequestCount = embedDocumentRequests.length;

  const restoredLink = page.getByRole("link", { name: "View the full API schema and response details" }).first();
  await restoredLink.click();
  await expect(page.locator("[data-api-reference-drawer]")).toHaveCount(1);
  await expect(frameFor(firstEmbedUrl)).toBeVisible();
  await expect(page.locator("[data-api-reference-frame]:visible")).toHaveCount(1);
  expect(embedDocumentRequests).toHaveLength(restoredPreloadRequestCount);
  await expect(page).toHaveURL(pageUrl);
  const restoredDialog = page.getByRole("dialog", { name: "Import one user directly" });
  await expect(restoredDialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(restoredDialog).toBeHidden();
  await expect(restoredLink).toBeFocused();
});

test("account migration API reference drawer fills a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/migration/account-migration");
  await page.getByRole("link", { name: "View the full API schema and response details" }).first().click();

  const dialog = page.getByRole("dialog", { name: "Import one user directly" });
  await expect(dialog).toBeVisible();
  const bounds = await dialog.boundingBox();
  expect(bounds?.x).toBe(0);
  expect(bounds?.width).toBe(390);
});

test("account migration API snippet tabs support keyboard navigation", async ({ page }) => {
  await page.goto("/docs/migration/account-migration");

  const apiRequest = apiRequestCases[0];
  const namespace = snippetNamespace(apiRequest.operationId, apiRequest.snippetId);
  const snippet = page.locator("[data-api-request-tabs]").filter({ has: page.locator(`#${namespace}-tab-curl`) });
  const tab = (language: "curl" | "js" | "go" | "python") => snippet.locator(`#${namespace}-tab-${language}`);
  const panel = (language: "curl" | "js" | "go" | "python") => snippet.locator(`#${namespace}-panel-${language}`);

  const expectActive = async (language: "curl" | "js" | "go" | "python") => {
    await expect(tab(language)).toBeFocused();
    await expect(tab(language)).toHaveAttribute("aria-selected", "true");
    await expect(tab(language)).toHaveAttribute("tabindex", "0");
    await expect(panel(language)).toBeVisible();
    await expect(snippet.getByRole("tab", { selected: true })).toHaveCount(1);
    await expect(snippet.locator('[role="tabpanel"]:visible')).toHaveCount(1);
  };

  await tab("curl").focus();
  await expectActive("curl");

  await page.keyboard.press("ArrowRight");
  await expectActive("js");
  await expect(panel("curl")).toBeHidden();

  await page.keyboard.press("End");
  await expectActive("python");

  await page.keyboard.press("Home");
  await expectActive("curl");

  await page.keyboard.press("ArrowLeft");
  await expectActive("python");

  await page.keyboard.press("ArrowRight");
  await expectActive("curl");
});
