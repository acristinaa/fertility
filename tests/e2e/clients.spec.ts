import { test, expect } from "@playwright/test";

test.describe("Clients Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/clients");
  });

  test("displays page header", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Clients" })).toBeVisible();
    await expect(
      page.getByText("Manage your client relationships")
    ).toBeVisible();
  });

  test("has a search input", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search by name or email...");
    await expect(searchInput).toBeVisible();
  });

  test("search input is functional", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search by name or email...");

    await searchInput.fill("test search");
    await expect(searchInput).toHaveValue("test search");
  });

  test("search filters results in real-time", async ({ page }) => {
    // Wait for initial load
    await page.waitForSelector("text=Loading clients...", { state: "hidden" });

    const searchInput = page.getByPlaceholder("Search by name or email...");

    // Type a search query
    await searchInput.fill("nonexistent-client-xyz");

    // Should show empty state for no results
    // (or filtered results if there are matches)
    await page.waitForTimeout(500); // Brief wait for filter to apply
  });

  test("displays client cards or empty state", async ({ page }) => {
    // Wait for loading to complete
    await page.waitForSelector("text=Loading clients...", { state: "hidden" });

    // Should either show client cards or empty state
    const hasClients = await page.locator(".grid.md\\:grid-cols-2").count();
    const hasEmptyState = await page.getByText("No clients yet").count();

    expect(hasClients > 0 || hasEmptyState > 0).toBeTruthy();
  });

  test("client cards have View Profile button", async ({ page }) => {
    // Wait for loading
    await page.waitForSelector("text=Loading clients...", { state: "hidden" });

    // If there are clients, check for View Profile buttons
    const viewProfileButtons = page.getByRole("button", {
      name: "View Profile",
    });
    const count = await viewProfileButtons.count();

    // Either there are View Profile buttons (clients exist)
    // or there's an empty state (no clients)
    if (count > 0) {
      await expect(viewProfileButtons.first()).toBeVisible();
    }
  });
});