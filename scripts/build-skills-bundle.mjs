import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
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

mkdirSync(outDir, { recursive: true });
rmSync(outZip, { force: true });
execSync(`zip -r -X "${outZip}" . -x "*.DS_Store"`, { cwd: src, stdio: 'inherit' });
console.log(`Skills bundle written to ${path.relative(repo, outZip)}`);
