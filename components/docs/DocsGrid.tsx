'use client';

import React from 'react';
import { motion } from 'framer-motion';
import DocCard from './DocCard';
import type { DocCard as DocCardType } from '@/data/docs-content';

interface DocsGridProps {
  cards: DocCardType[];
  onSelectSkill: (slug: string) => void;
}

const DocsGrid = ({ cards, onSelectSkill }: DocsGridProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="columns-1 md:columns-2 lg:columns-3 gap-6"
    >
      {cards.map((card) => {
        const key = card.type === 'skill' ? card.slug : card.id;
        return (
          <DocCard
            key={key}
            card={card}
            onSelectSkill={onSelectSkill}
          />
        );
      })}
    </motion.div>
  );
};

export default DocsGrid;
