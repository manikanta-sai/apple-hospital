export async function attachTestMetrics(page, testInfo) {
  const startedAt = Date.now();
  const jsErrors = [];
  const consoleErrors = [];
  const failedRequests = [];

  page.on('pageerror', (error) => {
    jsErrors.push({
      message: error.message,
      stack: error.stack,
    });
  });

  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      consoleErrors.push({
        type,
        text: msg.text(),
        location: msg.location(),
      });
    }
  });

  page.on('requestfailed', (request) => {
    failedRequests.push({
      url: request.url(),
      method: request.method(),
      failure: request.failure()?.errorText || 'unknown failure',
    });
  });

  const collectPerformanceMetrics = async () => {
    return await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      const paintMap = {};

      for (const entry of paint) {
        paintMap[entry.name] = entry.startTime;
      }

      const resources = performance.getEntriesByType('resource');

      return {
        domContentLoadedMs: nav ? nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart : 0,
        loadMs: nav ? nav.loadEventEnd - nav.loadEventStart : 0,
        firstPaintMs: paintMap['first-paint'] ?? 0,
        firstContentfulPaintMs: paintMap['first-contentful-paint'] ?? 0,
        resourceCount: resources.length,
      };
    });
  };

  const finalize = async () => {
    const endedAt = Date.now();
    const metrics = await collectPerformanceMetrics();
    const summary = {
      startedAt,
      endedAt,
      durationMs: endedAt - startedAt,
      jsErrors,
      consoleErrors,
      failedRequests,
      performance: metrics,
    };

    console.log('PLAYWRIGHT TEST METRICS');
    console.log(JSON.stringify(summary, null, 2));

    if (testInfo) {
      await testInfo.attach('playwright-test-metrics', {
        body: JSON.stringify(summary, null, 2),
        contentType: 'application/json',
      });
    }

    return summary;
  };

  return { finalize, jsErrors, consoleErrors, failedRequests, startedAt };
}
