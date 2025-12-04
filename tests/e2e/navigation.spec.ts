import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("displays the app branding", async ({ page }) => {
    await expect(page.getByText("Fertility Care")).toBeVisible();
  });

  test("navigates to Dashboard", async ({ page }) => {
    await page.click("text=Dashboard");
    await expect(page).toHaveURL("/dashboard");
    await expect(
      page.getByRole("heading", { name: "Dashboard" })
    ).toBeVisible();
  });

  test("navigates to Sessions", async ({ page }) => {
    await page.click("text=Sessions");
    await expect(page).toHaveURL("/sessions");
  });

  test("navigates to Programs", async ({ page }) => {
    await page.click("text=Programs");
    await expect(page).toHaveURL("/programs");
  });

  test("navigates to Goals", async ({ page }) => {
    await page.click("text=Goals");
    await expect(page).toHaveURL("/goals");
  });

  test("navigates to Action Items", async ({ page }) => {
    await page.click("text=Action Items");
    await expect(page).toHaveURL("/action-items");
  });

  test("navigates to Profile", async ({ page }) => {
    await page.click("text=Profile");
    await expect(page).toHaveURL("/profile");
  });

  test("highlights the active navigation item", async ({ page }) => {
    await page.goto("/sessions");

    const sessionsLink = page.getByRole("link", { name: "Sessions" });
    await expect(sessionsLink).toHaveClass(/bg-blue-50/);
  });
});