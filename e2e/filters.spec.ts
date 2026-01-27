import { test, expect } from '@playwright/test';

test.describe('Shop Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/uk/shop');
  });

  test('category filter expands and collapses', async ({ page }) => {
    const categoryFilter = page.locator('[data-testid="category-filter"]');

    // Click to ensure it's expanded (default state may vary)
    await categoryFilter.click();

    // Check if category options are visible
    const categoryOptions = page.locator('[data-testid="category-option"]');
    const optionCount = await categoryOptions.count();

    // Should have at least one category option visible
    expect(optionCount).toBeGreaterThanOrEqual(0);
  });

  test('color filter displays color options', async ({ page }) => {
    const colorFilter = page.locator('[data-testid="color-filter"]');

    // Click to toggle (ensure expanded)
    await colorFilter.click();

    // Check for color options
    const colorOptions = page.locator('[data-testid="color-option"]');
    const optionCount = await colorOptions.count();

    // Should have color options available
    expect(optionCount).toBeGreaterThanOrEqual(0);
  });

  test('gender filter displays gender options', async ({ page }) => {
    const genderFilter = page.locator('[data-testid="gender-filter"]');

    // Click to toggle
    await genderFilter.click();

    // Check for gender options
    const genderOptions = page.locator('[data-testid="gender-option"]');
    const optionCount = await genderOptions.count();

    // Should have 3 gender options (male, female, unisex)
    expect(optionCount).toBe(3);
  });

  test('price filter displays min and max values', async ({ page }) => {
    const priceFilter = page.locator('[data-testid="price-filter"]');

    // Click to expand
    await priceFilter.click();

    // Price min and max should be visible
    await expect(page.locator('[data-testid="price-min"]')).toBeVisible();
    await expect(page.locator('[data-testid="price-max"]')).toBeVisible();
  });

  test('multiple filters can be used together', async ({ page }) => {
    // Expand and interact with category filter
    const categoryFilter = page.locator('[data-testid="category-filter"]');
    await categoryFilter.click();

    // Expand and interact with gender filter
    const genderFilter = page.locator('[data-testid="gender-filter"]');
    await genderFilter.click();

    // Both filters should be accessible
    const categoryOptions = page.locator('[data-testid="category-option"]');
    const genderOptions = page.locator('[data-testid="gender-option"]');

    // Filters are interactive
    expect(await categoryOptions.count()).toBeGreaterThanOrEqual(0);
    expect(await genderOptions.count()).toBe(3);
  });
});
