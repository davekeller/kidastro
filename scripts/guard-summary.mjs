/**
 * Turns Playwright's JSON output into something worth reading at a glance.
 *
 * Used by the live-check workflow to write a GitHub issue body, and by
 * `/site-check` to answer "what would a recruiter see right now". Prints
 * markdown to stdout and exits non-zero when anything failed.
 *
 *   node scripts/guard-summary.mjs [guard-results.json]
 */
import { readFileSync } from 'node:fs';

const path = process.argv[2] || 'guard-results.json';

let report;
try {
  report = JSON.parse(readFileSync(path, 'utf8'));
} catch {
  console.log(`Could not read \`${path}\` — the suite did not get far enough to write results.`);
  process.exit(1);
}

/** Playwright nests suites arbitrarily deep; flatten to the specs. */
function collectSpecs(suite, out = []) {
  for (const spec of suite.specs || []) out.push(spec);
  for (const child of suite.suites || []) collectSpecs(child, out);
  return out;
}

const specs = (report.suites || []).flatMap((suite) => collectSpecs(suite));
const failures = [];
let passed = 0;
let skipped = 0;

for (const spec of specs) {
  for (const test of spec.tests || []) {
    const last = test.results?.[test.results.length - 1];
    if (!last) continue;
    if (last.status === 'skipped') {
      skipped += 1;
      continue;
    }
    if (test.status === 'expected' || last.status === 'passed') {
      passed += 1;
      continue;
    }
    const message = (last.errors?.[0]?.message || last.error?.message || 'no error message')
      // Strip ANSI so the issue body isn't full of escape codes.
      .replace(/\[[0-9;]*m/g, '')
      .split('\n')
      .slice(0, 6)
      .join('\n')
      .trim();
    failures.push({ title: spec.title, file: spec.file, message });
  }
}

const target = process.env.SITE_BASE_URL || 'the local build';

if (failures.length === 0) {
  console.log(`All ${passed} checks passed against ${target}${skipped ? ` (${skipped} skipped)` : ''}.`);
  process.exit(0);
}

const lines = [
  `**${failures.length} check${failures.length === 1 ? '' : 's'} failed** against ${target} — ${passed} passed${skipped ? `, ${skipped} skipped` : ''}.`,
  '',
];

for (const failure of failures) {
  lines.push(`### ${failure.title}`);
  lines.push('');
  lines.push('```');
  lines.push(failure.message);
  lines.push('```');
  lines.push('');
}

console.log(lines.join('\n'));
process.exit(1);
