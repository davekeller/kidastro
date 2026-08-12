import React from 'react';
import Image from 'next/image';

/**
 * The folio's wordmark: the site icon plus `kidastro`, anchoring the top-left
 * corner opposite Mission Control's pill. Sub-pages use Breadcrumb in this spot
 * instead — same icon, same offsets, so the corner holds still between pages.
 * Carries no positioning of its own; the caller supplies `fixed top-6 left-6`.
 */
const SiteLogo = () => (
  <div className="inline-flex items-center gap-3 text-sm font-medium">
    <Image src="/imgs/icon.svg" alt="" width={40} height={40} priority />
    <span className="text-white/80">kidastro</span>
  </div>
);

export default SiteLogo;
