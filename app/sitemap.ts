import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

// Only the indexable pages — /skills, /lyrics, and the addressed copy of the
// case study at /case-studies/for-slalom are noindex.
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
    {
      url: 'https://kidastro.com/case-studies/strangeworks',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://kidastro.com/games',
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
