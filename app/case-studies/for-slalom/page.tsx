import type { Metadata } from 'next';
import AuraCaseStudy from '@/components/case-studies/AuraCaseStudy';

// Shared by link with recruiters — noindex while it's a working draft, and not
// in the sitemap. Flip robots + add a sitemap entry when it's ready to be public.
export const metadata: Metadata = {
  title: 'Aura — Case Study',
  description:
    'Case study: designing and building Aura, the AI-assisted optimization workflow at Strangeworks — from research and Figma flows to production code and agentic 2.0.',
  robots: { index: false, follow: false },
};

export default function AuraCaseStudyPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden z-10">
      <AuraCaseStudy />
    </main>
  );
}
