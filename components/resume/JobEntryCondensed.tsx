import React from 'react';
import type { CondensedJob } from './resumeData';
import JobHeaderRow from './JobHeaderRow';

type Props = {
  job: CondensedJob;
};

const JobEntryCondensed = ({ job }: Props) => {
  return (
    <article className="mb-8 print:mb-4 print:break-inside-avoid">
      <JobHeaderRow company={job.company} dates={job.dates} location={job.location} />
      <p className="mt-1 text-sm font-semibold text-white print:mt-0 print:text-xs print:text-black">{job.role}</p>
      <p className="mt-2 text-base leading-snug text-white/80 print:mt-1 print:text-sm print:leading-snug print:text-gray-800">{job.summary}</p>
    </article>
  );
};

export default JobEntryCondensed;
