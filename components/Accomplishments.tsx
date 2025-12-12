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
          Having led design at an agency and multiple startups, I&apos;ve created intuitive experiences from telemedicine, to puzzle games, to entertainment, to interactive education, to travel.
        </p>
        <br/>
        <p className="text-white/90 leading-8 max-w-md">
          It&apos;s taught me how successful dev teams work &mdash;
          including design sprints, prototype validation and agile iteration.
        </p>
      </div>

      <div className="achieve2 flex flex-col items-center text-center px-4">
        <Image src="/imgs/accomplishments/icon2.svg" alt="icon" width={80} height={80} className="mb-4" />
        <h3 className="text-[var(--color-2)] text-2xl font-semibold mb-4">#1 iPhone App</h3>
        <p className="text-white/90 leading-8 max-w-md">
          Shortly after launching the photo editing app we created for A Beautiful Mess (shown below), it shot to #1 in the iTunes App Store.
        </p>
        <br/>
        <p className="text-white/90 leading-8 max-w-md">
          It then stayed in the top 100 Paid apps for over a year – getting millions of downloads and revenue.
        </p>
      </div>

      <div className="achieve3 flex flex-col items-center text-center px-4">
        <Image src="/imgs/accomplishments/icon3.svg" alt="icon" width={80} height={80} className="mb-4" />
        <h3 className="text-[var(--color-3)] text-2xl font-semibold mb-4">Millions of Users</h3>
        <p className="text-white/90 leading-8 max-w-md">
          I&apos;ve concepted and designed apps that have garnered millions of downloads for Ellen, A Beautiful Mess, Dancefight, and more.
        </p>
        <br/>
        <p className="text-white/90 leading-8 max-w-md">
          I&apos;ve also built web apps that thousands of people rely on on a daily basis.
        </p>
      </div>
    </div>
  );
};

export default Accomplishments;
