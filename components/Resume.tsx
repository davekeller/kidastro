import React from 'react';
import Header from './resume/Header';
import HomeLink from './resume/HomeLink';
import SectionLabel from './resume/SectionLabel';
import JobEntry from './resume/JobEntry';
import JobEntryCondensed from './resume/JobEntryCondensed';
import DownloadButton from './resume/DownloadButton';
import FadeUp from './FadeUp';
import { fullJobs, condensedJobs, highlights, skills, tools, interests } from './resume/resumeData';
import Footer from './Footer';

const Resume = () => {
  return (
    <main className="relative z-10 mx-auto max-w-[1100px] px-6 pt-32 pb-24 print:max-w-full print:px-0 print:pt-0 print:pb-0">
      <div className="fixed top-6 left-6 z-20 print:hidden">
        <HomeLink />
      </div>
      <div className="fixed top-6 right-6 z-20 print:hidden">
        <DownloadButton />
      </div>

      <FadeUp>
        <Header />
      </FadeUp>

      <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-3 print:mb-8 print:grid-cols-3 print:gap-6">
        <FadeUp className="md:col-span-2 print:col-span-2">
          <SectionLabel>Highlights</SectionLabel>
          <ul className="space-y-4 print:space-y-1">
            {highlights.map((item, i) => (
              <li
                key={i}
                className="relative pl-6 text-pretty text-base leading-snug text-white/90 before:absolute before:left-0 before:top-0 before:font-bold before:text-(--color-2) before:content-['+'] print:pl-4 print:text-sm print:leading-snug print:text-gray-800 print:before:text-gray-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </FadeUp>
        <FadeUp delay={0.15}>
          <SectionLabel>Skills &amp; Tools</SectionLabel>
          <ul className="space-y-4 print:space-y-1">
            {skills.map((item, i) => (
              <li
                key={i}
                className="relative pl-6 text-pretty text-base leading-snug text-white/90 before:absolute before:left-0 before:top-0 before:font-bold before:text-(--color-2) before:content-['+'] print:pl-4 print:text-sm print:leading-snug print:text-gray-800 print:before:text-gray-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>

      <section className="mb-16 print:mb-8">
        <FadeUp>
          <SectionLabel>Experience</SectionLabel>
        </FadeUp>
        {fullJobs.map((job) => (
          <FadeUp key={job.company}>
            <JobEntry job={job} />
          </FadeUp>
        ))}
        {condensedJobs.map((job) => (
          <FadeUp key={job.company}>
            <JobEntryCondensed job={job} />
          </FadeUp>
        ))}
      </section>

      <FadeUp className="print:mb-0">
        <SectionLabel>Interests</SectionLabel>
        <ul
          className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-flow-col md:grid-cols-3 print:grid-cols-3 print:gap-x-6 print:gap-y-1"
          style={{
            gridTemplateRows: `repeat(${Math.ceil(interests.length / 3)}, minmax(0, 1fr))`,
          }}
        >
          {interests.map((item, i) => (
            <li
              key={i}
              className="relative pl-6 text-pretty text-base leading-snug text-white/90 before:absolute before:left-0 before:top-0 before:font-bold before:text-(--color-2) before:content-['+'] print:pl-4 print:text-sm print:leading-snug print:text-gray-800 print:before:text-gray-700"
            >
              {item}
            </li>
          ))}
        </ul>
      </FadeUp>

      <FadeUp className="mt-16 print:mt-8">
        <SectionLabel>Tools &amp; Technologies</SectionLabel>
        <p className="text-pretty text-base leading-relaxed text-white/80 print:text-sm print:leading-snug print:text-gray-800">
          {tools.join(' · ')}
        </p>
      </FadeUp>

      <div className="mt-12 print:hidden">
        <Footer minimal />
      </div>
    </main>
  );
};

export default Resume;
