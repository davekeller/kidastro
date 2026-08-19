import { test, expect, type Page, type ConsoleMessage } from '@playwright/test';
import {
  PROTECTED_PAGES,
  IGNORED_CONSOLE,
  IGNORED_REQUEST_FAILURES,
  ONLY_IN_DEPLOYED_BUILD,
  isLive,
  type ProtectedPage,
} from './protected';
import { paintedState } from './visibility';

/**
 * Does this page work for someone who has never been here before?
 *
 * The assertion that carries the most weight is the visibility one. PR #61 was
 * a page that returned HTTP 200 and painted nothing: every scroll-in section
 * ships at inline `opacity:0`, so a load that lost its stylesheet or never got
 * an animation frame looked fine to any status-code check and blank to a human.
 * Playwright's own `toBeVisible()` does not look at opacity either. So we read
 * the computed opacity and the box, and require both.
 */

/** Scrolls the full page so every `whileInView` reveal has had its chance. */
async function scrollThroughPage(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    const height = () => document.body.scrollHeight;
    for (let y = 0; y < height(); y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, height());
  });
  // Longest reveal is 0.8s, and the no-JS CSS fallback waits 1.2s before it
  // starts. Wait past both so a slow reveal isn't reported as a hidden one.
  await page.waitForTimeout(2_200);
  await page.evaluate(() => window.scrollTo(0, 0));
}

function watchForBreakage(page: Page) {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];

  page.on('console', (message: ConsoleMessage) => {
    if (message.type() !== 'error') return;
    const text = message.text();
    if (IGNORED_CONSOLE.some((pattern) => pattern.test(text))) return;
    consoleErrors.push(text);
  });

  page.on('pageerror', (error) => {
    consoleErrors.push(`uncaught: ${error.message}`);
  });

  page.on('response', (response) => {
    if (response.status() < 400) return;
    const url = response.url();
    // A third-party host being down is not our page being broken.
    const sameOrigin = new URL(url).origin === new URL(page.url() || url).origin;
    if (!sameOrigin) return;
    if (IGNORED_REQUEST_FAILURES.some((pattern) => pattern.test(url))) return;
    failedRequests.push(`${response.status()} ${url}`);
  });

  return { consoleErrors, failedRequests };
}

for (const target of PROTECTED_PAGES) {
  test.describe(target.name, () => {
    test(`renders for a first-time visitor (${target.path})`, async ({ page }, testInfo) => {
      const { consoleErrors, failedRequests } = watchForBreakage(page);

      const response = await page.goto(target.path, { waitUntil: 'load' });
      expect(response?.status(), `${target.path} did not return 200`).toBe(200);
      await expect(page).toHaveTitle(target.title);

      // --- the blank-page check -------------------------------------------
      const heading = page.locator('h1').first();
      await expect(heading).toHaveText(target.heading);

      // Poll rather than sample: the entrance animation is a 0.8s fade, so a
      // single read right after `load` catches the heading mid-way and reports
      // a healthy page as blank. What matters is that it *arrives* — a page
      // that is genuinely broken never does, and fails on the timeout.
      await expect
        .poll(async () => (await heading.evaluate(paintedState)).opacity, {
          message: `<h1> on ${target.path} never became visible — this is the blank page a recruiter sees`,
          timeout: 10_000,
        })
        .toBeGreaterThan(0.9);

      const painted = await heading.evaluate(paintedState);
      expect(painted.width, `<h1> on ${target.path} has no width`).toBeGreaterThan(0);
      expect(painted.height, `<h1> on ${target.path} has no height`).toBeGreaterThan(0);
      expect(painted.visibility).toBe('visible');

      // --- did the stylesheet actually apply? ------------------------------
      // globals.css paints a gradient on <body>. No gradient means no CSS —
      // the same sentinel the site's own recovery script uses.
      const backgroundImage = await page.evaluate(
        () => getComputedStyle(document.body).backgroundImage,
      );
      expect(
        backgroundImage,
        `${target.path} rendered without its stylesheet — white page`,
      ).not.toBe('none');

      // --- nothing stranded invisible --------------------------------------
      await scrollThroughPage(page);
      const stranded = await page.evaluate(() => {
        const out: string[] = [];
        document.querySelectorAll('.motion-reveal').forEach((el) => {
          const box = el.getBoundingClientRect();
          // Only elements that occupy space can be "stranded". A collapsed or
          // display:none element is a layout choice, not a failed reveal.
          if (box.width === 0 || box.height === 0) return;
          if (Number(getComputedStyle(el).opacity) > 0.01) return;
          out.push((el.textContent || '').trim().slice(0, 60) || el.className);
        });
        return out;
      });
      expect(
        stranded,
        `${stranded.length} section(s) on ${target.path} never became visible`,
      ).toEqual([]);

      // --- keep the screenshot to look at, never to diff --------------------
      await testInfo.attach(`${target.name}.png`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      expect(consoleErrors, `console errors on ${target.path}`).toEqual([]);
      expect(failedRequests, `failed requests on ${target.path}`).toEqual([]);
    });

    test(`every link resolves (${target.path})`, async ({ page }) => {
      await page.goto(target.path, { waitUntil: 'load' });
      const origin = new URL(page.url()).origin;

      const links: string[] = await page.evaluate(
        (pageOrigin) =>
          Array.from(document.querySelectorAll('a[href]'))
            .map((a) => (a as HTMLAnchorElement).href)
            .filter((href) => href.startsWith(pageOrigin))
            .map((href) => href.split('#')[0])
            .filter((href, index, all) => href && all.indexOf(href) === index),
        origin,
      );

      const broken: string[] = [];
      for (const link of links) {
        const path = new URL(link).pathname;
        if (!isLive && ONLY_IN_DEPLOYED_BUILD.some((pattern) => pattern.test(path))) continue;
        // Exact URL on purpose. A static export has no server to normalise a
        // trailing slash, so `/resume/` really is a 404 on the live site.
        const result = await page.request.get(link, { failOnStatusCode: false });
        if (result.status() >= 400) broken.push(`${result.status()} ${link}`);
      }

      expect(broken, `dead links on ${target.path}`).toEqual([]);
    });
  });
}

test('the protected list still covers every case study that exists', async ({ page }) => {
  // A new case study page added without being added here would ship unguarded.
  await page.goto('/', { waitUntil: 'load' });
  const guarded = new Set(PROTECTED_PAGES.map((p: ProtectedPage) => p.path));
  const caseStudyLinks: string[] = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href*="/case-studies/"]')).map(
      (a) => new URL((a as HTMLAnchorElement).href).pathname,
    ),
  );
  const unguarded = [...new Set(caseStudyLinks)].filter((path) => !guarded.has(path));
  expect(
    unguarded,
    'case study pages linked from the home page but missing from e2e/protected.ts',
  ).toEqual([]);
});
