'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedSectionProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

const AnimatedSection = ({ className = '', children, delay = 0 }: AnimatedSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={`section relative mx-auto grid gap-8 overflow-hidden w-[96%] ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
