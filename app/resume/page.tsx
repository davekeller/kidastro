import type { Metadata } from 'next';
import Resume from '@/components/Resume';

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Resume of Dave Keller — a lead product designer and design engineer shipping hard, technical AI and data products in days, not weeks.',
  alternates: { canonical: '/resume' },
  openGraph: {
    type: 'profile',
    url: '/resume',
    title: 'Resume — Dave Keller',
    description:
      'Lead product designer and design engineer — 15+ years across AI, quantum, and data products, now designing in the browser with Claude Code, Codex, and Tailwind.',
  },
};

export default function ResumePage() {
  return <Resume />;
}
