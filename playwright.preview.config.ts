import { defineConfig } from "@playwright/test";

const baseURL = process.env.MFE_PREVIEW_URL;
if (!baseURL) throw new Error("MFE_PREVIEW_URL is required for preview smoke tests");

export default defineConfig({
  testDir: "./e2e-preview",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 2,
  reporter: "list",
  timeout: 30_000,
  use: {
    baseURL,
    ignoreHTTPSErrors: false,
    trace: "retain-on-failure",
  },
});
