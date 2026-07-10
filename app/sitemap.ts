import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

// Only the indexable pages — /skills and /dk-docs are noindex.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://kidastro.com/',
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://kidastro.com/resume',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}
