'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import type { SkillDoc } from '@/data/docs-content';

interface DocDetailProps {
  doc: SkillDoc;
  onBack: () => void;
}

const DocDetail = ({ doc, onBack }: DocDetailProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto"
    >
      {/* Breadcrumb */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors mb-6 cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>dk-docs</span>
        <span className="text-white/30">/</span>
        <span className="text-white/70">{doc.title}</span>
      </button>

      {/* Header image */}
      <div className="relative aspect-[2/1] w-full rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-white/10 to-white/5">
        {doc.previewImage ? (
          <img src={doc.previewImage} alt={doc.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br opacity-30"
            style={{
              backgroundImage: `linear-gradient(135deg, ${doc.accentColor}44, transparent)`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
            style={{ backgroundColor: doc.accentColor + '22', color: doc.accentColor, border: `1px solid ${doc.accentColor}44` }}
          >
            Claude Skill
          </div>
          <h1 className="text-3xl font-bold text-white">{doc.title}</h1>
          <p className="text-white/60 mt-1 !text-base">{doc.subtitle}</p>
        </div>
      </div>

      {/* Markdown content */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold text-white mb-4 mt-0 first:hidden">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold text-white mb-3 mt-8 first:mt-0">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold text-white/90 mb-2 mt-6">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="text-white/60 mb-4 leading-relaxed !text-base">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-2 mb-4 text-white/60">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-2 mb-4 text-white/60">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-white/60 text-base">{children}</li>
            ),
            strong: ({ children }) => (
              <strong className="text-white font-semibold">{children}</strong>
            ),
            code: ({ children, className }) => {
              const isBlock =
                className?.includes('language-') ||
                (typeof children === 'string' && children.includes('\n'));
              if (isBlock) {
                return (
                  <code className="block bg-white/5 rounded-lg p-4 text-sm font-mono text-[#39d5cb] overflow-x-auto mb-4 border border-white/10">
                    {children}
                  </code>
                );
              }
              return (
                <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#39d5cb] text-sm font-mono">
                  {children}
                </code>
              );
            },
            pre: ({ children }) => (
              <pre className="mb-4">{children}</pre>
            ),
            hr: () => (
              <hr className="border-white/10 my-8" />
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-white/20 pl-4 italic text-white/50 mb-4">
                {children}
              </blockquote>
            ),
          }}
        >
          {doc.markdown}
        </ReactMarkdown>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="mt-8 mb-16 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to dk-docs
      </button>
    </motion.div>
  );
};

export default DocDetail;
