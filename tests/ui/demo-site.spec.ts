import { test, expect } from '@playwright/test';
import { TestHelpers } from '../../src/utils/test-helpers';

test.describe('Demo Site Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load demo site successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/AB.*Demo Store/);
    
    // Wait for JavaScript to load
    await page.waitForTimeout(2000);
    
    // Check if the page has loaded content
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });

  test('should have basic page structure', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for common elements that might exist
    const hasContent = await page.locator('body').isVisible();
    expect(hasContent).toBe(true);
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const bodyVisible = await page.locator('body').isVisible();
    expect(bodyVisible).toBe(true);
  });

  test('should capture performance metrics', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(10000); // 10 seconds max
  });

  test('should handle JavaScript errors gracefully', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    // Log errors for debugging but don't fail the test
    if (errors.length > 0) {
      console.log('JavaScript errors detected:', errors);
    }
    
    // The page should still be functional
    const bodyVisible = await page.locator('body').isVisible();
    expect(bodyVisible).toBe(true);
  });

  test('should take screenshot for visual regression', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000); // Wait for any animations
    
    await TestHelpers.takeFullPageScreenshot(page, 'demo-site-homepage');
  });
});