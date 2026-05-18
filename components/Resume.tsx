import React from 'react';
import Header from './resume/Header';
import DownloadButton from './resume/DownloadButton';
import SectionLabel from './resume/SectionLabel';
import JobEntry from './resume/JobEntry';
import JobEntryCondensed from './resume/JobEntryCondensed';
import { fullJobs, condensedJobs, skills, interests } from './resume/resumeData';

const Resume = () => {
  return (
    <main className="relative z-10 mx-auto max-w-[820px] px-6 pt-32 pb-24">
      <Header />
      <DownloadButton />

      <section className="mb-16">
        <SectionLabel>Experience</SectionLabel>
        {fullJobs.map((job) => (
          <JobEntry key={job.company} job={job} />
        ))}
        <div className="my-10 border-t border-white/10" />
        {condensedJobs.map((job) => (
          <JobEntryCondensed key={job.company} job={job} />
        ))}
      </section>

      <section className="mb-16">
        <SectionLabel>Skills &amp; Tools</SectionLabel>
        <p className="text-base leading-relaxed text-white/70">{skills}</p>
      </section>

      <section>
        <SectionLabel>Interests</SectionLabel>
        <p className="text-base leading-relaxed text-white/70">{interests}</p>
      </section>
    </main>
  );
};

export default Resume;
