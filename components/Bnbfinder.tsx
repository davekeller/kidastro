import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';

const Bnbfinder = () => {
  return (
    <AnimatedSection className="bnb grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 items-start">
      <div className="col-span-full w-full lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-start">
        {/* Description */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/10 rounded-2xl">
          <h2 className="text-4xl font-bold mb-2">Bnbfinder</h2>
          <h4 className="text-(--color-4) text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">A platform for niche travel listings (now Savvy.com)</h4>
          <p className="mb-4 text-lg leading-8 text-white/90">
            Led design and front-end development on this platform for multiple travel listing verticals, starting with bnbfinder. The platform included a consumer app for travelers, a member app for property owners, and a back-office app for administrators.
          </p>
          <p className="mb-4 text-lg leading-8 text-white/90">
            We built the platform and the first travel site, from whiteboards to 8k subscribers (4k paid), with a team of 3, in under a year.
          </p>
        </div>

        {/* Highlights */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/10 rounded-2xl flex flex-col items-start">
          <h3 className="text-2xl font-bold my-2">Product UX/UI Design Lead + Front-End Dev</h3>
          <h4 className="text-xl font-semibold text-(--color-4) mb-4 tracking-wider">Highlights:</h4>
          <div className="w-full border-b-2 border-white/10 mb-6"></div>
          <ul className="list-none space-y-4 w-full">
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-4) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Concepted, designed and wrote front-end code for this a platform (consumer, owner and admin apps) from scratch on the tech stack: Elixir &gt; React / Next.js &gt; Custom front-end Framework / Tailwind CSS</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-4) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Created and helped manage our agile development process using Jira and Trello</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-4) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Presented bi-weekly development updates to the management, sales and marketing teams</li>
          </ul>
        </div>
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-6 relative">
         <Image src="/imgs/bnb/bnb1.png" alt="bnbfinder example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-3 relative lg:rounded-r-md overflow-hidden">
          <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white px-4 py-2 rounded-lg shadow-xl z-10 text-center">
            <h5 className="text-black font-bold text-xl">bnbfinder design system</h5>
          </div>
         <Image src="/imgs/bnb/bnb3.jpg" alt="bnbfinder example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-3 relative lg:rounded-l-md overflow-hidden">
           <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white px-4 py-2 rounded-lg shadow-xl z-10 text-center">
            <h5 className="text-black font-bold text-xl">pitch decks</h5>
          </div>
         <Image src="/imgs/bnb/bnb5.jpg" alt="bnbfinder example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-6 relative">
         <Image src="/imgs/bnb/bnb4.png" alt="bnbfinder example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

    </AnimatedSection>
  );
};

export default Bnbfinder;
