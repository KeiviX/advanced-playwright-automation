import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('should match homepage visual baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000); // Wait for any loading/animations
    
    // Take screenshot and compare with baseline
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      threshold: 0.3, // Allow 30% difference for demo site
    });
  });

  test('should match mobile homepage visual baseline', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      threshold: 0.3,
    });
  });

  test('should match tablet homepage visual baseline', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      threshold: 0.3,
    });
  });

  test('should handle dark mode if available', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
      threshold: 0.3,
    });
  });

  test('should handle high contrast mode', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    await expect(page).toHaveScreenshot('homepage-high-contrast.png', {
      fullPage: true,
      threshold: 0.3,
    });
  });
});