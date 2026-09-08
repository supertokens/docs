import { expect, test, type Locator, type Page } from "@playwright/test";

const capabilities = [
  {
    destinationHeading: "Multi-Factor Authentication",
    destinationText: /requires users to verify their identity through multiple forms of credentials/,
    name: /Multi-factor authentication/,
    path: "/docs/additional-verification/mfa/introduction",
  },
  {
    destinationHeading: "Introduction",
    destinationText: /Attack Protection Suite.*identifies and prevents suspicious activities/,
    name: /Attack Protection Suite/,
    path: "/docs/additional-verification/attack-protection-suite/introduction",
  },
  {
    destinationHeading: "Introduction",
    destinationText: /covers enterprise authentication scenarios through the multi-tenancy feature/,
    name: /Enterprise login and multitenancy/,
    path: "/docs/authentication/enterprise/introduction",
  },
] as const;

const cardFor = (page: Page, path: string): Locator => page.locator(`[data-blume-card][href="${path}"]`);

test("capability cards expose unique destinations and support keyboard activation", async ({ page }) => {
  await page.goto("/docs");

  const heading = page.getByRole("heading", { level: 2, name: "Explore capabilities" });
  const nextHeading = page.getByRole("heading", { level: 2, name: "Next steps" });

  await expect(heading).toBeVisible();
  await expect(nextHeading).toBeVisible();
  for (const capability of capabilities) {
    const card = cardFor(page, capability.path);
    await expect(card).toHaveCount(1);
    await expect(card).toHaveAccessibleName(capability.name);
    await expect(card).toHaveAttribute("href", capability.path);
    expect(await card.evaluate((link) => link.tabIndex)).toBeGreaterThanOrEqual(0);
  }

  const sectionBounds = await Promise.all(
    [heading, nextHeading].map((element) => element.evaluate((node) => node.offsetTop)),
  );
  const destinations: string[] = [];
  for (const capability of capabilities) {
    const card = cardFor(page, capability.path);
    const cardTop = await card.evaluate((element) => element.offsetTop);
    expect(cardTop).toBeGreaterThan(sectionBounds[0]);
    expect(cardTop).toBeLessThan(sectionBounds[1]);
    destinations.push(await card.evaluate((link: HTMLAnchorElement) => new URL(link.href).pathname));
  }
  expect(new Set(destinations)).toEqual(new Set(capabilities.map(({ path }) => path)));
  expect(new Set(destinations).size).toBe(capabilities.length);

  const expectedPaths = new Set(capabilities.map(({ path }) => path));
  const naturallyFocusedPaths = new Set<string>();
  let activatedPath = "";
  for (let tabs = 0; tabs < 200 && naturallyFocusedPaths.size < expectedPaths.size; tabs += 1) {
    await page.keyboard.press("Tab");
    const focusedPath = await page.evaluate(() => {
      const href = document.activeElement instanceof HTMLAnchorElement ? document.activeElement.href : undefined;
      return href ? new URL(href).pathname : undefined;
    });
    if (!focusedPath || !expectedPaths.has(focusedPath)) continue;

    activatedPath = focusedPath;
    naturallyFocusedPaths.add(focusedPath);
    const focusedCard = cardFor(page, focusedPath);
    const focusPresentation = await focusedCard.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        focusVisible: element.matches(":focus-visible"),
        hasIndicator:
          (style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) > 0) || style.boxShadow !== "none",
        tabIndex: element.tabIndex,
      };
    });
    expect(focusPresentation).toEqual({ focusVisible: true, hasIndicator: true, tabIndex: 0 });
  }

  expect(naturallyFocusedPaths).toEqual(expectedPaths);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(new RegExp(`${activatedPath}/?$`, "u"));
});

test("capability destinations load their expected content", async ({ page }) => {
  for (const capability of capabilities) {
    const response = await page.goto(capability.path);
    expect(response?.ok()).toBe(true);
    await expect(page.getByRole("heading", { level: 1, name: capability.destinationHeading })).toBeVisible();
    await expect(page.getByText(capability.destinationText).first()).toBeVisible();
  }
});

test("capability cards adapt without overflow at narrow widths", async ({ page }) => {
  for (const width of [320, 640, 768]) {
    await page.setViewportSize({ width, height: 700 });
    await page.goto("/docs");

    const layout = await page.evaluate(
      (paths) => {
        const documentWidth = document.documentElement.clientWidth;
        const cards = paths.map((path) => {
          const card = document.querySelector<HTMLElement>(`[data-blume-card][href="${path}"]`);
          if (!card) throw new Error(`Missing capability card for ${path}`);
          const { bottom, left, right, top } = card.getBoundingClientRect();
          return { bottom, left, right, top };
        });
        return { cards, documentScrollWidth: document.documentElement.scrollWidth, documentWidth };
      },
      capabilities.map(({ path }) => path),
    );

    expect(layout.documentScrollWidth).toBeLessThanOrEqual(layout.documentWidth);
    for (const card of layout.cards) {
      expect(card.left).toBeGreaterThanOrEqual(0);
      expect(card.right).toBeLessThanOrEqual(layout.documentWidth);
    }

    for (const [index, card] of layout.cards.entries()) {
      for (const other of layout.cards.slice(index + 1)) {
        const overlaps =
          card.left < other.right && card.right > other.left && card.top < other.bottom && card.bottom > other.top;
        expect(overlaps).toBe(false);
      }
    }

    const rowPositions = new Set(layout.cards.map(({ top }) => Math.round(top)));
    expect(rowPositions.size).toBe(width === 320 ? capabilities.length : 1);
  }
});
