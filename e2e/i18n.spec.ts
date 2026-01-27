import { test, expect } from '@playwright/test';

test.describe('Internationalization', () => {
  test('defaults to Ukrainian (/uk)', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/uk/);
  });

  test('switches to English via language selector', async ({ page }) => {
    await page.goto('/uk');

    // Find language selector and switch to English
    const languageSelect = page.locator('[data-testid="language-select"]');
    await languageSelect.selectOption('en');

    // URL should update to English locale
    await expect(page).toHaveURL(/\/en/);
  });

  test('switches to Ukrainian via language selector', async ({ page }) => {
    await page.goto('/en');

    // Switch to Ukrainian
    const languageSelect = page.locator('[data-testid="language-select"]');
    await languageSelect.selectOption('uk');

    // URL should update to Ukrainian locale
    await expect(page).toHaveURL(/\/uk/);
  });

  test('preserves path when switching language', async ({ page }) => {
    // Start on Ukrainian shop page
    await page.goto('/uk/shop');

    // Switch to English
    const languageSelect = page.locator('[data-testid="language-select"]');
    await languageSelect.selectOption('en');

    // Should be on English shop page
    await expect(page).toHaveURL(/\/en\/shop/);
  });

  test('language switcher is visible in header', async ({ page }) => {
    await page.goto('/uk');

    // Language switcher should be visible
    await expect(page.locator('[data-testid="language-switcher"]')).toBeVisible();
  });

  test('language options are available', async ({ page }) => {
    await page.goto('/uk');

    // Check that both language options exist
    const englishOption = page.locator('[data-testid="lang-en"]');
    const ukrainianOption = page.locator('[data-testid="lang-uk"]');

    // Both options should exist in the select
    await expect(englishOption).toBeAttached();
    await expect(ukrainianOption).toBeAttached();
  });
});
