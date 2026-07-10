import type { Metadata } from 'next';
import Resume from '@/components/Resume';

export const metadata: Metadata = {
  title: 'Resume',
  description:
    'Resume of Dave Keller — a lead product designer and design engineer working on hard, technical AI and data products.',
  alternates: { canonical: '/resume' },
  openGraph: {
    type: 'profile',
    url: '/resume',
    title: 'Resume — Dave Keller',
    description:
      'Lead product designer and design engineer — 15+ years across AI, quantum, and data products.',
  },
};

export default function ResumePage() {
  return <Resume />;
}
