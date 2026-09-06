import { expect, test, type Page } from "@playwright/test";

const prebuiltQ = "BDzLeotAB";
const backendQ = "BBCoVXf-AB";
const customQ = "BBJchGkoAC";
const newAnchorIds = [
  "prebuilt-ui-install-sdk",
  "prebuilt-angular-auth-route",
  "custom-ui-install-sdk",
  "custom-ui-ios-cocoapods",
  "backend-install-sdk",
  "backend-python-django-cors",
] as const;
const legacyAnchorIds = [
  "1-integrate-the-frontend-sdk",
  "2-integrate-the-backend-sdk",
  "3-configure-the-core-service",
] as const;

function quickstartDeepLink(q: string, hash: string): string {
  return `/docs/quickstart?campaign=c1&q=${q}#${hash}`;
}

async function expectAnchoredHeading(page: Page, id: string): Promise<void> {
  const heading = page.locator(`h2[id="${id}"], h3[id="${id}"], h4[id="${id}"], h5[id="${id}"], h6[id="${id}"]`);
  await expect(heading).toHaveCount(1);
  await expect(heading).toBeVisible();
  await expect(heading).toBeInViewport();
  await expect
    .poll(async () => {
      const headingBox = await heading.boundingBox();
      const headerBox = await page.locator("[data-blume-header]").boundingBox();
      return Boolean(headingBox && headerBox && headingBox.y >= headerBox.y + headerBox.height);
    })
    .toBe(true);
}

async function expectCompleteCustomSelection(page: Page): Promise<void> {
  await expect(page.getByRole("group", { name: "UI type" }).getByRole("radio", { name: /^Custom UI/ })).toBeChecked();
  await expect(page.getByRole("combobox", { name: "Platform" }).first()).toContainText("Mobile");
  await expect(page.getByRole("combobox", { name: "Mobile framework" }).first()).toContainText("iOS");
  await expect(page.getByRole("combobox", { name: "Language" }).first()).toContainText("Python");
  await expect(page.getByRole("combobox", { name: "Python framework" }).first()).toContainText("Django");
  await expect(page.getByRole("combobox", { name: "Package manager", includeHidden: true }).first()).toContainText(
    "pnpm",
  );
}

test("state-bearing nested links survive reload, a fresh context, and browser history", async ({ browser, page }) => {
  test.setTimeout(60_000);
  await page.goto(quickstartDeepLink(prebuiltQ, "prebuilt-angular-auth-route"));
  await expectAnchoredHeading(page, "prebuilt-angular-auth-route");
  await expect(
    page.locator(
      '[data-docs-selection-group="frontend-prebuilt-ui"] [data-tab-id="angular"]:not(.hidden) [data-code-option="package-managers:pnpm"]',
    ),
  ).toBeVisible();
  const frontendUrl = page.url();

  await page.goto(quickstartDeepLink(backendQ, "backend-python-django-cors"));
  await expectAnchoredHeading(page, "backend-python-django-cors");
  const backendUrl = page.url();

  await page.goto(quickstartDeepLink(customQ, "custom-ui-ios-cocoapods"));
  await expectAnchoredHeading(page, "custom-ui-ios-cocoapods");
  await expectCompleteCustomSelection(page);
  const sharedUrl = page.url();

  await page.evaluate(() => {
    localStorage.setItem("supertokens-docs:selection:backend-language", "nodejs");
    localStorage.setItem("supertokens-docs:selection:python-frameworks", "fastapi");
    localStorage.setItem("supertokens-docs:selection:frontend-custom-ui", "web");
    localStorage.setItem("supertokens-docs:selection:mobile-frameworks", "android");
    localStorage.setItem("supertokens-docs:selection:package-managers", "npm");
    localStorage.setItem("supertokens-docs:ui-type", "prebuilt");
  });
  await page.reload();
  await expectAnchoredHeading(page, "custom-ui-ios-cocoapods");
  await expectCompleteCustomSelection(page);

  for (const id of [...newAnchorIds, ...legacyAnchorIds]) {
    await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  }

  const freshContext = await browser.newContext();
  try {
    const freshPage = await freshContext.newPage();
    await freshPage.goto(sharedUrl);
    await expectAnchoredHeading(freshPage, "custom-ui-ios-cocoapods");
    await expectCompleteCustomSelection(freshPage);
  } finally {
    await freshContext.close();
  }

  await page.goBack();
  await expect(page).toHaveURL(backendUrl);
  await expectAnchoredHeading(page, "backend-python-django-cors");
  await page.goBack();
  await expect(page).toHaveURL(frontendUrl);
  await expectAnchoredHeading(page, "prebuilt-angular-auth-route");
  await page.goForward();
  await expect(page).toHaveURL(backendUrl);
  await page.goForward();
  await expect(page).toHaveURL(sharedUrl);
  await expectAnchoredHeading(page, "custom-ui-ios-cocoapods");
});

test("same-document popstate reveals a selection-hidden hash target", async ({ page }) => {
  await page.goto(`/docs/quickstart?q=${prebuiltQ}`);
  const target = page.locator("#custom-ui-ios-cocoapods");
  await expect(target).toBeHidden();

  await page.evaluate((q) => {
    history.pushState({}, "", `?q=${q}#custom-ui-ios-cocoapods`);
    dispatchEvent(new PopStateEvent("popstate"));
  }, customQ);

  await expectAnchoredHeading(page, "custom-ui-ios-cocoapods");
});

test("popstate preserves a saved scroll position when its hash target was already visible", async ({ page }) => {
  await page.goto(quickstartDeepLink(prebuiltQ, "prebuilt-ui-install-sdk"));
  await expectAnchoredHeading(page, "prebuilt-ui-install-sdk");
  const savedY = await page.evaluate(() => {
    const target = document.getElementById("prebuilt-ui-install-sdk");
    if (!target) throw new Error("Missing prebuilt install heading");
    const y = target.offsetTop + 500;
    scrollTo(0, y);
    return scrollY;
  });
  await page.waitForTimeout(100);
  await page.evaluate(({ hash, q }) => history.pushState({}, "", `/docs/quickstart?campaign=c1&q=${q}#${hash}`), {
    hash: "prebuilt-ui-install-sdk",
    q: backendQ,
  });
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight - innerHeight));

  await page.goBack();

  await expect.poll(async () => Math.abs((await page.evaluate(() => scrollY)) - savedY)).toBeLessThan(20);
});

for (const [legacyPath, hash] of [
  ["frontend-setup", "#1-integrate-the-frontend-sdk"],
  ["backend-setup", "#2-integrate-the-backend-sdk"],
  ["next-steps", "#3-configure-the-core-service"],
] as const) {
  test(`preserves query state through the quickstart ${legacyPath} redirect`, async ({ page }) => {
    const source = `/docs/quickstart/${legacyPath}?campaign=c1&q=${prebuiltQ}`;
    const response = await page.request.get(source, { maxRedirects: 0 });
    const location = new URL(response.headers().location, "http://127.0.0.1:4322");
    expect(location.pathname).toBe("/docs/quickstart");
    expect(location.searchParams.get("campaign")).toBe("c1");
    expect(location.searchParams.get("q")).toBe(prebuiltQ);
    expect(location.hash).toBe(hash);

    await page.goto(source);
    const url = new URL(page.url());
    expect(url.pathname).toBe("/docs/quickstart");
    expect(url.searchParams.get("campaign")).toBe("c1");
    expect(url.hash).toBe(hash);
    await expectAnchoredHeading(page, hash.slice(1));
  });
}

test("preserves query state through the legacy example applications redirect", async ({ page }) => {
  const source = `/docs/quickstart/example-applications?campaign=c1&q=${prebuiltQ}`;
  const response = await page.request.get(source, { maxRedirects: 0 });
  const location = new URL(response.headers().location, "http://127.0.0.1:4322");
  expect(location.pathname).toBe("/docs/quickstart");
  expect(location.searchParams.get("campaign")).toBe("c1");
  expect(location.searchParams.get("q")).toBe(prebuiltQ);

  await page.goto(source);
  const url = new URL(page.url());
  expect(url.pathname).toBe("/docs/quickstart");
  expect(url.searchParams.get("campaign")).toBe("c1");
});

test("returns a client error for a malformed encoded filesystem path", async ({ page }) => {
  const response = await page.request.get("/docs/%E0%A4%A", { maxRedirects: 0 });
  expect(response.status()).toBe(400);
});
