import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4322",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/serve-e2e.mjs",
    reuseExistingServer: false,
    timeout: 600_000,
    url: "http://127.0.0.1:4322/docs",
  },
});
