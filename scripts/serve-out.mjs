/**
 * Serves `out/` the way Vercel serves it, so the guard suite tests the thing
 * that actually ships.
 *
 * The resolution rules matter more than they look. `/resume` is a *file*
 * (`out/resume.html`). `/resume/` is a 308 to `/resume`, because vercel.json
 * sets `trailingSlash: false`. And `/resume.html` is a 404, not the page. A dev
 * server that quietly served all three would hide links that only work by
 * accident.
 *
 * Headers match Vercel's too: everything goes out with `max-age=0,
 * must-revalidate` except the fingerprinted files under /_next/static/, which
 * are cached for a year.
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
  // A page only answers at its extensionless URL; Vercel 404s `/resume.html`.
  if (clean.endsWith('.html')) return null;
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

const REVALIDATE = 'public, max-age=0, must-revalidate';

const server = createServer(async (req, res) => {
  const { pathname, search } = new URL(req.url, `http://localhost:${PORT}`);

  // vercel.json `trailingSlash: false`: a relative 308 that keeps the query.
  if (pathname.length > 1 && pathname.endsWith('/')) {
    res.writeHead(308, { location: pathname.replace(/\/+$/, '') + search, 'content-type': 'text/plain' });
    return res.end('Redirecting...');
  }

  const file = await resolve(pathname);

  if (!file) {
    const notFound = join(ROOT, '404.html');
    const has404 = await stat(notFound).catch(() => null);
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8', 'cache-control': REVALIDATE });
    if (has404?.isFile() && req.method !== 'HEAD') return createReadStream(notFound).pipe(res);
    return res.end('Not Found');
  }

  const ext = extname(file);
  const headers = { 'content-type': TYPES[ext] || 'application/octet-stream' };
  // Vercel revalidates everything on every load except the content-hashed
  // build output, which never changes under the same name.
  headers['cache-control'] = pathname.startsWith('/_next/static/')
    ? 'public,max-age=31536000,immutable'
    : REVALIDATE;

  const info = await stat(file);
  headers['content-length'] = info.size;

  res.writeHead(200, headers);
  if (req.method === 'HEAD') return res.end();
  createReadStream(file).pipe(res);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`serving out/ at http://127.0.0.1:${PORT}`);
});
