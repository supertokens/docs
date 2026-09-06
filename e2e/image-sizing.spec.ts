import { expect, test, type Locator, type Page } from "@playwright/test";

interface ImageMetrics {
  availableWidth: number;
  documentClientWidth: number;
  documentScrollWidth: number;
  naturalHeight: number;
  naturalWidth: number;
  renderedHeight: number;
  renderedWidth: number;
}

const imageMetrics = async (image: Locator): Promise<ImageMetrics> =>
  image.evaluate((element) => {
    if (!(element instanceof HTMLImageElement)) throw new Error("Expected an image element");
    const parent = element.parentElement;
    if (!parent) throw new Error("Expected the image to have a parent element");
    const parentStyle = getComputedStyle(parent);
    const rect = element.getBoundingClientRect();

    return {
      availableWidth:
        parent.clientWidth - Number.parseFloat(parentStyle.paddingLeft) - Number.parseFloat(parentStyle.paddingRight),
      documentClientWidth: document.documentElement.clientWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      naturalHeight: element.naturalHeight,
      naturalWidth: element.naturalWidth,
      renderedHeight: rect.height,
      renderedWidth: rect.width,
    };
  });

const expectResponsiveImage = async (page: Page, image: Locator, fillsContainer: boolean): Promise<ImageMetrics> => {
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete)).toBe(true);

  const metrics = await imageMetrics(image);
  expect(metrics.naturalWidth).toBeGreaterThan(0);
  expect(metrics.naturalHeight).toBeGreaterThan(0);
  expect(metrics.renderedWidth).toBeLessThanOrEqual(metrics.availableWidth + 1);
  expect(metrics.documentScrollWidth).toBeLessThanOrEqual(metrics.documentClientWidth);
  expect(metrics.renderedWidth / metrics.renderedHeight).toBeCloseTo(metrics.naturalWidth / metrics.naturalHeight, 2);
  if (fillsContainer) expect(metrics.renderedWidth).toBeCloseTo(metrics.availableWidth, 0);
  await expect(page.locator("html")).not.toHaveCSS("overflow-x", "scroll");

  return metrics;
};

const expectStandardSpacing = async (image: Locator): Promise<void> => {
  const spacing = await image.evaluate((element) => {
    const frame = element.closest("blume-frame");
    const target = frame ?? element;
    const style = getComputedStyle(target);
    return {
      hasFrame: Boolean(frame),
      isInTabs: Boolean(element.closest("blume-tabs")),
      imageMarginBottom: getComputedStyle(element).marginBottom,
      imageMarginTop: getComputedStyle(element).marginTop,
      marginBottom: style.marginBottom,
      marginTop: style.marginTop,
    };
  });

  if (spacing.hasFrame) {
    expect(spacing.imageMarginTop).toBe("0px");
    expect(spacing.imageMarginBottom).toBe("0px");
    if (!spacing.isInTabs) {
      expect(spacing.marginTop).toBe("24px");
      expect(spacing.marginBottom).toBe("24px");
    }
  } else {
    expect(spacing.marginTop).toBe("24px");
    expect(spacing.marginBottom).toBe("24px");
  }
};

test("content-width diagrams stay responsive and comparable", async ({ page }) => {
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/docs");

    const managed = page.getByAltText("Flowchart of the SuperTokens managed service architecture");
    await expect(managed).toHaveClass(/\bdocs-image-content-width\b/u);
    const managedMetrics = await expectResponsiveImage(page, managed, true);
    await expectStandardSpacing(managed);

    await page.getByRole("tab", { name: "Self-hosted" }).click();
    const selfHosted = page.getByAltText("Flowchart of the self-hosted SuperTokens architecture");
    await expect(selfHosted).toHaveClass(/\bdocs-image-content-width\b/u);
    const selfHostedMetrics = await expectResponsiveImage(page, selfHosted, true);
    await expectStandardSpacing(selfHosted);

    expect(selfHostedMetrics.renderedWidth).toBeCloseTo(managedMetrics.renderedWidth, 0);

    await page.goto("/docs/post-authentication/session-management/introduction");
    const sessionFlow = page.getByAltText("Flowcharts showing an overview of session flow");
    await expect(sessionFlow).toHaveClass(/\bdocs-image-content-width\b/u);
    await expectResponsiveImage(page, sessionFlow, true);
    await expectStandardSpacing(sessionFlow);

    await page.goto("/docs/post-authentication/dashboard/tenant-management");
    const dashboard = page.getByAltText("Tenant Management Landing");
    await expect(dashboard).toHaveClass(/\bdocs-image-content-width\b/u);
    await expectResponsiveImage(page, dashboard, true);
    await expectStandardSpacing(dashboard);
  }
});

test("explicitly constrained UI captures do not stretch", async ({ page }) => {
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/docs/authentication/email-password/password-reset");

    const email = page.getByAltText("Email UI for password reset email");
    await expect(email).not.toHaveClass(/docs-image-content-width/u);
    const metrics = await expectResponsiveImage(page, email, false);
    expect(metrics.renderedWidth).toBeLessThanOrEqual(450);
    if (width === 1280) expect(metrics.renderedWidth).toBeLessThan(metrics.availableWidth);
  }
});
