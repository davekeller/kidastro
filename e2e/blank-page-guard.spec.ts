import { test, expect } from '@playwright/test';
import { PROTECTED_PAGES, isLive } from './protected';
import { paintedState } from './visibility';

/**
 * Re-tests the two failures PR #61 fixed, both of which served HTTP 200 and
 * painted nothing.
 *
 * These run against a local build only. The real trigger is a browser holding
 * ten-minute-stale HTML that points at asset filenames the deploy already
 * replaced — a state a CI runner with a cold cache will never reach on its own.
 * Simulating it here is honest; claiming the live check covers it would not be.
 */
test.describe('blank-page guard', () => {
  test.skip(isLive, 'simulates conditions a live check cannot create');

  for (const target of PROTECTED_PAGES) {
    test(`renders with JavaScript disabled (${target.path})`, async ({ browser }) => {
      // With JS off, framer-motion never hydrates, so every scroll-in section
      // keeps the inline `opacity:0` it shipped with. The only thing that can
      // reveal it is the CSS fallback in globals.css — which is the guard.
      const context = await browser.newContext({ javaScriptEnabled: false });
      const page = await context.newPage();

      try {
        await page.goto(target.path, { waitUntil: 'load' });

        const heading = page.locator('h1').first();
        await expect(heading).toHaveText(target.heading);

        // The CSS fallback waits 1.2s before it starts and runs for 0.4s, so
        // give it comfortably past that. Without the guard it never arrives.
        await expect
          .poll(async () => (await heading.evaluate(paintedState)).opacity, {
            message: `${target.path} is blank without JavaScript — the globals.css blank-page guard has regressed`,
            timeout: 8_000,
          })
          .toBeGreaterThan(0.9);
      } finally {
        await context.close();
      }
    });
  }

  test('recovers when a stale load 404s its stylesheet', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    let stylesheetsBlocked = 0;
    let documentRequests = 0;

    // Fail the stylesheet exactly once, the way a stale index.html pointing at a
    // replaced content hash would. The reload must then get the real file.
    await page.route('**/_next/static/**/*.css', async (route) => {
      if (stylesheetsBlocked === 0) {
        stylesheetsBlocked += 1;
        return route.fulfill({ status: 404, contentType: 'text/plain', body: 'gone' });
      }
      return route.continue();
    });

    page.on('request', (request) => {
      if (request.resourceType() === 'document') documentRequests += 1;
    });

    try {
      await page.goto('/', { waitUntil: 'load' });
      // AssetRecovery reloads on the stylesheet's error event. Give it room.
      await page.waitForTimeout(5_000);
      await page.waitForLoadState('load');

      expect(stylesheetsBlocked, 'the stylesheet was never blocked — test is not exercising anything').toBe(1);
      expect(
        documentRequests,
        'the page never reloaded — AssetRecovery did not fire, so a stale load stays blank',
      ).toBeGreaterThan(1);

      const backgroundImage = await page.evaluate(
        () => getComputedStyle(document.body).backgroundImage,
      );
      expect(backgroundImage, 'the recovered page still has no stylesheet').not.toBe('none');

      const heading = page.locator('h1').first();
      await expect
        .poll(async () => (await heading.evaluate(paintedState)).opacity, {
          message: 'the recovered page is still blank',
          timeout: 8_000,
        })
        .toBeGreaterThan(0.9);
    } finally {
      await context.close();
    }
  });

  test('a trailing slash still 404s, so links must not grow one', async ({ request, baseURL }) => {
    // Not a bug to fix — it is how a static export behaves, and the reason the
    // link check above compares exact URLs. This test exists so that if the
    // hosting ever changes, the assumption gets revisited rather than silently
    // becoming wrong.
    const response = await request.get(new URL('/resume/', baseURL).toString(), {
      failOnStatusCode: false,
    });
    expect(response.status()).toBe(404);
  });
});
