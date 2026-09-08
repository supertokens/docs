import { expect, test } from "@playwright/test";

test("unknown routes render the custom recovery page with 404 semantics", async ({ page, request }) => {
  const missingPath = "/docs/__custom-404-test__?source=e2e";
  const response = await page.goto(missingPath, {
    referer: "http://127.0.0.1:4322/docs/quickstart?step=2#backend",
  });

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  await expect(page.getByRole("link", { name: "Docs home" })).toHaveAttribute("href", "/docs");
  await expect(page.getByRole("link", { name: "Quickstart" })).toHaveAttribute("href", "/docs/quickstart");

  const report = page.getByRole("link", { name: "Report the broken link" });
  const reportUrl = new URL((await report.getAttribute("href"))!);
  expect(reportUrl.origin + reportUrl.pathname).toBe("https://github.com/supertokens/docs/issues/new");
  await expect(report).not.toHaveAttribute("target", "_blank");
  expect(reportUrl.searchParams.get("body")).toBe("Broken URL: /docs/__custom-404-test__\nReferrer: /docs/quickstart");
  expect(reportUrl.searchParams.get("body")).not.toMatch(/[?#]/u);

  await page.getByRole("button", { name: "Search docs" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Search docs" })).toBeFocused();

  const head = await request.head("/docs/__custom-404-head-test__");
  expect(head.status()).toBe(404);
  expect(await head.body()).toHaveLength(0);
});

test("the recovery page remains usable at narrow widths", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/docs/__custom-404-mobile-test__");

  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  for (const control of [
    page.getByRole("button", { name: "Search docs" }),
    page.getByRole("link", { name: "Docs home" }),
    page.getByRole("link", { name: "Quickstart" }),
  ]) {
    expect((await control.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  }
});
