import type { Metadata } from 'next';
import Resume from '@/components/Resume';

export const metadata: Metadata = {
  title: 'Resume — Dave Keller',
  description: 'Resume of Dave Keller — Director of Product, Product UX/UI Designer, Front-End Developer.',
};

export default function ResumePage() {
  return <Resume />;
}
