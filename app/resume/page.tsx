import type { Metadata } from 'next';
import Resume from '@/components/Resume';

export const metadata: Metadata = {
  title: 'Resume — Dave Keller',
  description: 'Resume of Dave Keller — a principal-level product designer and design engineer working on hard, technical AI and data products.',
};

export default function ResumePage() {
  return <Resume />;
}
