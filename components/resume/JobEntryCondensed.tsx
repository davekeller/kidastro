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
      {job.bullets && job.bullets.length > 0 && (
        <ul className="mt-4 space-y-4 print:mt-2 print:space-y-1">
          {job.bullets.map((bullet, i) => (
            <li
              key={i}
              className="relative pl-6 text-base leading-snug text-white/80 before:absolute before:left-0 before:top-0 before:font-bold before:text-(--color-2) before:content-['+'] print:pl-4 print:text-sm print:leading-snug print:text-gray-800 print:before:text-gray-700"
            >
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
};

export default JobEntryCondensed;
