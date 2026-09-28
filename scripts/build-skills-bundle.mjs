import { execFileSync, execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(repo, 'skills-library');
const outDir = path.join(repo, 'public', 'downloads');
const outZip = path.join(outDir, 'dave-claude-skills.zip');

if (!existsSync(src)) {
  console.error('skills-library/ not found — nothing to bundle');
  process.exit(1);
}

const hasZip = (() => {
  try {
    execSync('command -v zip', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

mkdirSync(outDir, { recursive: true });
rmSync(outZip, { force: true });
if (hasZip) {
  execSync(`zip -r -X "${outZip}" . -x "*.DS_Store"`, { cwd: src, stdio: 'inherit' });
} else {
  // Vercel's build image has no `zip`, but it has bsdtar, which writes the same
  // archive. Naming the top-level entries (not `.`) keeps `./` off every path.
  const entries = readdirSync(src).filter((name) => name !== '.DS_Store');
  execFileSync('bsdtar', ['--format', 'zip', '--exclude', '.DS_Store', '-cf', outZip, ...entries], {
    cwd: src,
    stdio: 'inherit',
  });
}
console.log(`Skills bundle written to ${path.relative(repo, outZip)}`);
