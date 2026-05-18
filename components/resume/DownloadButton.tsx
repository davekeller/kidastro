import React from 'react';

const DownloadButton = () => {
  return (
    <div className="mb-12 flex justify-start sm:justify-end">
      <a
        href="/Dave_Keller_Resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/70 transition-colors hover:border-(--color-2) hover:text-(--color-2)"
      >
        Download PDF
      </a>
    </div>
  );
};

export default DownloadButton;
