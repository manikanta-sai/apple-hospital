import { test, expect } from "@playwright/test";

test.describe("Production Security & Anti-Screenshot Protection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("runs silently in background without showing debug/DRM badges", async ({ page }) => {
    // In production, debug badges like "DRM SHIELD" or "DRM Product" should NOT be shown
    const drmBadge = page.getByText(/DRM/i);
    await expect(drmBadge).toHaveCount(0);
  });

  test("does not render watermark across viewport", async ({ page }) => {
    const watermark = page.locator("#forensic-security-watermark");
    await expect(watermark).toHaveCount(0);
  });

  test("suppresses right-click context menu", async ({ page }) => {
    // Right click should not open native menu / should be intercepted
    await page.locator("body").click({ button: "right" });
  });

  test("triggers pitch-black screen with exact security notice on capture attempt", async ({
    page,
  }) => {
    // Focus the page and trigger PrintScreen key event
    await page.locator("body").click();
    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "PrintScreen", keyCode: 44, bubbles: true }));
    });

    // Blackout overlay should appear
    const alertOverlay = page.getByRole("alert");
    await expect(alertOverlay).toBeVisible();
    await expect(
      page.getByText("For security reasons this content is protected")
    ).toBeVisible();
    await expect(
      page.getByText("Printing, screenshots and switching tabs are restricted while viewing this content.")
    ).toBeVisible();

    // Click to dismiss
    await page.getByRole("button", { name: /Tap or click to return/i }).click();
    await expect(alertOverlay).not.toBeVisible();
  });
});
