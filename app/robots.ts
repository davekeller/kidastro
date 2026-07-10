import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

// Note: /skills and /dk-docs are excluded via noindex meta rather than a
// Disallow rule — crawlers must be able to fetch a page to see its noindex.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://kidastro.com/sitemap.xml',
  };
}
