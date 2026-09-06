import { expect, test, type Locator, type Page } from "@playwright/test";

const mobileViewports = [
  { height: 568, width: 320 },
  { height: 844, width: 390 },
] as const;

const expectMinimumTarget = async (control: Locator) => {
  const box = await control.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.height).toBeGreaterThanOrEqual(44);
  expect(box!.width).toBeGreaterThanOrEqual(44);
};

const tabTo = async (page: Page, control: Locator) => {
  const hasPreviousControl = await control.evaluate((element) => {
    const focusable = [
      ...document.querySelectorAll<HTMLElement>("a[href], button, input, select, textarea, [tabindex]"),
    ].filter((candidate) => candidate.tabIndex >= 0 && candidate.getClientRects().length > 0);
    const previous = focusable[focusable.indexOf(element as HTMLElement) - 1];
    previous?.focus();
    return Boolean(previous);
  });
  expect(hasPreviousControl).toBe(true);
  await page.keyboard.press("Tab");
  await expect(control).toBeFocused();
};

const expectTooltipInteractions = async (page: Page, control: Locator, label: string) => {
  const tooltip = page.getByRole("tooltip", { name: label });
  await control.hover();
  await expect(tooltip).toBeVisible();
  await tooltip.hover();
  await expect(tooltip).toBeVisible();

  const controlBox = await control.boundingBox();
  const tooltipBox = await tooltip.boundingBox();
  expect(controlBox).not.toBeNull();
  expect(tooltipBox).not.toBeNull();
  expect(tooltipBox!.x).toBeGreaterThanOrEqual(0);
  expect(tooltipBox!.x + tooltipBox!.width).toBeLessThanOrEqual((await page.viewportSize())!.width);
  expect(tooltipBox!.y).toBeGreaterThanOrEqual(0);
  expect(tooltipBox!.y + tooltipBox!.height).toBeLessThanOrEqual((await page.viewportSize())!.height);
  expect(tooltipBox!.y).toBeGreaterThanOrEqual(controlBox!.y + controlBox!.height);

  await page.mouse.move(0, 0);
  await expect(tooltip).toBeHidden();
  await tabTo(page, control);
  await expect(tooltip).toBeVisible();
  const focusIndicator = await control.evaluate((element) => {
    const style = getComputedStyle(element);
    return { outlineStyle: style.outlineStyle, outlineWidth: Number.parseFloat(style.outlineWidth) };
  });
  expect(focusIndicator.outlineStyle).not.toBe("none");
  expect(focusIndicator.outlineWidth).toBeGreaterThanOrEqual(2);

  await page.keyboard.press("Escape");
  await expect(control).toBeFocused();
  await expect(tooltip).toBeHidden();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(control).toBeFocused();
  await expect(tooltip).toBeVisible();
};

for (const viewport of mobileViewports) {
  test(`mobile search controls and expanded filters remain usable at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/docs");

    const dashboard = page.getByRole("link", { name: "Go to SuperTokens Dashboard", exact: true });
    const searchButton = page.getByRole("button", { name: "Search", exact: true });
    await expectMinimumTarget(dashboard);
    await expectMinimumTarget(searchButton);
    await expectTooltipInteractions(page, dashboard, "Dashboard");
    await expectTooltipInteractions(page, searchButton, "Search");
    await expect(page.getByRole("tooltip", { name: "Search" })).toHaveText(
      await searchButton.getAttribute("aria-label"),
    );

    await searchButton.click();
    const dialog = page.getByRole("dialog");
    const dialogBox = await dialog.boundingBox();
    expect(dialogBox).not.toBeNull();
    expect(dialogBox!.x).toBe(0);
    expect(dialogBox!.width).toBe(viewport.width);
    const input = dialog.getByRole("combobox", { name: "Search docs" });
    await input.fill("session");

    const filters = dialog.locator("[data-blume-search-filters]");
    const pills = filters.locator("button:not([data-st-filter-disclosure])");
    const more = filters.getByRole("button", { name: "Show more search filters" });
    await expect(more).toBeVisible();
    const initiallyVisibleLabels = await pills.locator(":visible").allTextContents();
    expect(initiallyVisibleLabels).toHaveLength(4);
    await expect(filters).toHaveCSS("overflow-y", "visible");
    await expect(filters).toHaveCSS("overflow-x", "visible");

    await more.click();
    await expect(filters.getByRole("button", { name: "Show fewer search filters" })).toBeFocused();
    await expect(pills.locator(":visible")).toHaveCount(await pills.count());
    expect(await filters.evaluate((element) => element.scrollHeight <= element.clientHeight)).toBe(true);
    expect(await filters.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);

    const results = dialog.locator("[data-blume-search-results]");
    const resultsBox = await results.boundingBox();
    expect(resultsBox).not.toBeNull();
    expect(resultsBox!.height).toBeGreaterThanOrEqual(128);
    const activeLaterLabel = (await pills.nth(4).innerText()).trim();
    await pills.nth(4).click();
    await expect(filters.getByRole("button", { name: "Show more search filters" })).toBeVisible();
    await expect(input).toBeFocused();
    expect(await pills.locator(":visible").count()).toBeLessThanOrEqual(4);
    const selectedLaterFilter = pills.filter({ hasText: activeLaterLabel }).first();
    await expect(selectedLaterFilter).toBeVisible();
    await expect(selectedLaterFilter).toHaveAttribute("aria-pressed", "true");
    await filters.getByRole("button", { name: "Show more search filters" }).click();
    await expect(filters.getByRole("button", { name: "Show fewer search filters" })).toBeVisible();
    await expect(pills.locator(":visible")).toHaveCount(await pills.count());

    await input.focus();
    const previousActiveDescendant = await input.getAttribute("aria-activedescendant");
    expect(previousActiveDescendant).toBeTruthy();
    await input.press("ArrowDown");
    const activeDescendant = await input.getAttribute("aria-activedescendant");
    expect(activeDescendant).toBeTruthy();
    expect(activeDescendant).not.toBe(previousActiveDescendant);
    const selectedResult = dialog.locator(`#${activeDescendant}`);
    await expect(selectedResult).toHaveAttribute("aria-selected", "true");
    await expect(selectedResult).toBeVisible();
    await expect(selectedResult).toBeInViewport();
    const destination = await selectedResult.getAttribute("href");
    expect(destination).toBeTruthy();
    const expectedUrl = new URL(destination!, page.url());
    await input.press("Enter");
    await expect
      .poll(() => new URL(page.url()).pathname.replace(/\/$/u, ""))
      .toBe(expectedUrl.pathname.replace(/\/$/u, ""));
  });
}
