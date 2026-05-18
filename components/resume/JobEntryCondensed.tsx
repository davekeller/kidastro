import React from 'react';
import type { CondensedJob } from './resumeData';

type Props = {
  job: CondensedJob;
};

const JobEntryCondensed = ({ job }: Props) => {
  return (
    <article className="mb-8">
      <div className="flex flex-row items-baseline gap-4">
        <h3 className="text-2xl font-bold text-white">{job.company}</h3>
        <p className="text-sm text-white/40">
          {job.dates} · {job.location}
        </p>
      </div>
      <p className="mt-1 text-sm font-semibold text-white">{job.role}</p>
      <p className="mt-2 text-base leading-relaxed text-white/80">{job.summary}</p>
    </article>
  );
};

export default JobEntryCondensed;
