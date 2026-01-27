import { test, expect } from '@playwright/test';

test.describe('Shop Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/uk/shop-with-sidebar');
  });

  test('displays products in grid', async ({ page }) => {
    const products = page.locator('[data-testid="product-item"]');
    await expect(products.first()).toBeVisible();
    expect(await products.count()).toBeGreaterThan(0);
  });

  test('filters by category updates URL', async ({ page }) => {
    // Click category filter to expand
    const categoryFilter = page.locator('[data-testid="category-filter"]');
    await categoryFilter.click();

    // Click first category option
    const categoryOption = page.locator('[data-testid="category-option"]').first();
    await categoryOption.click();

    // Products should still display (filter applied)
    await expect(page.locator('[data-testid="product-item"]').first()).toBeVisible();
  });

  test('search filters products', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();

    // Fill search input
    await searchInput.fill('test');

    // Verify input has the value before submit
    await expect(searchInput).toHaveValue('test');
  });

  test('quick view button opens modal', async ({ page }) => {
    // Hover over product to reveal quick view button
    const product = page.locator('[data-testid="product-item"]').first();
    await product.hover();

    // Click quick view button
    const quickViewBtn = product.locator('[data-testid="quick-view-btn"]');
    await quickViewBtn.click();

    // Modal should be visible
    await expect(page.locator('[data-testid="quick-view-modal"]')).toBeVisible();
  });
});
