import { test, expect } from '@playwright/test';

test.describe('Wishlist', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/uk');
    await page.evaluate(() => localStorage.clear());
  });

  test('adds item to wishlist', async ({ page }) => {
    await page.goto('/uk/shop');

    // Hover over first product to reveal buttons
    const product = page.locator('[data-testid="product-item"]').first();
    await product.hover();

    // Click wishlist toggle button
    const wishlistToggle = product.locator('[data-testid="wishlist-toggle"]');
    await wishlistToggle.click();

    // Navigate to wishlist page
    await page.click('[data-testid="wishlist-link"]');

    // Wait for wishlist page to load
    await page.waitForLoadState('domcontentloaded');

    // Item should be in wishlist
    const wishlistItems = page.locator('[data-testid="wishlist-item"]');
    expect(await wishlistItems.count()).toBeGreaterThanOrEqual(1);
  });

  test('removes item from wishlist', async ({ page }) => {
    await page.goto('/uk/shop');

    // Add item to wishlist
    const product = page.locator('[data-testid="product-item"]').first();
    await product.hover();
    await product.locator('[data-testid="wishlist-toggle"]').click();

    // Navigate to wishlist
    await page.click('[data-testid="wishlist-link"]');
    await page.waitForLoadState('domcontentloaded');

    // Remove item
    const removeBtn = page.locator('[data-testid="remove-wishlist-item"]').first();
    await removeBtn.click();

    // Wishlist should be empty or have fewer items
    const wishlistItems = page.locator('[data-testid="wishlist-item"]');
    expect(await wishlistItems.count()).toBe(0);
  });

  test('persists wishlist across navigation (localStorage)', async ({ page }) => {
    await page.goto('/uk/shop');

    // Add item to wishlist
    const product = page.locator('[data-testid="product-item"]').first();
    await product.hover();
    await product.locator('[data-testid="wishlist-toggle"]').click();

    // Navigate away to home
    await page.goto('/uk');

    // Navigate back to wishlist
    await page.click('[data-testid="wishlist-link"]');
    await page.waitForLoadState('domcontentloaded');

    // Item should still be there (localStorage persistence)
    const wishlistItems = page.locator('[data-testid="wishlist-item"]');
    expect(await wishlistItems.count()).toBeGreaterThanOrEqual(1);
  });

  test('clear wishlist button exists', async ({ page }) => {
    await page.goto('/uk/wishlist');

    // Clear wishlist button should be visible
    await expect(page.locator('[data-testid="clear-wishlist"]')).toBeVisible();
  });

  test('wishlist count is displayed', async ({ page }) => {
    await page.goto('/uk/shop');

    // Add item to wishlist
    const product = page.locator('[data-testid="product-item"]').first();
    await product.hover();
    await product.locator('[data-testid="wishlist-toggle"]').click();

    // Navigate to wishlist
    await page.click('[data-testid="wishlist-link"]');
    await page.waitForLoadState('domcontentloaded');

    // Wishlist count should be displayed
    await expect(page.locator('[data-testid="wishlist-count"]')).toBeVisible();
  });
});
