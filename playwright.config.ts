import { defineConfig, devices } from "@playwright/test";
import path from "path";

/**
 * Playwright E2E configuration for RevoFashion.
 * Tests run against the live Vercel production URL by default,
 * or against a local dev server when BASE_URL is set to http://localhost:3000.
 */
const BASE_URL = process.env.BASE_URL || "https://revofashion-website.vercel.app";

export default defineConfig({
  testDir: "./tests",
  /* Maximum time one test can run for */
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  /* Retry failed tests */
  retries: process.env.CI ? 2 : 1,
  /* Limit workers for API stability */
  workers: process.env.CI ? 1 : 2,
  /* Test reporter configuration */
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],

  /* Global setup to seed test user session */
  globalSetup: path.resolve(__dirname, "tests/global-setup.ts"),

  /* Shared settings for all test projects */
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 800 },
      },
    },
  ],

  /* Run local server before tests when targeting localhost */
  webServer:
    process.env.BASE_URL && !process.env.BASE_URL.includes("localhost")
      ? undefined
      : {
          command: "npm run start",
          url: "http://localhost:3000",
          reuseExistingServer: !process.env.CI,
          timeout: 120000,
        },
});
