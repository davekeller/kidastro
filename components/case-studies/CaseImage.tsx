import React from 'react';
import Image from 'next/image';

interface CaseImageProps {
  src?: string;
  alt: string;
  /** Floating pill label over the image, matching the folio's overlay style. */
  label?: string;
  /** For unpulled art: a note describing what goes here (renders a placeholder frame). */
  note?: string;
  className?: string;
}

/**
 * An image slot for case-study layouts. With `src` it renders the standard
 * folio image treatment (rounded, shadow, optional overlay pill). Without
 * `src` it renders a dashed placeholder frame carrying `note`, so layouts can
 * be art-directed before the Figma pulls and product screenshots exist.
 */
const CaseImage = ({ src, alt, label, note, className = '' }: CaseImageProps) => {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white/40 backdrop-blur-sm px-4 py-2 rounded-lg shadow-xl z-10 text-center">
          <h5 className="text-black font-bold text-xl">{label}</h5>
        </div>
      )}
      {src ? (
        <Image src={src} alt={alt} width={800} height={600} className="w-full rounded shadow-2xl" />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded border-2 border-dashed border-white/25 bg-white/5 px-6 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">image slot</span>
          {note && <span className="max-w-md text-sm text-white/60 text-balance">{note}</span>}
        </div>
      )}
    </div>
  );
};

export default CaseImage;
