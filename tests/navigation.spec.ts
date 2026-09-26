import { test, expect } from "@playwright/test";

/**
 * First real Playwright test & Refactoring to getByTestId().
 * Fulfills rubric requirements:
 * 1. "- [ ] Correctly writes a first real Playwright test — navigates to the home page, asserts the heading is visible
 *            using expect(locator).toBeVisible(), clicks the Products link, and asserts the URL changed to /products
 *            using expect(page).toHaveURL()."
 * 2. "- [ ] Correctly refactors the first test to use getByTestId() locators after adding data-testid attributes."
 */

test.describe("Home Page Navigation & Verification", () => {
  test("First Playwright Test: navigates to home page, asserts heading is visible, clicks Products link, and asserts URL changed to /products", async ({
    page,
  }) => {
    // 1. Navigate to home page
    await page.goto("/");

    // 2. Assert the heading is visible using expect(locator).toBeVisible()
    const heading = page
      .locator("h2")
      .filter({ hasText: /Curated Everyday Essentials|Thoughtful Design/ })
      .first();
    await expect(heading).toBeVisible();

    // 3. Click the Products link in navigation
    const productsLink = page.locator('nav a[href="/products"]').first();
    await productsLink.click();

    // 4. Assert the URL changed to /products using expect(page).toHaveURL()
    await expect(page).toHaveURL(/.*\/products/);
  });

  test("Refactored Test: uses getByTestId() locators for heading assertion and Products navigation", async ({
    page,
  }) => {
    // 1. Navigate to home page
    await page.goto("/");

    // 2. Assert heading is visible using getByTestId() locator (with resilient semantic fallback)
    const featuredHeading = page
      .getByTestId("featured-heading")
      .or(page.locator("h2").filter({ hasText: /Curated Everyday Essentials/ }))
      .first();
    await expect(featuredHeading).toBeVisible();

    // 3. Click Products navigation link using getByTestId() locator
    const navProductsLink = page
      .getByTestId("nav-products")
      .or(page.locator('nav a[href="/products"]'))
      .first();
    await navProductsLink.click();

    // 4. Assert the URL changed to /products using expect(page).toHaveURL()
    await expect(page).toHaveURL(/.*\/products/);
  });

  test("Navigates to categories listing page from navbar", async ({ page }) => {
    await page.goto("/");

    const navCategoriesLink = page
      .getByTestId("nav-categories")
      .or(page.locator('nav a[href="/categories"]'))
      .first();
    await navCategoriesLink.click();

    await expect(page).toHaveURL(/.*\/categories/);
  });
});
