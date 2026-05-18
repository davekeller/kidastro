import React from 'react';

const DownloadButton = () => {
  return (
    <a
      href="/Dave_Keller_Resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-6 right-6 z-20 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-5 py-2 text-sm font-medium text-white/70 backdrop-blur-md transition-colors hover:border-(--color-2) hover:text-(--color-2)"
    >
      Download PDF
    </a>
  );
};

export default DownloadButton;
