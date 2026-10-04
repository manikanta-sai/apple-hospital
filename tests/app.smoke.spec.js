import { test, expect } from '@playwright/test';
import { attachTestMetrics } from './helpers/testMetrics';

test.describe('Hospital chatbot widget smoke tests', () => {
  test('dashboard tile opens the existing chatbot screen', async ({ page }, testInfo) => {
    const metrics = await attachTestMetrics(page, testInfo);

    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Get Well Multispecialty Hospital' })).toBeVisible();
    await expect(page.getByText('Digital tools for patient support and smoother hospital workflows.')).toBeVisible();
    await expect(page.getByText('Speech to Text', { exact: true })).toBeVisible();
    await expect(page.getByText('Audio File to Text', { exact: true })).toBeVisible();
    await expect(page.getByText('PDF to Form Auto Fill', { exact: true })).toBeVisible();
    await expect(page.getByText('OP Token Generator', { exact: true })).toBeVisible();
    await expect(page.getByText('Token Number Announcer', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: /Chatbot/ })).toBeVisible();
    await expect(page.getByRole('button')).toHaveCount(0);

    await page.getByRole('link', { name: /Chatbot/ }).click();
    await expect(page).toHaveURL(/\/chatbot$/);
    await expect(page.getByText('Patient Portal')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open chat with AI Assist' })).toBeVisible();

    await page.getByRole('button', { name: 'Open chat with AI Assist' }).click();
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    await page.getByRole('button', { name: 'cardiology' }).click();
    await expect(page.getByRole('button', { name: 'Open chat with AI Assist' })).toBeVisible();
    await expect(page.locator('input[type="text"]').first()).toHaveCount(0);
    await expect(page.getByText("Looking for a heart specialist? I can help you check Dr. Rao's availability.")).toBeVisible();
    await page.getByRole('button', { name: 'Clear' }).click();
    await expect(page.getByText("Looking for a heart specialist? I can help you check Dr. Rao's availability.")).toHaveCount(0);
    await page.getByRole('button', { name: 'cardiology' }).click();
    await expect(page.getByRole('button', { name: 'Chat now' })).toBeVisible();
    await page.getByRole('button', { name: 'Chat now' }).click();
    await expect(page.locator('input[type="text"]').first()).toBeVisible();
    await page.getByRole('button', { name: 'Close chat' }).click();
    await page.getByRole('button', { name: 'Clear' }).click();

    await page.getByRole('link', { name: 'Back to dashboard' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText('Digital tools for patient support and smoother hospital workflows.')).toBeVisible();

    await page.goto('/chatbot');
    await expect(page.getByText('Patient Portal')).toBeVisible();
    await page.getByRole('link', { name: 'Back to dashboard' }).click();
    await expect(page).toHaveURL(/\/$/);

    const summary = await metrics.finalize();
    expect(summary.jsErrors).toEqual([]);
    expect(summary.failedRequests).toEqual([]);
  });

  test('opens the chat panel and sends a message', async ({ page }, testInfo) => {
    const metrics = await attachTestMetrics(page, testInfo);

    await page.goto('/');

    await page.getByRole('link', { name: /Chatbot/ }).click();
    await page.getByRole('button', { name: 'Open chat with AI Assist' }).click();

    const input = page.locator('input[type="text"]').first();
    await expect(input).toBeVisible();

    await input.fill('Timings');
    await page.getByRole('button', { name: 'Send message' }).click();

    await expect(page.getByText('Our OPD is open Monday to Saturday, 8:00 AM to 8:00 PM. Would you like help booking a visit?')).toBeVisible({ timeout: 15000 });

    const summary = await metrics.finalize();
    expect(summary.jsErrors).toEqual([]);
    expect(summary.failedRequests).toEqual([]);
  });

  test('generates a patient token, moves it through the queue, and shows the five-doctor announcer', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /OP Token Generator/ }).click();
    await expect(page).toHaveURL(/\/tokens$/);

    await page.getByLabel('Mobile number or UMR number').fill('9876543210');
    await page.getByRole('button', { name: /Aarav Sharma/ }).click();
    await page.getByLabel('Search doctors or departments').fill('Cardiology');
    await page.getByRole('button', { name: /^AR Dr\. Ananya Rao/ }).click();
    await page.getByRole('main').getByRole('button', { name: 'Generate token' }).click();
    await expect(page.getByRole('status')).toContainText('GW-046 created for Aarav Sharma');
    await expect(page.getByRole('dialog', { name: 'Token generated' })).toBeVisible();
    await expect(page.getByLabel('Mobile number or UMR number')).toHaveValue('');
    await page.getByRole('button', { name: 'Done' }).click();

    await page.getByRole('navigation', { name: 'Token tools' }).getByRole('button', { name: 'Waiting pool' }).click();
    await expect(page.getByText('GW-046')).toBeVisible();
    const generatedTokenRow = page.locator('[draggable="true"]').filter({ hasText: 'GW-046' });
    await generatedTokenRow.getByRole('button', { name: 'Announce' }).click();
    await generatedTokenRow.getByRole('button', { name: 'Check in' }).click();
    await generatedTokenRow.getByRole('button', { name: 'Check out' }).click();
    await expect(page.getByText('Completed', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'TV announcer' }).click();
    await expect(page.getByText('Dr. Ananya Rao', { exact: true })).toBeVisible();
    await expect(page.getByText('Dr. Vikram Mehta', { exact: true })).toBeVisible();
    await expect(page.getByText('Dr. Priya Mani', { exact: true })).toBeVisible();
    await expect(page.getByText('Dr. Nikhil Shah', { exact: true })).toBeVisible();
    await expect(page.getByText('Dr. Kavitha Iyer', { exact: true })).toBeVisible();
    await expect(page.getByText('Room 204', { exact: true })).toBeVisible();
    await expect(page.getByText('MBBS, MD, DM', { exact: true })).toBeVisible();
  });

  test('holds skipped tokens for one minute and allows repeat announcements until check-in', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-10-04T09:00:00') });
    await page.goto('/waiting-pool');

    const roomQueue = page.getByRole('region', { name: 'Dr. Ananya Rao, room 204' });
    const waitingToken = roomQueue.locator('[draggable="true"]').filter({ hasText: 'GW-041' });
    await waitingToken.getByRole('button', { name: 'Skip' }).click();
    await expect(waitingToken.getByText(/Hold · 60s/)).toBeVisible();
    await expect(waitingToken.getByRole('button')).toHaveCount(0);

    await page.clock.fastForward(60_000);
    await expect(waitingToken.getByRole('button', { name: 'Announce' })).toBeVisible();

    await waitingToken.getByRole('button', { name: 'Announce' }).click();
    await expect(waitingToken.getByRole('button', { name: 'Check in' })).toBeVisible();
    await expect(waitingToken.getByRole('button', { name: 'Announce again' })).toHaveCount(0);
    await page.clock.fastForward(60_000);
    await expect(waitingToken.getByRole('button', { name: 'Announce again' })).toBeVisible();
    await waitingToken.getByRole('button', { name: 'Check in' }).click();
    await expect(waitingToken.getByRole('button', { name: 'Announce again' })).toHaveCount(0);
  });

  test('plays the announce bell on the TV route and identifies the patient', async ({ page }) => {
    await page.goto('/waiting-pool');
    await page.evaluate(() => {
      window.__bellOscillatorCount = 0;
      const originalCreateOscillator = AudioContext.prototype.createOscillator;
      AudioContext.prototype.createOscillator = function () {
        window.__bellOscillatorCount += 1;
        return originalCreateOscillator.call(this);
      };
    });

    const patientToken = page.locator('[draggable="true"]').filter({ hasText: 'GW-041' });
    await patientToken.getByRole('button', { name: 'Announce' }).click();
    expect(await page.evaluate(() => window.__bellOscillatorCount)).toBe(0);

    await page.getByRole('navigation', { name: 'Token tools' }).getByRole('button', { name: 'TV announcer' }).click();
    await expect.poll(() => page.evaluate(() => window.__bellOscillatorCount)).toBeGreaterThan(0);
    const announcedCard = page.locator('article').filter({ hasText: 'GW-041' });
    await expect(announcedCard.getByText('Now announcing', { exact: true })).toBeVisible();
    await expect(announcedCard.locator('.announce-wave > span')).toHaveCount(4);
    await expect(announcedCard.getByText('Aarav Sharma', { exact: true })).toBeVisible();
    await expect(announcedCard.getByText('204', { exact: true })).toBeVisible();
  });

  test('reorders patients only inside the assigned doctor room', async ({ page }) => {
    await page.goto('/waiting-pool');
    const roomQueue = page.getByRole('region', { name: 'Dr. Ananya Rao, room 204' });

    await expect(roomQueue.getByText('Aarav Sharma', { exact: true }).first()).toBeVisible();
    await expect(roomQueue.getByText('Meera Nair', { exact: true })).toBeVisible();
    await expect(roomQueue.getByText('Queue position')).toHaveCount(0);
    const sourceCard = roomQueue.locator('[draggable="true"]').filter({ hasText: 'GW-042' });
    const targetCard = roomQueue.locator('[draggable="true"]').filter({ hasText: 'GW-041' });
    const targetBox = await targetCard.boundingBox();
    await sourceCard.evaluate((element) => element.dispatchEvent(new DragEvent('dragstart', {
      bubbles: true,
      dataTransfer: new DataTransfer(),
    })));
    await targetCard.evaluate((element, targetY) => element.dispatchEvent(new DragEvent('dragover', {
      bubbles: true,
      cancelable: true,
      clientY: targetY,
      dataTransfer: new DataTransfer(),
    })), targetBox.y + 2);
    await expect(targetCard).toHaveAttribute('data-drop-position', 'before');
    await targetCard.evaluate((element) => element.dispatchEvent(new DragEvent('drop', {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer(),
    })));
    const tokenOrder = await roomQueue.locator('[draggable="true"]').evaluateAll((cards) =>
      cards.map((card) => card.textContent.match(/GW-\d+/)?.[0]).filter(Boolean),
    );
    expect(tokenOrder.indexOf('GW-042')).toBeLessThan(tokenOrder.indexOf('GW-041'));
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
      const interactiveControls = document.querySelectorAll('button, a').length;

      return {
        domContentLoaded: nav ? nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart : 0,
        load: nav ? nav.loadEventEnd - nav.loadEventStart : 0,
        firstPaint: paintMap['first-paint'] ?? 0,
        firstContentfulPaint: paintMap['first-contentful-paint'] ?? 0,
        bodyTextLength: bodyText,
        interactiveControlCount: interactiveControls,
      };
    });

    expect(performance.bodyTextLength).toBeGreaterThan(200);
    expect(performance.interactiveControlCount).toBeGreaterThan(0);
    expect(performance.firstContentfulPaint).toBeLessThan(3000);
    expect(performance.load).toBeLessThan(5000);

    const summary = await metrics.finalize();
    expect(summary.jsErrors).toEqual([]);
    expect(summary.failedRequests).toEqual([]);
  });
});
