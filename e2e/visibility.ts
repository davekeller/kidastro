/**
 * Visibility as a human experiences it, not as the DOM reports it.
 *
 * This exists because of a mistake worth keeping written down: checking
 * `getComputedStyle(h1).opacity` proves nothing. Opacity is not inherited — it
 * composites — so an `<h1>` reads `opacity: 1` while the `.motion-reveal`
 * wrapper one level up sits at `opacity: 0` and paints nothing. That is exactly
 * how the site ships: the heading is fine, the wrapper is what hides it.
 *
 * Playwright's `toBeVisible()` doesn't close the gap either — it checks the box
 * model and `visibility`, and treats a fully transparent element as visible.
 *
 * So: walk to the root and multiply.
 */
export function effectiveOpacity(el: Element): number {
  let node: Element | null = el;
  let opacity = 1;

  while (node) {
    const style = getComputedStyle(node);
    if (style.display === 'none') return 0;
    opacity *= Number(style.opacity);
    node = node.parentElement;
  }

  return opacity;
}

/** Everything needed to say "a reader can see this" in one round trip. */
export function paintedState(el: Element) {
  const box = el.getBoundingClientRect();
  const style = getComputedStyle(el);

  let node: Element | null = el;
  let opacity = 1;
  let hiddenBy: string | null = null;

  while (node) {
    const nodeStyle = getComputedStyle(node);
    if (nodeStyle.display === 'none') {
      opacity = 0;
      hiddenBy = `${node.tagName.toLowerCase()}.${node.className} (display:none)`;
      break;
    }
    const nodeOpacity = Number(nodeStyle.opacity);
    if (nodeOpacity < 0.01 && !hiddenBy) {
      hiddenBy = `${node.tagName.toLowerCase()}.${typeof node.className === 'string' ? node.className : ''}`.trim();
    }
    opacity *= nodeOpacity;
    node = node.parentElement;
  }

  return {
    opacity,
    width: box.width,
    height: box.height,
    visibility: style.visibility,
    /** Which element in the chain zeroed it out — the useful half of a failure. */
    hiddenBy,
  };
}
