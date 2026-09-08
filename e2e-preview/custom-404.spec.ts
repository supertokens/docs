import { expect, test } from "@playwright/test";

test("serves a functional custom recovery page with HTTP 404 semantics", async ({ page, request }) => {
  const response = await page.goto("/docs/__preview-custom-404-test__?secret=not-reported");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  await expect(page.getByRole("link", { name: "Docs home" })).toHaveAttribute("href", "/docs");
  await expect(page.getByRole("link", { name: "Quickstart" })).toHaveAttribute("href", "/docs/quickstart");

  const reportUrl = new URL((await page.getByRole("link", { name: "Report the broken link" }).getAttribute("href"))!);
  expect(reportUrl.searchParams.get("body")).toBe("Broken URL: /docs/__preview-custom-404-test__");
  expect(reportUrl.toString()).not.toContain("not-reported");

  await page.getByRole("button", { name: "Search docs" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Search docs" })).toBeFocused();

  const head = await request.head("/docs/__preview-custom-404-head-test__");
  expect(head.status()).toBe(404);
  expect(await head.body()).toHaveLength(0);
});
