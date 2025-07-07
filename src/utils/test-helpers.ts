import { Page, expect } from '@playwright/test';
import { PerformanceMetrics } from '../types';

export class TestHelpers {
  static async waitForNetworkIdle(page: Page, timeout: number = 10000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  static async capturePerformanceMetrics(page: Page): Promise<PerformanceMetrics> {
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0
      };
    });

    return metrics;
  }

  static async checkAccessibility(page: Page): Promise<void> {
    await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.alt) {
          console.warn(`Image without alt text: ${img.src}`);
        }
      });

      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        if (!button.textContent?.trim() && !button.getAttribute('aria-label')) {
          console.warn('Button without accessible text');
        }
      });
    });
  }

  static async injectAxeCore(page: Page): Promise<void> {
    try {
      await page.addScriptTag({
        url: 'https://unpkg.com/axe-core@4.7.0/axe.min.js'
      });
      
      // Wait for axe to be available
      await page.waitForFunction(() => typeof (window as any).axe !== 'undefined', { timeout: 5000 });
    } catch (error) {
      console.warn('Failed to load axe-core, skipping accessibility test');
      throw error;
    }
  }

  static async runAxeAnalysis(page: Page): Promise<any> {
    return await page.evaluate(() => {
      return new Promise((resolve, reject) => {
        if (typeof (window as any).axe === 'undefined') {
          reject(new Error('axe-core is not loaded'));
          return;
        }
        
        (window as any).axe.run(document, (err: any, results: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    });
  }

  static async mockApiResponse(page: Page, url: string, response: any): Promise<void> {
    await page.route(url, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  static async interceptNetworkRequests(page: Page): Promise<void> {
    page.on('request', request => {
      console.log(`Request: ${request.method()} ${request.url()}`);
    });

    page.on('response', response => {
      console.log(`Response: ${response.status()} ${response.url()}`);
    });
  }

  static async simulateSlowNetwork(page: Page): Promise<void> {
    try {
      // CDP session is only available in Chromium
      const client = await page.context().newCDPSession(page);
      await client.send('Network.emulateNetworkConditions', {
        offline: false,
        downloadThroughput: 1000 * 1024 / 8,
        uploadThroughput: 1000 * 1024 / 8,
        latency: 100
      });
    } catch (error) {
      console.log('Network throttling not available in this browser, skipping slow network simulation');
      // For non-Chromium browsers, we can't throttle network, so just continue
    }
  }

  static async generateRandomString(length: number = 10): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static async takeFullPageScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true
    });
  }

  static async compareScreenshots(page: Page, name: string): Promise<void> {
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      threshold: 0.2
    });
  }
}