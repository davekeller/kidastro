import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import SkillsView from '@/components/skills/SkillsView';

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Skills',
  description:
    'The Claude Code skills Dave Keller runs every day, with the best practices baked into them — bundled and downloadable.',
  robots: { index: false, follow: false },
};

export default function SkillsPage() {
  return (
    <main className={`${jetbrains.variable} relative z-10 min-h-screen overflow-x-hidden`}>
      <SkillsView />
    </main>
  );
}
