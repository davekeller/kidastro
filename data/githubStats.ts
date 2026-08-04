// GitHub activity summary for the folio's GitHub section. Static-site data —
// refresh these by hand from github.com/davekeller now and then. The API can't
// see the Strangeworks org's private work (SSO), so the profile page while
// logged in is the source of truth for the contribution total.
export const GITHUB_URL = 'https://github.com/davekeller';

// Headline on the contribution graph.
export const CONTRIBUTIONS_LAST_YEAR = '2,278';

export type GithubStatIcon = 'merge' | 'rings' | 'constellation';

export interface GithubStat {
  value: string;
  label: string;
  sub: string;
  icon: GithubStatIcon;
}

export const githubStats: GithubStat[] = [
  {
    value: '250+',
    label: 'merged pull requests',
    sub: 'shipped across product, docs, and marketing repos',
    icon: 'merge',
  },
  {
    value: '15 yrs',
    label: 'on GitHub',
    sub: 'since January 2010 — long before the wave',
    icon: 'rings',
  },
  {
    value: '255',
    label: 'commits last month',
    sub: 'across five repos — from Aura to this portfolio',
    icon: 'constellation',
  },
];
