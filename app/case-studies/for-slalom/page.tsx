import type { Metadata } from 'next';
import AuraCaseStudy from '@/components/case-studies/AuraCaseStudy';
import SlalomMark from '@/components/case-studies/SlalomMark';

// The addressed copy of the Aura case study, shared by link with one team —
// noindex and not in the sitemap. The public version lives at
// /case-studies/strangeworks.
export const metadata: Metadata = {
  title: 'Aura — Case Study',
  description:
    'Case study: designing and building Aura, the AI-assisted optimization workflow at Strangeworks — from research and Figma flows to production code and agentic 2.0.',
  robots: { index: false, follow: false },
};

export default function AuraCaseStudyForSlalomPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden z-10">
      <AuraCaseStudy
        audience={{
          name: 'Lucy and the Slalom Team',
          date: 'August 11, 2026',
          mark: <SlalomMark className="h-10 w-auto text-white" />,
        }}
      />
    </main>
  );
}
