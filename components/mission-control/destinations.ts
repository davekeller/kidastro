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
  },
  {
    id: 'resume',
    title: 'Resume',
    blurb: 'the professional paper trail',
    href: '/resume',
    icon: ResumeIcon,
  },
  {
    id: 'arcade',
    title: 'Arcade',
    blurb: 'three tiny canvas space games',
    href: '/games',
    icon: HelmetIcon,
  },
  {
    id: 'lyrics',
    title: 'Lyrics',
    blurb: 'the Paper Fang lyric book',
    href: '/lyrics',
    icon: WolfIcon,
  },
  {
    id: 'skills',
    title: 'Skills Vault',
    blurb: 'the hidden agent skills bundle',
    href: '/skills',
    icon: VaultIcon,
  },
  {
    id: 'themes',
    title: 'Themes',
    blurb: 'ambient color experiments',
    href: '/themes',
    icon: ThemesIcon,
    external: true,
  },
];
