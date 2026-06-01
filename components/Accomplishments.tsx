import React from 'react';
import Image from 'next/image';

const Accomplishments = () => {
  return (
    <div className="accomplishments grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-x-24 text-left w-[88%] lg:w-[80%] mx-auto my-8 sm:my-0 items-start">
      <h2 className="titleFull col-span-1 sm:col-span-3 text-3xl sm:text-4xl font-bold text-white text-center mb-12">
        Accomplishments
      </h2>

      <div className="achieve1 flex flex-col items-center text-center px-4">
        <Image src="/imgs/accomplishments/icon1.svg" alt="icon" width={80} height={80} className="mb-4" />
        <h3 className="text-[var(--color-1)] text-2xl font-semibold mb-4">30+ Products</h3>
        <p className="text-white/90 leading-8 max-w-md">
          Led design at an agency and multiple startups, shipping intuitive experiences across telemedicine, puzzle games, entertainment, interactive education, and travel.
        </p>
        <br/>
        <p className="text-white/90 leading-8 max-w-md">
          Along the way I&apos;ve learned how successful product teams work &mdash; design sprints, prototype validation, and agile iteration.
        </p>
      </div>

      <div className="achieve2 flex flex-col items-center text-center px-4">
        <Image src="/imgs/accomplishments/icon2.svg" alt="icon" width={80} height={80} className="mb-4" />
        <h3 className="text-[var(--color-2)] text-2xl font-semibold mb-4">#1 iPhone App</h3>
        <p className="text-white/90 leading-8 max-w-md">
          Shortly after we launched the photo editing app for A Beautiful Mess (shown below), it shot to #1 in the iTunes App Store.
        </p>
        <br/>
        <p className="text-white/90 leading-8 max-w-md">
          It held a spot in the top 100 paid apps for over a year, earning millions of downloads.
        </p>
      </div>

      <div className="achieve3 flex flex-col items-center text-center px-4">
        <Image src="/imgs/accomplishments/icon3.svg" alt="icon" width={80} height={80} className="mb-4" />
        <h3 className="text-[var(--color-3)] text-2xl font-semibold mb-4">Millions of Users</h3>
        <p className="text-white/90 leading-8 max-w-md">
          Concepted and designed apps that earned millions of downloads for Ellen, A Beautiful Mess, Dancefight, and more.
        </p>
        <br/>
        <p className="text-white/90 leading-8 max-w-md">
          Also built web apps that thousands of people rely on daily.
        </p>
      </div>
    </div>
  );
};

export default Accomplishments;
