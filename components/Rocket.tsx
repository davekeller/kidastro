import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';

const Rocket = () => {
  return (
    <AnimatedSection className="rkt grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 items-start">
      <div className="col-span-full w-full lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-start">
        {/* Description */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/10 rounded-2xl">
          <h2 className="text-4xl font-bold mb-2">Rocket</h2>
          <h4 className="text-(--color-5) text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">A boutique digital agency</h4>
          <p className="mb-4 text-lg leading-8 text-white/90">
            Over the better part of a decade, I co-founded, helped grow the business, and led design for Rocket — a 2-person indie dev shop we grew into a 20-person digital agency. We specialized in concepting, prototyping and building apps and websites for early-stage startups to household names.
          </p>
        </div>

        {/* Highlights */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/10 rounded-2xl flex flex-col items-start">
          <h3 className="text-2xl font-bold my-2">Co-Founder + Product Designer + Front-End Developer</h3>
          <h4 className="text-xl font-semibold text-(--color-5) mb-4 tracking-wider">Highlights:</h4>
          <div className="w-full border-b-2 border-white/10 mb-6"></div>
          <ul className="list-none space-y-4 w-full">
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-5) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Managed marketing/sales and accounts for dozens of client projects</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-5) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Hired, managed and grew a product team of back-end, front-end, iOS and Android developers</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-5) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Concepted, designed and delivered custom apps and websites for 30+ client projects</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-5) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Designed and launched a #1 Paid iTunes App through a 2.0 release</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-5) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Created a multi-million dollar CRM/CMS platform for one of the largest (and most intense) auto sales organizations in the US</li>
          </ul>
        </div>
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-3 relative">
         <Image src="/imgs/rkt/rkt2.png" alt="rocket example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>
      <div className="col-span-1 md:col-span-1 lg:col-span-3 relative">
         <Image src="/imgs/rkt/rkt3.png" alt="rocket example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-3 relative">
         <Image src="/imgs/rkt/rkt4.jpg" alt="rocket example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-3 lg:col-start-4">
           <div className="clients grid grid-cols-3 gap-8 p-8">
            <Image src="/imgs/rkt/client1.svg" alt="client logo" width={100} height={50} className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            <Image src="/imgs/rkt/client2.svg" alt="client logo" width={100} height={50} className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            <Image src="/imgs/rkt/client3.svg" alt="client logo" width={100} height={50} className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            <Image src="/imgs/rkt/client4.svg" alt="client logo" width={100} height={50} className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            <Image src="/imgs/rkt/client5.svg" alt="client logo" width={100} height={50} className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            <Image src="/imgs/rkt/client6.svg" alt="client logo" width={100} height={50} className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            <Image src="/imgs/rkt/client7.svg" alt="client logo" width={100} height={50} className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            <Image src="/imgs/rkt/client8.svg" alt="client logo" width={100} height={50} className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
            <Image src="/imgs/rkt/client9.svg" alt="client logo" width={100} height={50} className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity" />
          </div>
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-3 lg:col-start-4 relative">
         <Image src="/imgs/rkt/rkt1.jpg" alt="rocket example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>
    </AnimatedSection>
  );
};

export default Rocket;
