'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { DocCard as DocCardType, CardSize } from '@/data/docs-content';

const aspectMap: Record<CardSize, string> = {
  small: 'aspect-square',
  medium: 'aspect-[4/3]',
  tall: 'aspect-[3/4]',
  wide: 'aspect-[2/1]',
  featured: 'aspect-[4/3]',
};

const placeholderColors: Record<string, string> = {
  'var(--color-1)': 'from-yellow-500/30 to-yellow-900/20',
  'var(--color-2)': 'from-teal-500/30 to-teal-900/20',
  'var(--color-3)': 'from-pink-500/30 to-pink-900/20',
};

interface DocCardProps {
  card: DocCardType;
  onSelectSkill?: (slug: string) => void;
}

const DocCard = ({ card, onSelectSkill }: DocCardProps) => {
  const isSkill = card.type === 'skill';

  const handleClick = () => {
    if (isSkill && onSelectSkill) {
      onSelectSkill(card.slug);
    }
  };

  if (isSkill) {
    const aspect = aspectMap[card.size];
    return (
      <motion.button
        onClick={handleClick}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        whileHover={{ scale: 1.02 }}
        className="w-full text-left break-inside-avoid mb-6 group cursor-pointer"
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transition-colors duration-300 group-hover:border-white/20">
          {/* Preview image / placeholder */}
          <div className={`relative ${aspect} w-full bg-gradient-to-br ${placeholderColors[card.accentColor] || 'from-white/10 to-white/5'}`}>
            {card.previewImage ? (
              <img src={card.previewImage} alt={card.title} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl opacity-20">{'{ }'}</span>
              </div>
            )}
            {/* Badge */}
            <div
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
              style={{ backgroundColor: card.accentColor + '22', color: card.accentColor, border: `1px solid ${card.accentColor}44` }}
            >
              Claude Skill
            </div>
          </div>
          {/* Info */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-1">{card.title}</h3>
            <p className="text-sm text-white/50 !text-sm">{card.subtitle}</p>
          </div>
        </div>
      </motion.button>
    );
  }

  // Instagram embed card
  // Convert post URL to embed URL: /p/SHORTCODE/ → /p/SHORTCODE/embed/
  const embedUrl = card.postUrl.replace(/\/?$/, '') + '/embed/';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="break-inside-avoid mb-6"
    >
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <iframe
          src={embedUrl}
          className="w-full border-0"
          style={{ minHeight: 480 }}
          allowTransparency
          loading="lazy"
        />
      </div>
    </motion.div>
  );
};

export default DocCard;
