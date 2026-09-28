/**
 * Self-heals a stale page load.
 *
 * Every deploy replaces the content-hashed files under /_next/static/, and the
 * new deployment doesn't serve the old ones. Vercel revalidates HTML on every
 * load, so a fresh visit always matches, but a page opened before a deploy can
 * still reach for a stylesheet or chunk that no longer exists. (GitHub Pages
 * made this worse by caching HTML for ten minutes, which is how PR #61 began.)
 * The request 404s, no CSS and no JS apply, and you get a white page with a
 * stray "kidastro" in the corner — until you refresh.
 *
 * This runs before the chunks and reloads once when it sees that happen: on a 404
 * from any /_next/static/ asset, or on a finished load where globals.css clearly
 * never applied. The timestamp guard means a genuinely broken deploy reloads once
 * and then leaves the page alone rather than looping.
 *
 * It has to be a plain inline <script> in <head>, not next/script — a
 * beforeInteractive script is queued onto `self.__next_s` and replayed by Next's
 * own runtime chunk, which is exactly the file that isn't there in this failure.
 */
const RECOVERY_SCRIPT = `(function () {
  var KEY = 'kidastro:asset-recovery';
  function recover() {
    try {
      var last = +(sessionStorage.getItem(KEY) || 0);
      if (Date.now() - last < 30000) return;
      sessionStorage.setItem(KEY, String(Date.now()));
    } catch (err) {}
    location.reload();
  }
  addEventListener('error', function (event) {
    var el = event.target;
    if (!el || (el.tagName !== 'SCRIPT' && el.tagName !== 'LINK')) return;
    if ((el.src || el.href || '').indexOf('/_next/static/') === -1) return;
    recover();
  }, true);
  addEventListener('load', function () {
    // globals.css paints a gradient on <body>; no gradient means no stylesheet.
    if (getComputedStyle(document.body).backgroundImage === 'none') recover();
  });
})();`;

export default function AssetRecovery() {
  return <script dangerouslySetInnerHTML={{ __html: RECOVERY_SCRIPT }} />;
}
