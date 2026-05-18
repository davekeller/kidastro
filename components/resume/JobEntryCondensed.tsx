import React from 'react';
import type { CondensedJob } from './resumeData';

type Props = {
  job: CondensedJob;
};

const JobEntryCondensed = ({ job }: Props) => {
  return (
    <article className="mb-8">
      <div className="flex flex-col items-baseline justify-between gap-1 sm:flex-row sm:gap-4">
        <h3 className="text-lg font-bold text-white">{job.company}</h3>
        <p className="text-sm text-white/40">
          {job.dates} · {job.location}
        </p>
      </div>
      <p className="mt-1 text-sm font-medium text-(--color-2)">{job.role}</p>
      <p className="mt-2 text-base leading-relaxed text-white/60">{job.summary}</p>
    </article>
  );
};

export default JobEntryCondensed;
