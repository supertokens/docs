import { expect, test, type Locator } from "@playwright/test";

const themes = ["light", "dark"] as const;
const viewports = [320, 390, 1024, 1280] as const;

type Rgb = [number, number, number];

const contrastRatio = (foreground: Rgb, background: Rgb): number => {
  const luminance = (color: Rgb): number => {
    const linear = color.map((channel) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const values = [luminance(foreground), luminance(background)].sort((left, right) => right - left);
  return (values[0] + 0.05) / (values[1] + 0.05);
};

const colors = async (element: Locator): Promise<{ background: Rgb; foreground: Rgb }> =>
  element.evaluate((node) => {
    const style = getComputedStyle(node);
    const context = document.createElement("canvas").getContext("2d");
    if (!context) throw new Error("Canvas context unavailable");
    const opaqueChannels = (color: string): [number, number, number] => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;
      if (alpha !== 255) throw new Error(`Contrast test requires an opaque color, received ${color}`);
      return [red, green, blue];
    };
    return { background: opaqueChannels(style.backgroundColor), foreground: opaqueChannels(style.color) };
  });

test("A1-A5 theme tokens, fonts, header, and Dashboard treatment stay consistent", async ({ page }) => {
  for (const theme of themes) {
    await page.emulateMedia({ colorScheme: theme });
    for (const width of viewports) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/docs/quickstart");

      const root = page.locator("html");
      const body = page.locator("body");
      const heading = page.getByRole("heading", { level: 1 });
      const code = page.locator(".prose code").first();
      const header = page.locator("[data-blume-header]");
      const dashboard = page.getByRole("link", { name: "Go to SuperTokens Dashboard" });

      await expect(root).toHaveAttribute("data-theme", theme);
      await expect(header).toBeVisible();
      await expect(dashboard).toBeVisible();
      const tokens = await root.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          accent: style.getPropertyValue("--blume-accent").trim(),
          background: style.getPropertyValue("--blume-background").trim(),
          foreground: style.getPropertyValue("--blume-foreground").trim(),
          muted: style.getPropertyValue("--blume-muted").trim(),
          mutedForeground: style.getPropertyValue("--blume-muted-foreground").trim(),
        };
      });
      expect(tokens.accent).toBe(theme === "light" ? "#a84f00" : "#ffad4d");
      if (theme === "dark") {
        expect(tokens).toMatchObject({
          background: "#18181a",
          foreground: "#edeef0",
          muted: "#1b1b1f",
          mutedForeground: "#adb1b8",
        });
      }

      await expect(body).toHaveCSS("font-family", /^Inter/u);
      await expect(heading).toHaveCSS("font-family", /^Inter/u);
      await expect(code).toHaveCSS("font-family", /^"?IBM Plex Mono/u);

      const bodyColors = await colors(body);
      expect(contrastRatio(bodyColors.foreground, bodyColors.background)).toBeGreaterThanOrEqual(4.5);

      const headerSeparation = await header.evaluate((element) => {
        const style = getComputedStyle(element);
        const context = document.createElement("canvas").getContext("2d");
        if (!context) throw new Error("Canvas context unavailable");
        const channels = (color: string): [number, number, number, number] => {
          context.clearRect(0, 0, 1, 1);
          context.fillStyle = color;
          context.fillRect(0, 0, 1, 1);
          return [...context.getImageData(0, 0, 1, 1).data] as [number, number, number, number];
        };
        const background = channels(style.backgroundColor);
        const border = channels(style.borderBottomColor);
        const borderAlpha = border[3] / 255;
        const renderedBorder = border
          .slice(0, 3)
          .map((channel, index) => Math.round(channel * borderAlpha + background[index] * (1 - borderAlpha)));
        return {
          borderDiffersFromBackground: renderedBorder.some((channel, index) => channel !== background[index]),
          borderStyle: style.borderBottomStyle,
          borderWidth: Number.parseFloat(style.borderBottomWidth),
        };
      });
      expect(headerSeparation.borderWidth).toBeGreaterThan(0);
      expect(headerSeparation.borderStyle).not.toBe("none");
      expect(headerSeparation.borderDiffersFromBackground).toBe(true);

      const initialDashboardColors = await colors(dashboard);
      expect(
        contrastRatio(initialDashboardColors.foreground, initialDashboardColors.background),
      ).toBeGreaterThanOrEqual(4.5);
      await dashboard.hover();
      const hoverDashboardColors = await colors(dashboard);
      expect(hoverDashboardColors.background).not.toEqual(initialDashboardColors.background);
      expect(contrastRatio(hoverDashboardColors.foreground, hoverDashboardColors.background)).toBeGreaterThanOrEqual(
        4.5,
      );
      await expect(dashboard).toHaveCSS("opacity", "1");
    }
  }
});

test("A2 preferences keep a 12px font floor across supported viewports and themes", async ({ page }) => {
  for (const theme of themes) {
    await page.emulateMedia({ colorScheme: theme });
    await page.setViewportSize({ width: viewports.at(-1)!, height: 844 });
    await page.goto("/docs/quickstart");
    await page.getByRole("button", { name: /Configure example preferences/u }).click();

    const dialog = page.getByRole("dialog", { name: "Your Setup" });
    await expect(dialog).toBeVisible();
    for (const width of viewports) {
      await page.setViewportSize({ width, height: 844 });
      await expect(dialog).toBeVisible();
      const functionalText = await dialog
        .locator(
          ".preferences-popover-header, .preferences-group legend, .preferences-option-label, .preferences-option-description",
        )
        .evaluateAll((elements) =>
          elements.flatMap((element) => {
            if (!(element as HTMLElement).checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) {
              return [];
            }
            return [
              {
                fontSize: Number.parseFloat(getComputedStyle(element).fontSize),
                text: element.textContent?.trim() ?? "",
              },
            ];
          }),
        );
      expect(functionalText.length).toBeGreaterThan(0);
      expect(functionalText.map(({ text }) => text)).toContain("Your Setup");
      expect(functionalText.every(({ text }) => text.length > 0)).toBe(true);
      expect(Math.min(...functionalText.map(({ fontSize }) => fontSize))).toBeGreaterThanOrEqual(12);
    }
  }
});
