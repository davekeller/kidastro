import type { ComponentProps, ComponentType } from 'react';
import {
  IcosahedronIcon,
  ResumeIcon,
  HelmetIcon,
  WolfIcon,
  VaultIcon,
  ThemesIcon,
} from './icons';

export interface Destination {
  id: string;
  title: string;
  blurb: string;
  href: string;
  icon: ComponentType<ComponentProps<'svg'>>;
  /** Served outside the Next app (full page load, no client nav/prefetch). */
  external?: boolean;
  /** Depth tier, 0.6 (far) – 1.0 (near). Drives scale, opacity, blur and the
      parallax multiplier, so the six bodies read front-to-back instead of flat.
      Deliberately unordered — a monotonic run reads as a ramp, not a system. */
  depth: number;
}

/* The full map of the site. Add a new page here and it shows up in the
   Mission Control — nothing else to wire. */
export const destinations: Destination[] = [
  {
    id: 'portfolio',
    title: 'Portfolio',
    blurb: 'the main event — projects & story',
    href: '/',
    icon: IcosahedronIcon,
    depth: 1.0,
  },
  {
    id: 'resume',
    title: 'Resume',
    blurb: 'the professional paper trail',
    href: '/resume',
    icon: ResumeIcon,
    depth: 0.75,
  },
  {
    id: 'arcade',
    title: 'Arcade',
    blurb: 'three tiny canvas space games',
    href: '/games',
    icon: HelmetIcon,
    depth: 0.9,
  },
  {
    id: 'lyrics',
    title: 'Lyrics',
    blurb: 'the Paper Fang lyric book',
    href: '/lyrics',
    icon: WolfIcon,
    depth: 0.62,
  },
  {
    id: 'skills',
    title: 'Skills Vault',
    blurb: 'the hidden agent skills bundle',
    href: '/skills',
    icon: VaultIcon,
    depth: 0.85,
  },
  {
    id: 'themes',
    title: 'Themes',
    blurb: 'ambient color experiments',
    href: '/themes',
    icon: ThemesIcon,
    depth: 0.7,
    external: true,
  },
];
