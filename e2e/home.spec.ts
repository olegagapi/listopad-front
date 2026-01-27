import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/uk');
    await expect(page).toHaveTitle(/Listopad/i);
  });

  test('navigates to shop page', async ({ page }) => {
    await page.goto('/uk');
    await page.click('a[href*="/shop"]');
    await expect(page).toHaveURL(/\/shop/);
  });
});
