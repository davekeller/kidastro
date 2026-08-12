import type { Metadata } from 'next';
import AuraCaseStudy from '@/components/case-studies/AuraCaseStudy';

// The Aura case study. Held back while the folio link is designed: noindex and
// out of the sitemap for now. TO PUBLISH: drop the `robots` line below and add
// the page back to app/sitemap.ts — the canonical is already in place.
export const metadata: Metadata = {
  title: 'Strangeworks Aura — Case Study',
  description:
    'Case study: designing and building Aura, the AI-assisted optimization workflow at Strangeworks — from research and Figma flows to production code and agentic 2.0.',
  alternates: { canonical: '/case-studies/strangeworks' },
  robots: { index: false, follow: false },
};

export default function StrangeworksCaseStudyPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden z-10">
      <AuraCaseStudy />
    </main>
  );
}
