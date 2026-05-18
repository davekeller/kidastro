import React from 'react';
import type { FullJob } from './resumeData';
import JobHeaderRow from './JobHeaderRow';

type Props = {
  job: FullJob;
};

const JobEntry = ({ job }: Props) => {
  return (
    <article className="mb-12">
      <JobHeaderRow company={job.company} dates={job.dates} location={job.location} />
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
