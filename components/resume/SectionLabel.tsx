import React from 'react';

type Props = {
  children: React.ReactNode;
};

const SectionLabel = ({ children }: Props) => {
  return (
    <h2 className="mb-6 border-b border-white/10 pb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40 print:mb-3 print:pb-2 print:text-gray-600 print:border-gray-300">
      {children}
    </h2>
  );
};

export default SectionLabel;
