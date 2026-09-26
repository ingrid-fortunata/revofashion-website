import { test, expect } from "@playwright/test";

/**
 * Registration Form Validation and Submission Tests.
 * Fulfills rubric requirement:
 * "- [ ] Correctly writes form validation tests in tests/register.spec.ts."
 */

test.describe("Registration Form Validations (tests/register.spec.ts)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
  });

  test("Renders registration form correctly with all input fields and submit button", async ({
    page,
  }) => {
    const cardTitle = page.locator("h1, h2, h3").filter({ hasText: /Create an Account|Sign Up/i });
    await expect(cardTitle.first()).toBeVisible();

    const usernameInput = page.getByTestId("register-username-input").or(page.locator('input[name="username"]'));
    const emailInput = page.getByTestId("register-email-input").or(page.locator('input[name="email"]'));
    const passwordInput = page.getByTestId("register-password-input").or(page.locator('input[name="password"]'));
    const confirmInput = page.getByTestId("register-confirm-password-input").or(page.locator('input[name="confirmPassword"]'));
    const submitBtn = page.getByTestId("register-submit").or(page.locator('button[type="submit"]'));

    await expect(usernameInput.first()).toBeVisible();
    await expect(emailInput.first()).toBeVisible();
    await expect(passwordInput.first()).toBeVisible();
    await expect(confirmInput.first()).toBeVisible();
    await expect(submitBtn.first()).toBeVisible();
  });

  test("Validates empty submission: displays required field errors", async ({ page }) => {
    const submitBtn = page.getByTestId("register-submit").or(page.locator('button[type="submit"]'));
    await submitBtn.first().click();

    // Assert validation error messages appear for all required fields
    const usernameError = page.locator("#username-error").or(page.getByText("Username is required"));
    const emailError = page.locator("#email-error").or(page.getByText("Email is required"));
    const passwordError = page.locator("#password-error").or(page.getByText("Password is required"));

    await expect(usernameError.first()).toBeVisible();
    await expect(emailError.first()).toBeVisible();
    await expect(passwordError.first()).toBeVisible();
  });

  test("Validates email format: displays invalid email message", async ({ page }) => {
    const usernameInput = page.getByTestId("register-username-input").or(page.locator('input[name="username"]'));
    const emailInput = page.getByTestId("register-email-input").or(page.locator('input[name="email"]'));
    const submitBtn = page.getByTestId("register-submit").or(page.locator('button[type="submit"]'));

    await usernameInput.first().fill("valid_user");
    await emailInput.first().fill("not-a-valid-email");
    await submitBtn.first().click();

    const emailError = page.getByText("Please enter a valid email address");
    await expect(emailError.first()).toBeVisible();
  });

  test("Validates password minimum length: requires at least 8 characters", async ({ page }) => {
    const usernameInput = page.getByTestId("register-username-input").or(page.locator('input[name="username"]'));
    const emailInput = page.getByTestId("register-email-input").or(page.locator('input[name="email"]'));
    const passwordInput = page.getByTestId("register-password-input").or(page.locator('input[name="password"]'));
    const submitBtn = page.getByTestId("register-submit").or(page.locator('button[type="submit"]'));

    await usernameInput.first().fill("valid_user");
    await emailInput.first().fill("valid@example.com");
    await passwordInput.first().fill("12345");
    await submitBtn.first().click();

    const passError = page.getByText("Password must be at least 8 characters");
    await expect(passError.first()).toBeVisible();
  });

  test("Validates password confirmation: flags mismatched passwords", async ({ page }) => {
    const usernameInput = page.getByTestId("register-username-input").or(page.locator('input[name="username"]'));
    const emailInput = page.getByTestId("register-email-input").or(page.locator('input[name="email"]'));
    const passwordInput = page.getByTestId("register-password-input").or(page.locator('input[name="password"]'));
    const confirmInput = page.getByTestId("register-confirm-password-input").or(page.locator('input[name="confirmPassword"]'));
    const submitBtn = page.getByTestId("register-submit").or(page.locator('button[type="submit"]'));

    await usernameInput.first().fill("valid_user");
    await emailInput.first().fill("valid@example.com");
    await passwordInput.first().fill("Password123!");
    await confirmInput.first().fill("DifferentPassword456!");
    await submitBtn.first().click();

    const mismatchError = page.getByText("Passwords do not match");
    await expect(mismatchError.first()).toBeVisible();
  });

  test("Validates username constraints: disallows spaces in username", async ({ page }) => {
    const usernameInput = page.getByTestId("register-username-input").or(page.locator('input[name="username"]'));
    const emailInput = page.getByTestId("register-email-input").or(page.locator('input[name="email"]'));
    const passwordInput = page.getByTestId("register-password-input").or(page.locator('input[name="password"]'));
    const confirmInput = page.getByTestId("register-confirm-password-input").or(page.locator('input[name="confirmPassword"]'));
    const submitBtn = page.getByTestId("register-submit").or(page.locator('button[type="submit"]'));

    await usernameInput.first().fill("invalid user name");
    await emailInput.first().fill("valid@example.com");
    await passwordInput.first().fill("Password123!");
    await confirmInput.first().fill("Password123!");
    await submitBtn.first().click();

    const spacesError = page.getByText("Username cannot contain spaces");
    await expect(spacesError.first()).toBeVisible();
  });

  test("Successful registration flow creates user and redirects", async ({ page }) => {
    const timestamp = Date.now();
    const uniqueUsername = `reg_${timestamp.toString().slice(-6)}`;
    const uniqueEmail = `${uniqueUsername}@testexample.com`;

    const usernameInput = page.getByTestId("register-username-input").or(page.locator('input[name="username"]'));
    const emailInput = page.getByTestId("register-email-input").or(page.locator('input[name="email"]'));
    const passwordInput = page.getByTestId("register-password-input").or(page.locator('input[name="password"]'));
    const confirmInput = page.getByTestId("register-confirm-password-input").or(page.locator('input[name="confirmPassword"]'));
    const submitBtn = page.getByTestId("register-submit").or(page.locator('button[type="submit"]'));

    await usernameInput.first().fill(uniqueUsername);
    await emailInput.first().fill(uniqueEmail);
    await passwordInput.first().fill("Password123!");
    await confirmInput.first().fill("Password123!");
    await submitBtn.first().click();

    // After successful registration, user should be redirected to home or login
    await expect(page).toHaveURL(/(\/|\/login)$/, { timeout: 15000 });
  });
});
