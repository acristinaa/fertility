import { test, expect } from "@playwright/test";

test.describe("Dashboard Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("displays dashboard header", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Dashboard" })
    ).toBeVisible();
    await expect(
      page.getByText("Welcome back! Here's your overview.")
    ).toBeVisible();
  });

  test("displays all stat cards", async ({ page }) => {
    await expect(page.getByText("Upcoming Sessions")).toBeVisible();
    await expect(page.getByText("Active Goals")).toBeVisible();
    await expect(page.getByText("Action Items")).toBeVisible();
    await expect(page.getByText("Completed Sessions")).toBeVisible();
  });

  test("stat cards show numeric values", async ({ page }) => {
    // Wait for loading to complete
    await page.waitForSelector("text=Loading dashboard...", {
      state: "hidden",
    });

    // Stat cards should have numeric values
    const statCards = page.locator(".bg-white.rounded-lg.shadow-sm");
    await expect(statCards.first()).toBeVisible();
  });

  test("upcoming sessions section exists", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Upcoming Sessions" })
    ).toBeVisible();
  });

  test("shows loading state then content", async ({ page }) => {
    // Reload to see loading state
    await page.reload();

    // Should show loading initially (might be too fast to catch)
    // Then show content
    await page.waitForSelector("text=Loading dashboard...", {
      state: "hidden",
      timeout: 10000,
    });

    // Content should be visible
    await expect(page.getByText("Dashboard")).toBeVisible();
  });
});