import React from 'react';
import type { CondensedJob } from './resumeData';
import JobHeaderRow from './JobHeaderRow';

type Props = {
  job: CondensedJob;
};

const JobEntryCondensed = ({ job }: Props) => {
  return (
    <article className="mb-8">
      <JobHeaderRow company={job.company} dates={job.dates} location={job.location} />
      <p className="mt-1 text-sm font-semibold text-white">{job.role}</p>
      <p className="mt-2 text-base leading-relaxed text-white/80">{job.summary}</p>
    </article>
  );
};

export default JobEntryCondensed;
