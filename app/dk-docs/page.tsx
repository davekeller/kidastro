'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Breadcrumb from '@/components/Breadcrumb';
import PageToggle from '@/components/PageToggle';
import DocsGrid from '@/components/docs/DocsGrid';
import DocDetail from '@/components/docs/DocDetail';
import { allCards, skillDocs } from '@/data/docs-content';

export default function DkDocsPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const selectedDoc = selectedSlug
    ? skillDocs.find((d) => d.slug === selectedSlug) ?? null
    : null;

  const handleSelectSkill = (slug: string) => {
    setSelectedSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden z-10">
      <div className="w-full pt-8 pb-4 sticky top-0 z-40">
        <PageToggle />
      </div>

      {/* After the sticky strip above: PageToggle renders null today, leaving an
          invisible full-width z-40 band that would otherwise swallow clicks on
          the breadcrumb. Same z-index, later in the DOM, so this wins. */}
      <div className="fixed top-6 left-6 z-40 print:hidden">
        <Breadcrumb label="docs" />
      </div>

      <div className="w-[96%] max-w-6xl pt-20 pb-8">
        <AnimatePresence mode="wait">
          {selectedDoc ? (
            <DocDetail key={selectedDoc.slug} doc={selectedDoc} onBack={handleBack} />
          ) : (
            <DocsGrid key="grid" cards={allCards} onSelectSkill={handleSelectSkill} />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
