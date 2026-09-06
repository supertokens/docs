import { expect, test, type Locator, type Page } from "@playwright/test";

const customQuickstartQ = "BBJchGkoAC";

test.describe.configure({ mode: "serial" });

function desktopOutline(page: Page): Locator {
  return page.getByRole("navigation", { name: "On this page" });
}

async function expectHeadingBelowHeader(page: Page, heading: Locator): Promise<void> {
  await expect
    .poll(async () => {
      const [headingBox, headerBox] = await Promise.all([
        heading.boundingBox(),
        page.locator("[data-blume-header]").boundingBox(),
      ]);
      return Boolean(
        headingBox &&
          headerBox &&
          headingBox.y >= headerBox.y + headerBox.height &&
          headingBox.y < (page.viewportSize()?.height ?? Number.POSITIVE_INFINITY),
      );
    })
    .toBe(true);
}

async function scrollHeadingToLine(heading: Locator, line = 80): Promise<void> {
  await expect
    .poll(async () => {
      await heading.evaluate((element, targetLine) => {
        scrollTo(0, element.getBoundingClientRect().top + scrollY - targetLine);
      }, line);
      return heading.evaluate((element) => Math.round(element.getBoundingClientRect().top));
    })
    .toBe(line);
}

test("keeps outline geometry stable and anchors below the header across reload and history", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/docs/quickstart");

  const outline = desktopOutline(page);
  const secondLink = outline.locator('a[href="#2-integrate-the-backend-sdk"]');
  const before = await secondLink.boundingBox();
  await expect(secondLink).toHaveCSS("border-left-color", "rgba(0, 0, 0, 0)");

  await secondLink.click();
  await scrollHeadingToLine(page.locator('[id="2-integrate-the-backend-sdk"]'));
  await expect(secondLink).toHaveAttribute("aria-current", "location");
  const after = await secondLink.boundingBox();
  expect({ width: after?.width, x: after?.x }).toEqual({ width: before?.width, x: before?.x });
  await expect(secondLink).not.toHaveCSS("border-left-color", "rgba(0, 0, 0, 0)");

  await page.reload();
  await expect(secondLink).toHaveAttribute("aria-current", "location", { timeout: 15_000 });
  await expectHeadingBelowHeader(page, page.locator('[id="2-integrate-the-backend-sdk"]'));

  const firstLink = outline.locator('a[href="#1-integrate-the-frontend-sdk"]');
  await firstLink.click();
  await scrollHeadingToLine(page.locator('[id="1-integrate-the-frontend-sdk"]'));
  await expect(firstLink).toHaveAttribute("aria-current", "location");
  await page.goBack();
  await expect(secondLink).toHaveAttribute("aria-current", "location", { timeout: 15_000 });
});

test("shows only visible duplicate headings and follows Quickstart selection changes", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/docs/integrations/nextjs/app-directory/init");

  const outline = desktopOutline(page);
  const prebuiltItem = outline.locator('a[href="#1-install-supertokens-package"]').locator("..");
  const customItem = outline.locator('a[href="#1-install-supertokens-package-1"]').locator("..");
  await expect(prebuiltItem).toBeVisible();
  await expect(customItem).toBeHidden();
  await expect(page.locator('[id="1-install-supertokens-package"]')).toHaveCount(1);
  await expect(page.locator('[id="1-install-supertokens-package-1"]')).toHaveCount(1);
  await scrollHeadingToLine(page.locator('[id="1-install-supertokens-package"]'));
  await expect(prebuiltItem.locator("a")).toHaveAttribute("aria-current", "location");

  await page
    .getByRole("group", { name: "UI type" })
    .getByRole("radio", { name: /^Custom UI/ })
    .check({ force: true });
  await expect(prebuiltItem).toBeHidden();
  await expect(customItem).toBeVisible();
  await expect(customItem.locator("a")).toHaveAttribute("aria-current", "location");

  const customLink = outline.locator('a[href="#1-install-supertokens-package-1"]');
  await customLink.click();
  await expect(customLink).toHaveAttribute("aria-current", "location");

  await page.goto(`/docs/quickstart?q=${customQuickstartQ}#custom-ui-install-sdk`);
  await expect(page.locator('[id="prebuilt-ui-install-sdk"]')).toHaveCount(1);
  await expect(page.locator('[id="custom-ui-install-sdk"]')).toHaveCount(1);
  await expect(page.locator("#prebuilt-ui-install-sdk")).toBeHidden();
  await expect(page.locator("#custom-ui-install-sdk")).toBeVisible();
  await expectHeadingBelowHeader(page, page.locator("#custom-ui-install-sdk"));
});

test("recalculates active headings after a size-neutral content mutation", async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 800 });
  await page.goto("/docs/quickstart");

  const outline = desktopOutline(page);
  const firstLink = outline.locator('a[href="#1-integrate-the-frontend-sdk"]');
  const secondLink = outline.locator('a[href="#2-integrate-the-backend-sdk"]');
  const secondHeading = page.locator('[id="2-integrate-the-backend-sdk"]');
  await page.evaluate(() => {
    document.documentElement.style.overflowAnchor = "none";
    document.body.style.overflowAnchor = "none";
    document.querySelectorAll<HTMLElement>("#blume-content *").forEach((element) => {
      element.style.overflowAnchor = "none";
    });
  });
  await secondHeading.evaluate((heading) => {
    const spacer = document.createElement("div");
    spacer.dataset.tocReflowSpacer = "true";
    spacer.style.height = "300px";
    heading.after(spacer);
  });
  await scrollHeadingToLine(secondHeading);
  await expect(secondLink).toHaveAttribute("aria-current", "location");
  await page.evaluate(() => history.replaceState({}, "", `${location.pathname}${location.search}`));

  await secondHeading.evaluate((heading) => {
    const spacer = document.querySelector<HTMLElement>("[data-toc-reflow-spacer]")!;
    heading.before(spacer);
  });
  await expect(firstLink).toHaveAttribute("aria-current", "location");

  await secondHeading.evaluate((heading) => {
    const spacer = document.querySelector<HTMLElement>("[data-toc-reflow-spacer]")!;
    heading.after(spacer);
  });
  await expect(secondLink).toHaveAttribute("aria-current", "location");
});

test("recalculates active headings after viewport resize", async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 800 });
  await page.goto("/docs/quickstart");

  const outline = desktopOutline(page);
  const secondLink = outline.locator('a[href="#2-integrate-the-backend-sdk"]');
  const thirdLink = outline.locator('a[href="#3-configure-the-core-service"]');
  const thirdHeading = page.locator('[id="3-configure-the-core-service"]');
  await page.evaluate(() => {
    document.documentElement.style.overflowAnchor = "none";
    document.body.style.overflowAnchor = "none";
  });
  await thirdHeading.evaluate((heading) => {
    const spacer = document.createElement("div");
    spacer.dataset.tocResizeSpacer = "true";
    spacer.style.height = "calc(2000px - 100vw)";
    heading.before(spacer);
  });
  await scrollHeadingToLine(thirdHeading, 160);
  await expect(thirdLink).toHaveAttribute("aria-current", "location");

  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(secondLink).toHaveAttribute("aria-current", "location");
});

test("uses a stable activation boundary and selects the final visible heading at page end", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/docs/quickstart");

  const outline = desktopOutline(page);
  const firstLink = outline.locator('a[href="#1-integrate-the-frontend-sdk"]');
  const secondLink = outline.locator('a[href="#2-integrate-the-backend-sdk"]');
  const secondHeading = page.locator('[id="2-integrate-the-backend-sdk"]');
  await scrollHeadingToLine(secondHeading, 202);
  await expect(firstLink).toHaveAttribute("aria-current", "location");
  await scrollHeadingToLine(secondHeading, 201);
  await expect(secondLink).toHaveAttribute("aria-current", "location");

  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect(outline.locator('a[href="#next-steps"]')).toHaveAttribute("aria-current", "location");
});

test("reinitializes one working outline across repeated Astro client navigations", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/docs/quickstart");
  await page.evaluate(() => {
    (window as Window & { tocNavigationMarker?: string }).tocNavigationMarker = "preserved";
  });

  for (let index = 0; index < 2; index += 1) {
    await page.getByRole("link", { name: "Documentation", exact: true }).click();
    await expect(page).toHaveURL(/\/docs\/?$/u);
    expect(await page.evaluate(() => (window as Window & { tocNavigationMarker?: string }).tocNavigationMarker)).toBe(
      "preserved",
    );

    await page.goBack();
    await expect(page).toHaveURL(/\/docs\/quickstart/u);
    const outline = desktopOutline(page);
    await expect(outline.locator('a[href="#overview"]')).toHaveAttribute("aria-current", "location");
    await expect(outline.locator('a[aria-current="location"]')).toHaveCount(1);
  }
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`keeps depth hierarchy distinguishable and WCAG AA in ${colorScheme} mode`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ colorScheme });
    await page.goto("/docs/quickstart");

    const result = await desktopOutline(page).evaluate((outline) => {
      const depth2 = outline.querySelector<HTMLElement>('[data-depth="2"] a:not([aria-current])')!;
      const depth3 = outline.querySelector<HTMLElement>('[data-depth="3"] a')!;
      const active = outline.querySelector<HTMLElement>('a[aria-current="location"]')!;
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const context = canvas.getContext("2d")!;
      const rgb = (color: string) => {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        return [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
      };
      const luminance = (color: string) => {
        const linear = rgb(color).map((channel) => {
          const value = channel / 255;
          return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
      };
      const depth2Style = getComputedStyle(depth2);
      const depth3Style = getComputedStyle(depth3);
      const background = luminance(getComputedStyle(document.body).backgroundColor);
      const contrast = (color: string) => {
        const foreground = luminance(color);
        return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
      };

      return {
        activeBorderColor: getComputedStyle(active).borderLeftColor,
        depth2Color: depth2Style.color,
        depth2Contrast: contrast(depth2Style.color),
        depth2X: depth2.getBoundingClientRect().x,
        depth3Color: depth3Style.color,
        depth3Contrast: contrast(depth3Style.color),
        depth3X: depth3.getBoundingClientRect().x,
      };
    });

    expect(result.depth2Contrast).toBeGreaterThanOrEqual(4.5);
    expect(result.depth3Contrast).toBeGreaterThanOrEqual(4.5);
    expect(result.depth3X).toBeGreaterThan(result.depth2X);
    expect(result.depth3Color).not.toBe(result.depth2Color);
    expect(result.activeBorderColor).not.toBe("rgba(0, 0, 0, 0)");
  });
}

test("mobile outline excludes hidden headings and uses the same anchor offset", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/integrations/nextjs/app-directory/init");

  const outline = page.locator("details[data-st-toc]");
  await outline.locator("summary").click();
  await expect(outline.locator('a[href="#1-install-supertokens-package"]')).toBeVisible();
  await expect(outline.locator('a[href="#1-install-supertokens-package-1"]')).toBeHidden();

  const target = outline.locator('a[href="#2-create-configuration-files"]');
  await target.click();
  await expectHeadingBelowHeader(page, page.locator('[id="2-create-configuration-files"]'));
  await scrollHeadingToLine(page.locator('[id="2-create-configuration-files"]'));
  const activeLink = outline.locator('a[href="#2-create-configuration-files"]');
  await expect(activeLink).toHaveAttribute("aria-current", "location");
  await expect(activeLink).not.toHaveCSS("border-left-color", "rgba(0, 0, 0, 0)");
});
