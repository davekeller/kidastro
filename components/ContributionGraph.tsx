import React from 'react';

// Decorative GitHub-style contribution graph (dark-theme palette). The cell
// pattern is a seeded approximation of Dave's real graph — deterministic so
// server and client render identically — while the headline number is real.
const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;
const WEEKS = 53;
const DAYS = 7;
const LEFT = 30; // gutter for day labels
const TOP = 18; // gutter for month labels

const LEVELS = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

// Months as rendered from a July start, with approximate week offsets.
const MONTHS: [string, number][] = [
  ['Jul', 0], ['Aug', 4], ['Sep', 9], ['Oct', 13], ['Nov', 17], ['Dec', 22],
  ['Jan', 26], ['Feb', 31], ['Mar', 35], ['Apr', 39], ['May', 44], ['Jun', 48],
];

// Relative activity per month (Jul → Jun), eyeballed from the real graph:
// steady through fall, quiet October, heavy Nov + Jan–Mar, busy June.
const MONTH_WEIGHT = [0.5, 0.5, 0.4, 0.25, 0.8, 0.55, 0.75, 0.85, 0.8, 0.5, 0.45, 0.75];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildCells() {
  const rng = mulberry32(20261);
  const cells: { week: number; day: number; level: number }[] = [];
  for (let week = 0; week < WEEKS; week++) {
    const month = Math.min(11, Math.floor((week / WEEKS) * 12));
    for (let day = 0; day < DAYS; day++) {
      const weekend = day === 0 || day === 6; // Sun / Sat rows
      const w = MONTH_WEIGHT[month] * (weekend ? 0.15 : 1);
      const r = rng();
      const level = r > w ? 0 : Math.min(4, 1 + Math.floor((r / w) * 4));
      cells.push({ week, day, level });
    }
  }
  return cells;
}

const CELLS = buildCells();
const W = LEFT + WEEKS * STEP - GAP;
const H = TOP + DAYS * STEP - GAP;

const ContributionGraph = () => {
  return (
    <div className="w-full text-left text-white px-6 py-5 border-2 border-white/10 rounded-lg">
      <div className="flex items-baseline justify-between mb-4">
        <p className="text-xl text-white/90"><span className="font-bold text-(--color-2)">2,061</span> <span className="font-bold">GitHub contributions</span> in the last year</p>
        <div className="hidden md:flex items-center gap-1 text-xs text-white/50">
          <span className="mr-1">Less</span>
          {LEVELS.map((c) => (
            <svg key={c} width="11" height="11"><rect width="11" height="11" rx="2" fill={c} /></svg>
          ))}
          <span className="ml-1">More</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="GitHub contribution graph — 2,061 contributions in the last year">
        {MONTHS.map(([label, week]) => (
          <text key={label} x={LEFT + week * STEP} y={10} fontSize="10" fill="rgba(255,255,255,0.5)">{label}</text>
        ))}
        {([['Mon', 1], ['Wed', 3], ['Fri', 5]] as [string, number][]).map(([label, day]) => (
          <text key={label} x={0} y={TOP + day * STEP + CELL - 2} fontSize="10" fill="rgba(255,255,255,0.5)">{label}</text>
        ))}
        {CELLS.map(({ week, day, level }) => (
          <rect
            key={`${week}-${day}`}
            x={LEFT + week * STEP}
            y={TOP + day * STEP}
            width={CELL}
            height={CELL}
            rx="2"
            fill={LEVELS[level]}
          />
        ))}
      </svg>
    </div>
  );
};

export default ContributionGraph;
