import { defineConfig, devices } from '@playwright/test';

/**
 * One suite, two jobs.
 *
 *   npm run guard            → builds the site and checks the local `out/`.
 *                              This is the pull-request gate.
 *   SITE_BASE_URL=https://kidastro.com npm run guard:live
 *                            → checks the real site after a deploy.
 *
 * Set GUARD_SKIP_BUILD=1 to reuse an existing `out/` while iterating.
 */
const PORT = Number(process.env.GUARD_PORT || 4321);
const LOCAL_URL = `http://127.0.0.1:${PORT}`;
const baseURL = process.env.SITE_BASE_URL || LOCAL_URL;
const isLive = Boolean(process.env.SITE_BASE_URL);

export default defineConfig({
  testDir: './e2e',
  // The whole point is a clear verdict, so let every page report rather than
  // bailing on the first failure.
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  // A live check retries: GitHub Pages holds HTML for ten minutes, so a page
  // fetched seconds after a deploy can legitimately be mid-swap. Local runs get
  // no retries — a flaky gate is a gate people learn to ignore.
  retries: isLive ? 3 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['github'], ['list'], ['json', { outputFile: 'guard-results.json' }]]
    : [['list']],
  timeout: 45_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL,
    screenshot: 'only-on-failure',
    video: 'off',
    trace: process.env.CI ? 'retain-on-failure' : 'off',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  // Live runs point at Pages; local runs need the site built and served the way
  // Pages serves it.
  webServer: isLive
    ? undefined
    : {
        command: process.env.GUARD_SKIP_BUILD
          ? 'node scripts/serve-out.mjs'
          : 'npm run build && node scripts/serve-out.mjs',
        url: LOCAL_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 240_000,
        stdout: 'pipe',
      },
});
