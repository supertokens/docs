import { expect, test as base } from "@playwright/test";

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
  await expect(dialog.getByText("Overview", { exact: true })).toHaveCount(1);
  await expect(dialog.getByText("References", { exact: true })).toBeVisible();
});

test("backend language tabs expose the active framework as a compact select", async ({ page }) => {
  await page.goto("/docs/quickstart/backend-setup");

  const sectionHeading = page.getByRole("heading", {
    name: /3\. Add the SuperTokens APIs and Configure CORS/,
  });
  const languageGroup = sectionHeading
    .locator("~ div")
    .filter({ has: page.getByRole("tablist") })
    .first();
  const languageTabs = languageGroup.getByRole("tablist");
  const directLanguageTabs = languageTabs.locator(":scope > [role='tab']");

  await expect(directLanguageTabs).toHaveCount(3);
  await expect(directLanguageTabs).toHaveText(["Node.js", "Go", "Python"]);

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
    const tab = group.querySelector<HTMLElement>("[role='tab']");
    const select = group.querySelector<HTMLElement>("[role='combobox']");
    if (!tab || !select) throw new Error("Expected a language tab and framework select");

    const tabStyles = getComputedStyle(tab);
    const selectStyles = getComputedStyle(select);
    return {
      select: {
        backgroundColor: selectStyles.backgroundColor,
        borderStyle: selectStyles.borderStyle,
        borderWidth: selectStyles.borderWidth,
        fontSize: selectStyles.fontSize,
        fontWeight: selectStyles.fontWeight,
      },
      tab: {
        fontSize: tabStyles.fontSize,
        fontWeight: tabStyles.fontWeight,
      },
    };
  });
  expect(controlStyles.select).toMatchObject({
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderStyle: "none",
    borderWidth: "0px",
    fontSize: controlStyles.tab.fontSize,
    fontWeight: controlStyles.tab.fontWeight,
  });

  await nodeFramework.click();
  await page.getByRole("option", { name: "Fastify", exact: true }).click();

  const nodeFrameworkContent = languageGroup.locator('[data-docs-dependent-content="node-frameworks"]');
  await expect(nodeFrameworkContent.locator('[data-selection-value="fastify"]')).toBeVisible();
  await expect(nodeFrameworkContent.locator('[data-selection-value="express"]')).toBeHidden();

  await languageTabs.getByRole("tab", { name: "Go", exact: true }).click();
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

test("custom frontend setup uses Web and Mobile tabs with dependent selects", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("supertokens-docs:platform-type", "mobile"));
  await page.goto("/docs/quickstart/frontend-setup");

  const uiType = page.getByRole("group", { name: "UI type" });
  await uiType.getByRole("radio", { name: /^Custom UI/ }).click();

  const customFlow = page.locator('[data-variant-content="ui-type"][data-variant-value="custom"]');
  const installHeading = customFlow.getByRole("heading", { name: /1\. Install the SDK/ });
  const platformGroup = installHeading
    .locator("~ .st-tab-group")
    .filter({ has: page.getByRole("tablist") })
    .first();
  const platformTabs = platformGroup.getByRole("tablist");
  const directPlatformTabs = platformTabs.locator(":scope > [role='tab']");

  await expect(directPlatformTabs).toHaveCount(2);
  await expect(directPlatformTabs).toHaveText(["Web", "Mobile"]);
  await expect(platformTabs.getByRole("tab", { name: "Mobile", exact: true })).toHaveAttribute("aria-selected", "true");
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

  await platformTabs.getByRole("tab", { name: "Web", exact: true }).click();
  await expect(platformGroup.getByRole("combobox", { name: "Installation method" })).toBeVisible();
  await expect(platformGroup.getByRole("combobox", { name: "Mobile framework" })).toBeHidden();

  const nextPlatformGroup = customFlow.locator('[data-docs-tab-group="frontend-custom-ui"]').nth(1);
  await expect(nextPlatformGroup.getByRole("tab", { name: "Web", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});
