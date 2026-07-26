import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JetBrains_Mono } from 'next/font/google';
import { SONGS, songBySlug } from '@/data/lyrics';
import LyricSheet from '@/components/lyrics/LyricSheet';

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '700'],
});

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SONGS.map((song) => ({ slug: song.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const song = songBySlug(slug);
  return {
    title: { absolute: song ? `${song.title} — Paper Fang` : 'Paper Fang' },
    robots: { index: false, follow: false },
  };
}

export default async function SongPage({ params }: Props) {
  const { slug } = await params;
  const song = songBySlug(slug);
  if (!song) notFound();

  return (
    <main className={`${jetbrains.variable} relative z-10 min-h-screen overflow-x-hidden`}>
      <LyricSheet song={song} />
    </main>
  );
}
