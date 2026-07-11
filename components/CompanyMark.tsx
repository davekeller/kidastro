import React from 'react';

// Monochrome company marks for the work-card headers.
// Strangeworks, OpenCourt, and BnbFinder are traced from the real logo assets;
// QuotaPath is redrawn from their compass mark; the rest are idea icons for
// brands whose sites are gone (Rodio, Rocket, Timebomb, Dancefight).

const glyphs: Record<string, React.ReactNode> = {
  strangeworks: (
    <svg viewBox="0 0 20.825 20.825" fill="currentColor" aria-hidden="true" className="w-6 h-6">
      <circle cx="9.775" cy="1.275" r="1.275" />
      <circle cx="14.025" cy="5.525" r="1.275" />
      <circle cx="1.275" cy="9.775" r="1.275" />
      <circle cx="5.525" cy="9.775" r="1.275" />
      <circle cx="9.775" cy="9.775" r="1.275" />
      <circle cx="14.025" cy="9.775" r="1.275" />
      <circle cx="18.275" cy="9.775" r="1.275" />
      <circle cx="14.025" cy="14.025" r="1.275" />
      <circle cx="9.775" cy="18.275" r="1.275" />
    </svg>
  ),
  quotapath: (
    <svg viewBox="0 0 36 36" fill="currentColor" aria-hidden="true" className="w-7 h-7">
      <circle cx="18" cy="18" r="3.3" />
      <path d="M12.1 14.6 L8.65 12.6 A10.8 10.8 0 0 1 27.35 12.6 Q30.8 12.9 32.7 15.9 L23.9 14.6 A6.8 6.8 0 0 0 12.1 14.6 Z" />
      <path d="M12.1 14.6 L8.65 12.6 A10.8 10.8 0 0 1 27.35 12.6 Q30.8 12.9 32.7 15.9 L23.9 14.6 A6.8 6.8 0 0 0 12.1 14.6 Z" transform="rotate(180 18 18)" />
    </svg>
  ),
  opencourt: (
    <svg viewBox="0 0 36 36" fill="currentColor" aria-hidden="true" className="w-7 h-7">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31.6033 8.97023C33.3236 11.5565 34.326 14.6614 34.326 18.0004C34.326 27.0168 27.0168 34.326 18.0004 34.326C8.98402 34.326 1.6748 27.0168 1.6748 18.0004C1.6748 8.98402 8.98402 1.6748 18.0004 1.6748C23.6777 1.6748 28.6782 4.57281 31.6033 8.97023ZM9.20969 18.0004C9.20969 13.1454 13.1454 9.20969 18.0004 9.20969C21.668 9.20969 24.8111 11.4558 26.129 14.6475L31.6033 8.97023L26.7059 20.3027C26.0234 21.8792 25.2773 23.1554 24.2164 24.2163L24.2157 24.217C22.6249 25.8074 20.4275 26.7911 18.0004 26.7911C13.1454 26.7911 9.20969 22.8554 9.20969 18.0004Z"
      />
      <circle cx="18.0001" cy="18.0001" r="7.11628" opacity="0.35" />
      <path d="M23.4253 18.1025C23.3709 21.0532 20.9635 23.4287 17.9998 23.4287C15.0361 23.4286 12.6287 21.0532 12.5742 18.1025C13.8795 19.6399 15.8251 20.6167 17.9998 20.6167C20.1745 20.6167 22.12 19.6398 23.4253 18.1025Z" />
    </svg>
  ),
  rodio: (
    <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-7 h-7">
      <path d="M8 7 H28 C30.2 7 32 8.8 32 11 V21 C32 23.2 30.2 25 28 25 H16 L10 30.5 V25 H8 C5.8 25 4 23.2 4 21 V11 C4 8.8 5.8 7 8 7 Z" />
      <circle cx="12.5" cy="16" r="1.1" fill="currentColor" stroke="none" />
      <path d="M16 12.4 A5 5 0 0 1 16 19.6" />
      <path d="M18.6 10 A8.2 8.2 0 0 1 18.6 22" />
    </svg>
  ),
  bnbfinder: (
    <svg viewBox="6.8 4.3 17 20.6" fill="currentColor" aria-hidden="true" className="w-6 h-6">
      <g clipRule="evenodd" fillRule="evenodd">
        <path d="m8.50195 5.12195h1.02242l-.21808.37383c-.08785.15036-.15978.32796-.14784.50389.0145.21124.15893.38884.31275.52281l.02986.02557.01108.00917c.03611.02641.06938.05197.1072.08283l.05771.04892c.33835.29489.57545.65954.60615 1.11064.0182.26571-.0403.52308-.1481.766l-.0671.15036h-1.01617l.21096-.37133c.08303-.14647.14984-.3174.1379-.4875-.01422-.21123-.15894-.38884-.31247-.5228l-.02985-.02557-.01081-.0089c-.03639-.02668-.06965-.05253-.10719-.0831l-.058-.04864c-.33834-.29489-.57547-.65983-.60646-1.11064-.01848-.27405.04407-.53892.15837-.78768z" />
        <path d="m10.5545 9.32288h-1.96917v3.09732h1.96947z" />
        <path d="m19.3006 10.1959-4.0575-2.7808-1.839 1.23933 4.2136 2.88777z" />
        <path d="m9.64626 17.4146h-2.10427v6.6052h15.40261v-6.3123h-2.104v4.2555h-11.19434z" />
        <path d="m17.0787 8.66448-1.8319-1.25878-7.70481 5.2906v5.6746h2.10427v-4.6171l3.21854-2.2038-.0114-.0158 2.2331-1.5042zm3.7619 9.70642h2.104v-5.6744l-4.6467-3.18153-1.839 1.23903 4.3817 2.9998z" />
        <path d="m13.2395 15.1216h1.3727c.2041 0 .371.1631.371.3627v1.3422c0 .1995-.1669.3627-.371.3627h-1.3727c-.2044 0-.3713-.1632-.3713-.3627v-1.3422c0-.1996.1669-.3627.3713-.3627zm2.6351 0h1.373c.2041 0 .371.1631.371.3627v1.3422c0 .1995-.1669.3627-.371.3627h-1.373c-.2042 0-.3711-.1632-.3711-.3627v-1.3422c0-.1996.1669-.3627.3711-.3627z" />
        <path d="m13.2395 17.7059h1.3727c.2041 0 .371.1632.371.363v1.3419c0 .1996-.1669.3627-.371.3627h-1.3727c-.2044 0-.3713-.1631-.3713-.3627v-1.3419c0-.1998.1669-.363.3713-.363zm2.6351 0h1.373c.2041 0 .371.1632.371.363v1.3419c0 .1996-.1669.3627-.371.3627h-1.373c-.2042 0-.3711-.1631-.3711-.3627v-1.3419c0-.1998.1669-.363.3711-.363z" />
      </g>
    </svg>
  ),
  rocket: (
    <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-7 h-7">
      <path d="M18 3.5 C21.5 6.5 23 10.5 23 14.5 V22.5 H13 V14.5 C13 10.5 14.5 6.5 18 3.5 Z" />
      <circle cx="18" cy="13" r="2.6" />
      <path d="M13 17 L8.5 23.5 L13 24.5" />
      <path d="M23 17 L27.5 23.5 L23 24.5" />
      <path d="M15.7 26.5 C16 29 17 30.5 18 32.5 C19 30.5 20 29 20.3 26.5" />
    </svg>
  ),
  timebomb: (
    <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-7 h-7">
      <circle cx="15" cy="21.5" r="9" />
      <path d="M19.6 13.6 L23 10.2" />
      <path d="M23 10.2 C24.8 7.8 27.6 8 28.4 10.4" />
      <path d="M30.5 4.5 V8" />
      <path d="M28.75 6.25 H32.25" />
      <path d="M15 17.5 V21.5 L17.8 24.3" />
    </svg>
  ),
  dancefight: (
    <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-7 h-7">
      <path d="M18 3.5 V11" />
      <circle cx="18" cy="20" r="9" />
      <path d="M9.5 17 H26.5" />
      <path d="M9.5 23 H26.5" />
      <path d="M14.2 12 C12.6 15 12.6 25 14.2 28" />
      <path d="M21.8 12 C23.4 15 23.4 25 21.8 28" />
      <path d="M29.5 6.5 V10" />
      <path d="M27.75 8.25 H31.25" />
    </svg>
  ),
};

interface CompanyMarkProps {
  company: keyof typeof glyphs | string;
  className?: string;
}

const CompanyMark = ({ company, className = '' }: CompanyMarkProps) => {
  const glyph = glyphs[company];
  if (!glyph) return null;

  return (
    <span
      className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-white/10 bg-white/5 text-white/80 ${className}`}
    >
      {glyph}
    </span>
  );
};

export default CompanyMark;
