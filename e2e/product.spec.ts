import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test('displays product information', async ({ page }) => {
    // Navigate to shop and click first product
    await page.goto('/uk/shop');
    await page.click('[data-testid="product-link"]:first-child');

    // Wait for navigation
    await page.waitForLoadState('domcontentloaded');

    // Product details should be visible
    await expect(page.locator('[data-testid="product-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible();
  });

  test('external link has href and target="_blank"', async ({ page }) => {
    await page.goto('/uk/shop');
    await page.click('[data-testid="product-link"]:first-child');

    await page.waitForLoadState('domcontentloaded');

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
    await page.goto('/uk/shop');
    await page.click('[data-testid="product-link"]:first-child');

    await page.waitForLoadState('domcontentloaded');

    // Check if description element exists (may not be present for all products)
    const description = page.locator('[data-testid="product-description"]');
    const descriptionCount = await description.count();

    // If description exists, it should be visible
    if (descriptionCount > 0) {
      await expect(description).toBeVisible();
    }
  });
});
