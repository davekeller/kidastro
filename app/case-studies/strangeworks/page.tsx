import type { Metadata } from 'next';
import AuraCaseStudy from '@/components/case-studies/AuraCaseStudy';

// The Aura case study, public and indexed — the folio's Strangeworks section
// links here. The addressed copy at /case-studies/for-slalom stays noindex.
export const metadata: Metadata = {
  title: 'Strangeworks Aura — Case Study',
  description:
    'Case study: designing and building Aura, the AI-assisted optimization workflow at Strangeworks — from research and Figma flows to production code and agentic 2.0.',
  alternates: { canonical: '/case-studies/strangeworks' },
};

export default function StrangeworksCaseStudyPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden z-10">
      <AuraCaseStudy />
    </main>
  );
}
