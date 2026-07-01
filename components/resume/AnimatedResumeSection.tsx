'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedResumeSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

// Scroll-triggered fade-up for resume sections, matching the portfolio's feel.
// The `motion-print-safe` class is forced visible in print (see globals.css) so
// the PDF export always renders, even for sections that never scrolled into view.
const AnimatedResumeSection = ({ children, className = '', delay = 0 }: AnimatedResumeSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={`motion-print-safe ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedResumeSection;
