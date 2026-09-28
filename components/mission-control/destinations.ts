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
  /** Depth tier, 0.6 (far) – 1.0 (near). Drives scale, opacity, blur and the
      parallax multiplier, so the bodies read front-to-back instead of flat.
      Deliberately unordered — a monotonic run reads as a ramp, not a system. */
  depth: number;
  /** `page` lives in this Next app and client-navigates. `satellite` is its own
      repo and deployment on a kidastro.com subdomain, so it needs a real page
      load and a full URL. See the note below. */
  kind: 'page' | 'satellite';
}

/* The full map: every page of the portfolio plus every satellite app.
   Add an entry here and it shows up in Mission Control — nothing else to wire
   on this side.

   Satellites are deliberately separate apps, not routes in this repo: each one
   is its own repo, its own stack, its own experiment. kidastro.com stays the
   portfolio. Adding one takes two steps:

     1. Its own Vercel project on a subdomain, like themes.kidastro.com.
     2. An entry here with `kind: 'satellite'` and that full URL as `href`.

   Mission Control stays unlinked and unlisted — the only way in is the ghost
   pill in the corner. That's on purpose. */
export const destinations: Destination[] = [
  {
    id: 'portfolio',
    title: 'Portfolio',
    blurb: 'the main event — projects & story',
    href: '/',
    icon: IcosahedronIcon,
    depth: 1.0,
    kind: 'page',
  },
  {
    id: 'resume',
    title: 'Resume',
    blurb: 'the professional paper trail',
    href: '/resume',
    icon: ResumeIcon,
    depth: 0.75,
    kind: 'page',
  },
  {
    id: 'arcade',
    title: 'Arcade',
    blurb: 'three tiny canvas space games',
    href: '/games',
    icon: HelmetIcon,
    depth: 0.9,
    kind: 'page',
  },
  {
    id: 'lyrics',
    title: 'Lyrics',
    blurb: 'the Paper Fang lyric book',
    href: '/lyrics',
    icon: WolfIcon,
    depth: 0.62,
    kind: 'page',
  },
  {
    id: 'skills',
    title: 'Skills Vault',
    blurb: 'the hidden agent skills bundle',
    href: '/skills',
    icon: VaultIcon,
    depth: 0.85,
    kind: 'page',
  },
  {
    id: 'themes',
    title: 'Themes',
    blurb: 'portable ui themes — react / tailwind',
    href: 'https://themes.kidastro.com',
    icon: ThemesIcon,
    depth: 0.7,
    kind: 'satellite',
  },
];
