'use client';

import React from 'react';
import { CATEGORY_ACCENTS, type Skill } from './skillsData';

const SkillCard = ({ skill }: { skill: Skill }) => {
  const accent = CATEGORY_ACCENTS[skill.category];

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-(--accent) hover:shadow-[0_0_40px_-12px_var(--accent)]"
      style={{ '--accent': accent } as React.CSSProperties}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-3 -top-8 select-none text-[7rem] font-bold leading-none opacity-[0.05] transition-opacity duration-300 group-hover:opacity-[0.12]"
        style={{ color: accent }}
      >
        /
      </span>

      <span
        className="inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.2em]"
        style={{ color: accent, borderColor: `${accent}4D`, backgroundColor: `${accent}14` }}
      >
        {skill.category}
      </span>

      <h2 className="mt-4 font-(family-name:--font-jetbrains) text-2xl font-bold text-white">
        {skill.command}
      </h2>

      <p className="mt-2 text-base text-white/80">{skill.description}</p>

      <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
        {skill.practices.map((practice) => (
          <li key={practice} className="flex gap-2.5 text-sm leading-relaxed text-white/70">
            <span aria-hidden className="mt-px shrink-0" style={{ color: accent }}>
              ▸
            </span>
            {practice}
          </li>
        ))}
      </ul>
    </article>
  );
};

export default SkillCard;
