import React from 'react';
import type { FullJob } from './resumeData';

type Props = {
  job: FullJob;
};

const JobEntry = ({ job }: Props) => {
  return (
    <article className="mb-12">
      <div className="flex flex-col items-baseline gap-1 sm:flex-row sm:flex-wrap sm:gap-4">
        <h3 className="text-2xl font-bold text-white">{job.company}</h3>
        <p className="text-sm text-white/40">
          {job.dates} · {job.location}
        </p>
      </div>
      <p className="mt-1 text-base font-semibold text-white">{job.role}</p>
      <p className="mt-3 text-base leading-relaxed text-white/85">{job.summary}</p>
      <ul className="mt-4 space-y-2">
        {job.bullets.map((bullet, i) => (
          <li
            key={i}
            className="relative pl-6 text-base leading-relaxed text-white/80 before:absolute before:left-0 before:top-0 before:font-bold before:text-(--color-2) before:content-['+']"
          >
            {bullet}
          </li>
        ))}
      </ul>
    </article>
  );
};

export default JobEntry;
