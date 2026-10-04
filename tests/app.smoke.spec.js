import { test, expect } from '@playwright/test';
import { attachTestMetrics } from './helpers/testMetrics';

test.describe('Hospital chatbot widget smoke tests', () => {
  test('initial render shows the app shell and launcher', async ({ page }, testInfo) => {
    const metrics = await attachTestMetrics(page, testInfo);

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Sunrise Multispecialty Hospital' })).toBeVisible();
    await expect(page.getByText('Patient Portal')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open chat with MediAssist' })).toBeVisible();

    const summary = await metrics.finalize();
    expect(summary.jsErrors).toEqual([]);
    expect(summary.failedRequests).toEqual([]);
  });

  test('opens the chat panel and sends a message', async ({ page }, testInfo) => {
    const metrics = await attachTestMetrics(page, testInfo);

    await page.goto('/');

    await page.getByRole('button', { name: 'Open chat with MediAssist' }).click();

    const input = page.locator('input[type="text"]').first();
    await expect(input).toBeVisible();

    await input.fill('Timings');
    await page.getByRole('button', { name: 'Send message' }).click();

    await expect(page.getByText('Our OPD is open Monday to Saturday, 8:00 AM to 8:00 PM. Would you like help booking a visit?')).toBeVisible({ timeout: 15000 });

    const summary = await metrics.finalize();
    expect(summary.jsErrors).toEqual([]);
    expect(summary.failedRequests).toEqual([]);
  });

  test('performance budget: page loads with a reasonable DOM and timing', async ({ page }, testInfo) => {
    const metrics = await attachTestMetrics(page, testInfo);
    const response = await page.goto('/');

    expect(response?.status()).toBe(200);

    const performance = await page.evaluate(async () => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      const paintMap = {};
      for (const entry of paint) {
        paintMap[entry.name] = entry.startTime;
      }

      const bodyText = document.body.innerText.length;
      const buttons = document.querySelectorAll('button').length;

      return {
        domContentLoaded: nav ? nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart : 0,
        load: nav ? nav.loadEventEnd - nav.loadEventStart : 0,
        firstPaint: paintMap['first-paint'] ?? 0,
        firstContentfulPaint: paintMap['first-contentful-paint'] ?? 0,
        bodyTextLength: bodyText,
        buttonCount: buttons,
      };
    });

    expect(performance.bodyTextLength).toBeGreaterThan(200);
    expect(performance.buttonCount).toBeGreaterThan(0);
    expect(performance.firstContentfulPaint).toBeLessThan(3000);
    expect(performance.load).toBeLessThan(5000);

    const summary = await metrics.finalize();
    expect(summary.jsErrors).toEqual([]);
    expect(summary.failedRequests).toEqual([]);
  });
});
