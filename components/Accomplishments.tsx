import React from 'react';

const Accomplishments = () => {
  return (
    <div className="accomplishments grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-x-24 text-left w-[88%] lg:w-[80%] mx-auto my-8 sm:my-0 items-start">
      <h2 className="titleFull col-span-1 sm:col-span-3 text-3xl sm:text-4xl font-bold text-white text-center mb-12">
        Accomplishments
      </h2>

      <div className="achieve1 flex flex-col items-center text-center px-4">
        {/* Layer stack + spark — products shipped */}
        <svg viewBox="0 0 48 48" width={80} height={80} fill="none" stroke="#F4FD7B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mb-4">
          <path d="M24 6 L38 13.5 L24 21 L10 13.5 Z" fill="#F4FD7B" fillOpacity="0.15" />
          <path d="M10 21.5 L24 29 L38 21.5" />
          <path d="M10 29.5 L24 37 L38 29.5" />
          <path d="M42 4.5 V11.5" />
          <path d="M38.5 8 H45.5" />
        </svg>
        <h3 className="text-white/50 text-2xl font-semibold mb-4">40+ Products</h3>
        <p className="text-white/90 leading-8 max-w-md text-pretty">
          Led design at an agency and multiple startups, shipping across AI, data science, entertainment, travel, fintech and more.
        </p>
        <br/>
        <p className="text-white/90 leading-8 max-w-md text-pretty">
          And I&apos;ve shipped the front-end too — hands-on from first sketch to production code.
        </p>
      </div>

      <div className="achieve2 flex flex-col items-center text-center px-4">
        {/* Trophy with star — #1 Paid on the App Store */}
        <svg viewBox="0 0 48 48" width={80} height={80} fill="none" stroke="#39d5cb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mb-4">
          <path d="M15.5 8 H32.5 V15.5 C32.5 21.5 29 25.5 24 25.5 C19 25.5 15.5 21.5 15.5 15.5 Z" />
          <path d="M15.5 10.5 H9.5 C9.5 16.5 11.7 18.7 15.7 19.4" />
          <path d="M32.5 10.5 H38.5 C38.5 16.5 36.3 18.7 32.3 19.4" />
          <path d="M24 25.5 V31" />
          <path d="M17.5 36 C17.5 33 20.4 31 24 31 C27.6 31 30.5 33 30.5 36 Z" />
          <path d="M24 11 L25.3 14.7 L29 16 L25.3 17.3 L24 21 L22.7 17.3 L19 16 L22.7 14.7 Z" fill="#39d5cb" stroke="none" />
          <path d="M42 5.5 V11.5" />
          <path d="M39 8.5 H45" />
        </svg>
        <h3 className="text-white/50 text-2xl font-semibold mb-4">#1 iPhone App</h3>
        <p className="text-white/90 leading-8 max-w-md text-pretty">
          At Rocket I designed A Beautiful Mess, a photo editor that shot to #1 Paid on the App Store right after launch (shown below).
        </p>
        <br/>
        <p className="text-white/90 leading-8 max-w-md text-pretty">
          It stayed in the top 100 paid apps for over a year and earned millions of downloads.
        </p>
      </div>

      <div className="achieve3 flex flex-col items-center text-center px-4">
        {/* Planet with orbiting users — reach at scale */}
        <svg viewBox="0 0 48 48" width={80} height={80} fill="none" stroke="#E4416F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mb-4">
          <circle cx="24" cy="26" r="8.5" />
          <path d="M19.5 19.5 C16.8 23 16.8 29 19.5 32.5" opacity="0.5" />
          <ellipse cx="24" cy="26" rx="17" ry="5.8" transform="rotate(-16 24 26)" />
          <circle cx="7.7" cy="30.7" r="1.9" fill="#E4416F" stroke="none" />
          <circle cx="40.3" cy="21.3" r="1.9" fill="#E4416F" stroke="none" />
          <circle cx="27.5" cy="31.9" r="1.9" fill="#E4416F" stroke="none" />
          <path d="M40 4.5 V10.5" />
          <path d="M37 7.5 H43" />
          <circle cx="10" cy="9" r="1.2" fill="#E4416F" stroke="none" />
        </svg>
        <h3 className="text-white/50 text-2xl font-semibold mb-4">Millions of Users</h3>
        <p className="text-white/90 leading-8 max-w-md text-pretty">
          Designed apps that reached millions of downloads for Ellen, A Beautiful Mess, Dancefight and more.
        </p>
        <br/>
        <p className="text-white/90 leading-8 max-w-md text-pretty">
          And built web apps that thousands of people rely on every day.
        </p>
      </div>
    </div>
  );
};

export default Accomplishments;
