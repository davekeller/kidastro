/**
 * Serves `out/` the way GitHub Pages serves it, so the guard suite tests the
 * thing that actually ships.
 *
 * The resolution rules matter more than they look. A static export has no
 * server, so `/resume` is a *file* (`out/resume.html`) and `/resume/` is a
 * *directory* that has no `index.html` in it — meaning the trailing slash 404s
 * on the real site. A dev server that helpfully redirects one to the other
 * would hide exactly the broken-link class this suite exists to catch.
 *
 * Also mirrors the header that caused PR #61: HTML goes out with
 * `cache-control: max-age=600`, same as Pages.
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { join, normalize, extname } from 'node:path';

const ROOT = new URL('../out/', import.meta.url).pathname;
const PORT = Number(process.env.GUARD_PORT || 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.zip': 'application/zip',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

async function resolve(pathname) {
  // Reject traversal before it reaches the filesystem.
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const target = join(ROOT, clean);
  if (!target.startsWith(ROOT)) return null;

  const candidates = clean.endsWith('/')
    ? [join(target, 'index.html')]
    : [target, `${target}.html`, join(target, 'index.html')];

  for (const candidate of candidates) {
    // A directory is not a response — `/resume` must resolve to `resume.html`,
    // never to the `resume/` folder sitting next to it.
    const info = await stat(candidate).catch(() => null);
    if (info?.isFile()) return candidate;
  }
  return null;
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://localhost:${PORT}`);
  const file = await resolve(pathname);

  if (!file) {
    const notFound = join(ROOT, '404.html');
    const has404 = await stat(notFound).catch(() => null);
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    if (has404?.isFile() && req.method !== 'HEAD') return createReadStream(notFound).pipe(res);
    return res.end('Not Found');
  }

  const ext = extname(file);
  const headers = { 'content-type': TYPES[ext] || 'application/octet-stream' };
  // Pages caches HTML for ten minutes and fingerprinted assets forever. That
  // asymmetry is the whole cause of the stale-asset blank page.
  headers['cache-control'] = ext === '.html' ? 'max-age=600' : 'public, max-age=31536000, immutable';

  const info = await stat(file);
  headers['content-length'] = info.size;

  res.writeHead(200, headers);
  if (req.method === 'HEAD') return res.end();
  createReadStream(file).pipe(res);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`serving out/ at http://127.0.0.1:${PORT}`);
});
