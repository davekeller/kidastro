import type { ComponentProps } from 'react';

/* Wireframe marks for the Mission Control cards — static SVG echoes of the
   3D header marks (icosahedron, helmet, wolf) plus new glyphs for the pages
   that never had one. All stroke currentColor so the parent can tint them
   on the ambient accent clock. */

type IconProps = ComponentProps<'svg'>;

const base = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

export function IcosahedronIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 6 L39.5 15 V33 L24 42 L8.5 33 V15 Z" />
      <path d="M24 14.5 L32.5 29 H15.5 Z" />
      <path d="M24 6 V14.5 M39.5 15 L32.5 29 M8.5 15 L15.5 29 M24 42 L15.5 29 M24 42 L32.5 29 M8.5 33 L15.5 29 M39.5 33 L32.5 29 M8.5 15 L24 14.5 M39.5 15 L24 14.5" opacity="0.6" />
    </svg>
  );
}

export function ResumeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13 7 H29 L35 13 V41 H13 Z" />
      <path d="M29 7 V13 H35" />
      <circle cx="21" cy="20" r="3" />
      <path d="M16 29 C16 25.5 18 24 21 24 C24 24 26 25.5 26 29" />
      <path d="M18 34 H30 M18 38 H26" opacity="0.6" />
    </svg>
  );
}

export function HelmetIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 31 C9 17.5 15.5 9 24 9 C32.5 9 39 17.5 39 31" />
      <rect x="14.5" y="19" width="19" height="11" rx="5.5" />
      <path d="M7 35 H41" />
      <path d="M24 9 V5.5" opacity="0.6" />
      <circle cx="24" cy="4.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="41" cy="12" r="1" fill="currentColor" stroke="none" opacity="0.6" />
    </svg>
  );
}

export function WolfIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 10 L16 15 L10 8 L11.5 20 L14 30 L24 42 L34 30 L36.5 20 L38 8 L32 15 Z" />
      <path d="M24 10 V25 M14 30 L24 25 L34 30 M24 42 L24 34" opacity="0.6" />
      <circle cx="18.5" cy="23" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="29.5" cy="23" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function VaultIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="8" y="8" width="32" height="32" rx="5" />
      <circle cx="24" cy="24" r="9" />
      <path d="M24 15 V19 M24 29 V33 M15 24 H19 M29 24 H33 M17.6 17.6 L20.5 20.5 M27.5 27.5 L30.4 30.4" opacity="0.6" />
      <circle cx="24" cy="24" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ThemesIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 6 C14 6 6 14 6 24 C6 34 14 42 24 42 C26.5 42 28 40.2 28 38.2 C28 36.6 27.2 35.8 26.4 34.9 C25.6 34 25 33.2 25 32 C25 30 26.6 28.5 28.6 28.5 H33 C38 28.5 42 24.5 42 19.5 C42 12 34 6 24 6 Z" />
      <circle cx="15" cy="20" r="2" fill="currentColor" stroke="none" />
      <circle cx="23" cy="14" r="2" fill="currentColor" stroke="none" opacity="0.75" />
      <circle cx="32" cy="18" r="2" fill="currentColor" stroke="none" opacity="0.55" />
      <circle cx="13.5" cy="29" r="2" fill="currentColor" stroke="none" opacity="0.4" />
    </svg>
  );
}
