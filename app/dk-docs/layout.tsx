import type { Metadata } from 'next';

// Personal docs — keep out of search indexes (the page itself is a client
// component, so metadata lives here).
export const metadata: Metadata = {
  title: 'Docs',
  robots: { index: false, follow: false },
};

export default function DkDocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
