import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test('displays product information', async ({ page }) => {
    // Navigate to shop and click first product
    await page.goto('/uk/shop-with-sidebar');
    await page.locator('[data-testid="product-link"]').first().click();

    // Wait for navigation to product page
    await page.waitForURL(/\/products\//);

    // Product details should be visible - use h2 heading for main title
    await expect(page.locator('h2[data-testid="product-title"]')).toBeVisible();
    await expect(page.locator('h3[data-testid="product-price"]')).toBeVisible();
  });

  test('external link has href and target="_blank"', async ({ page }) => {
    await page.goto('/uk/shop-with-sidebar');
    await page.locator('[data-testid="product-link"]').first().click();

    // Wait for navigation to product page
    await page.waitForURL(/\/products\//);

    const externalLink = page.locator('[data-testid="external-link"]');

    if (await externalLink.isVisible()) {
      const href = await externalLink.getAttribute('href');
      const target = await externalLink.getAttribute('target');

      // External link should have a valid URL or fallback
      expect(href).toBeTruthy();
      expect(target).toBe('_blank');
    }
  });

  test('product description is shown when available', async ({ page }) => {
    await page.goto('/uk/shop-with-sidebar');
    await page.locator('[data-testid="product-link"]').first().click();

    // Wait for navigation to product page
    await page.waitForURL(/\/products\//);

    // Check if description element exists (may not be present for all products)
    const description = page.locator('[data-testid="product-description"]');
    const descriptionCount = await description.count();

    // If description exists, it should be visible
    if (descriptionCount > 0) {
      await expect(description).toBeVisible();
    }
  });

  test('direct navigation to product page works', async ({ page }) => {
    // First get a valid slug from the shop page
    await page.goto('/uk/shop-with-sidebar');
    await page.waitForLoadState('networkidle');

    const productLink = page.locator('[data-testid="product-link"]').first();
    await productLink.click();

    // Wait for navigation to product page
    await page.waitForURL(/\/products\//, { timeout: 10000 });
    const url = page.url();
    expect(url).toMatch(/\/products\/[a-z0-9-]+-\d+$/);

    // Navigate directly to that URL in a new context
    await page.goto(url);
    await page.waitForLoadState('networkidle');
    // Use h2 heading for main title (not related products)
    await expect(page.locator('h2[data-testid="product-title"]')).toBeVisible({ timeout: 10000 });
  });

  test('invalid product slug shows 404', async ({ page }) => {
    await page.goto('/uk/products/nonexistent-product-999999');
    // Use heading specifically to avoid matching <title>
    await expect(page.getByRole('heading', { name: /not found|не знайдено/i })).toBeVisible();
  });

  test('product URL contains slug not shop-details', async ({ page }) => {
    await page.goto('/uk/shop-with-sidebar');
    await page.locator('[data-testid="product-link"]').first().click();

    // Wait for navigation to product page
    await page.waitForURL(/\/products\//);

    // URL should NOT be /shop-details anymore
    expect(page.url()).not.toContain('shop-details');
    expect(page.url()).toMatch(/\/products\//);
  });
});
