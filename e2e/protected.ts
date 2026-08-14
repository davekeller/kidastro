/**
 * The pages recruiters read. Breaking one of these is the failure this whole
 * suite exists to prevent, so the list is deliberately short — add a page here
 * only if a broken version of it would cost you a job.
 */
export type ProtectedPage = {
  /** Exact path. No trailing slash: a static export 404s on `/resume/`. */
  path: string;
  /** How the page is described in failure output. */
  name: string;
  title: RegExp;
  /** Text that must be visibly painted, not merely present in the DOM. */
  heading: RegExp;
};

export const PROTECTED_PAGES: ProtectedPage[] = [
  {
    path: '/',
    name: 'folio home',
    title: /^Dave Keller — Lead Product Designer & Design Engineer$/,
    heading: /so nice to meet you/i,
  },
  {
    path: '/resume',
    name: 'resume',
    title: /^Resume — Dave Keller$/,
    heading: /Dave Keller/,
  },
  {
    path: '/case-studies/for-slalom',
    name: 'Slalom case study',
    title: /Case Study — Dave Keller$/,
    heading: /I['’]m Dave, and I built this for you today/,
  },
  {
    // Same component as /for-slalom, rendered for a different audience — hence
    // a different <h1>. Asserting the real one keeps the two pages honest about
    // being distinct rather than accidentally identical.
    path: '/case-studies/strangeworks',
    name: 'Strangeworks case study',
    title: /Case Study — Dave Keller$/,
    heading: /Strangeworks Aura/,
  },
];

/** Files a recruiter clicks. A dead download reads the same as a dead page. */
export const PROTECTED_DOWNLOADS = [
  { path: '/dave-keller-resume.pdf', type: /application\/pdf/, minBytes: 20_000 },
  {
    path: '/dave-keller-resume.docx',
    type: /officedocument\.wordprocessingml|application\/octet-stream|application\/zip/,
    minBytes: 20_000,
  },
];

/**
 * Console noise that is not a broken page. Keep this list short and specific —
 * every entry is a class of real error the guard can no longer see.
 */
export const IGNORED_CONSOLE = [
  // Chromium logs this for any cross-origin resource blocked by an extension or
  // a network hiccup on the runner; it says nothing about our markup.
  /net::ERR_(BLOCKED_BY_CLIENT|NETWORK_CHANGED)/,
];

/** Requests whose failure doesn't mean the page is broken for a reader. */
export const IGNORED_REQUEST_FAILURES = [
  /\/favicon\.ico$/,
  // Third-party hosts are not ours to keep alive; only same-origin failures
  // are treated as breakage (enforced separately in the spec).
];

export const isLive = Boolean(process.env.SITE_BASE_URL);
