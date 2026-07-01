'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

// The one scroll-in animation used across the whole site: fade + slide up as the
// element enters view. `motion-print-safe` is forced visible in print (globals.css)
// so PDF/print output never depends on the animation having fired.
const FadeUp = ({ children, className = '', delay = 0 }: FadeUpProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={`motion-print-safe ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default FadeUp;
