import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import LyricsView from '@/components/lyrics/LyricsView';

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '700'],
});

// Hidden page — noindex, not in the sitemap, linked from nowhere.
export const metadata: Metadata = {
  title: { absolute: 'Paper Fang — Set Book' },
  description: 'Paper Fang lyric sheets and setlists.',
  robots: { index: false, follow: false },
};

export default function LyricsPage() {
  return (
    <main className={`${jetbrains.variable} relative z-10 min-h-screen overflow-x-hidden`}>
      <LyricsView />
    </main>
  );
}
