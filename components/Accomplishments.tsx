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
        <h3 className="text-[var(--color-1)] text-2xl font-semibold mb-4">40+ Products</h3>
        <p className="text-white/90 leading-8 max-w-md">
          Led design at an agency and multiple startups, shipping across AI, data science, entertainment, travel, fintech and more.
        </p>
        <br/>
        <p className="text-white/90 leading-8 max-w-md">
          And I&apos;ve shipped the front-end too — hands-on from first sketch to production code.
        </p>
      </div>

      <div className="achieve2 flex flex-col items-center text-center px-4">
        <Image src="/imgs/accomplishments/icon2.svg" alt="icon" width={80} height={80} className="mb-4" />
        <h3 className="text-[var(--color-2)] text-2xl font-semibold mb-4">#1 iPhone App</h3>
        <p className="text-white/90 leading-8 max-w-md">
          At Rocket I designed A Beautiful Mess, a photo editor that shot to #1 Paid on the App Store right after launch (shown below).
        </p>
        <br/>
        <p className="text-white/90 leading-8 max-w-md">
          It stayed in the top 100 paid apps for over a year and earned millions of downloads.
        </p>
      </div>

      <div className="achieve3 flex flex-col items-center text-center px-4">
        <Image src="/imgs/accomplishments/icon3.svg" alt="icon" width={80} height={80} className="mb-4" />
        <h3 className="text-[var(--color-3)] text-2xl font-semibold mb-4">Millions of Users</h3>
        <p className="text-white/90 leading-8 max-w-md">
          Designed apps that reached millions of downloads for Ellen, A Beautiful Mess, Dancefight and more.
        </p>
        <br/>
        <p className="text-white/90 leading-8 max-w-md">
          And built web apps that thousands of people rely on every day.
        </p>
      </div>

      {/* A little personality */}
      <div className="col-span-1 sm:col-span-3 mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Image src="/imgs/about/about1@2x.png" alt="Photo of Dave" width={660} height={480} className="w-full aspect-[4/3] object-cover rounded-2xl shadow-2xl" />
        <Image src="/imgs/about/about2@2x.png" alt="Photo of Dave" width={820} height={640} className="w-full aspect-[4/3] object-cover rounded-2xl shadow-2xl" />
        <Image src="/imgs/about/about3@2x.png" alt="Photo of Dave" width={660} height={480} className="w-full aspect-[4/3] object-cover rounded-2xl shadow-2xl" />
      </div>
    </div>
  );
};

export default Accomplishments;
