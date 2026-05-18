import React from 'react';
import Header from './resume/Header';
import HomeLink from './resume/HomeLink';
import DownloadButton from './resume/DownloadButton';
import SectionLabel from './resume/SectionLabel';
import JobEntry from './resume/JobEntry';
import JobEntryCondensed from './resume/JobEntryCondensed';
import { fullJobs, condensedJobs, highlights, skills, interests } from './resume/resumeData';

const Resume = () => {
  return (
    <main className="relative z-10 mx-auto max-w-[960px] px-6 pt-32 pb-24">
      <div className="fixed top-6 left-6 z-20">
        <HomeLink />
      </div>
      <div className="fixed top-6 right-6 z-20">
        <DownloadButton />
      </div>
      <Header />

      <section className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-3">
        <div className="md:col-span-2">
          <SectionLabel>Highlights</SectionLabel>
          <ul className="space-y-4">
            {highlights.map((item, i) => (
              <li
                key={i}
                className="relative pl-6 text-base leading-snug text-white/85 before:absolute before:left-0 before:top-0 before:font-bold before:text-(--color-2) before:content-['+']"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionLabel>Skills &amp; Tools</SectionLabel>
          <ul className="space-y-4">
            {skills.map((item, i) => (
              <li
                key={i}
                className="relative pl-6 text-base leading-snug text-white/85 before:absolute before:left-0 before:top-0 before:font-bold before:text-(--color-2) before:content-['+']"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-16">
        <SectionLabel>Experience</SectionLabel>
        {fullJobs.map((job) => (
          <JobEntry key={job.company} job={job} />
        ))}
        {condensedJobs.map((job) => (
          <JobEntryCondensed key={job.company} job={job} />
        ))}
      </section>

      <section>
        <SectionLabel>Interests</SectionLabel>
        <p className="text-base leading-snug text-white/85">{interests}</p>
      </section>
    </main>
  );
};

export default Resume;
