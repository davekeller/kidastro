import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import CompanyMark from '@/components/CompanyMark';

const Rocket = () => {
  return (
    <AnimatedSection className="rkt grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 items-start">
      <div className="col-span-full w-full lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-start">
        {/* Description */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/20 rounded-lg">
          <div className="flex items-start gap-4 mb-4">
            <CompanyMark company="rocket" />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Rocket</h2>
              <h4 className="text-white/50 text-balance text-base font-bold italic mt-1.5">A boutique digital agency</h4>
            </div>
          </div>
          <div className="w-full border-b-2 border-white/20 mb-4"></div>
          <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
            I co-founded this agency and led design as we grew from two people to twenty over a decade. We designed and built apps and sites for startups and names like Ellen, DreamWorks, and The Economist — and became an ideation and prototyping lab for Warner Bros.
          </p>
        </div>

        {/* Highlights */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/20 rounded-lg flex flex-col items-start">
          <h3 className="text-xl font-bold mt-2 mb-4 text-balance">Co-Founder + Product Designer + Front-End Developer</h3>
          <div className="w-full border-b-2 border-white/20 mb-6"></div>
          <ul className="list-none space-y-4 w-full">
             <li className="pl-6 relative before:content-['+'] before:absolute before:left-0 before:top-0 before:font-bold before:text-2xl before:leading-none before:text-white/50 text-lg leading-snug text-white/90 text-pretty">Hired and led a 20-person team across product, back-end, front-end, iOS, and Android</li>
             <li className="pl-6 relative before:content-['+'] before:absolute before:left-0 before:top-0 before:font-bold before:text-2xl before:leading-none before:text-white/50 text-lg leading-snug text-white/90 text-pretty">Designed and shipped custom apps and websites across 30+ client projects</li>
             <li className="pl-6 relative before:content-['+'] before:absolute before:left-0 before:top-0 before:font-bold before:text-2xl before:leading-none before:text-white/50 text-lg leading-snug text-white/90 text-pretty">Ran sales, marketing, and accounts across dozens of engagements</li>
             <li className="pl-6 relative before:content-['+'] before:absolute before:left-0 before:top-0 before:font-bold before:text-2xl before:leading-none before:text-white/50 text-lg leading-snug text-white/90 text-pretty">Designed and built A Beautiful Mess, the photo editor that hit #1 Paid on the App Store</li>
             <li className="pl-6 relative before:content-['+'] before:absolute before:left-0 before:top-0 before:font-bold before:text-2xl before:leading-none before:text-white/50 text-lg leading-snug text-white/90 text-pretty">Designed and built a multi-million-dollar CRM/CMS for one of the largest US auto-sales organizations</li>
          </ul>
        </div>
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-3 lg:row-span-2 relative">
         <Image src="/imgs/rkt/rkt4.webp" alt="rocket example" width={800} height={600} className="w-full h-full object-cover rounded shadow-2xl" />
      </div>
      <div className="col-span-1 md:col-span-1 lg:col-span-3 relative">
         <Image src="/imgs/rkt/rkt3.webp" alt="rocket example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-3">
           <div className="clients grid grid-cols-3 gap-12 p-8">
            <Image src="/imgs/rkt/client1.svg" alt="client logo" width={150} height={75} className="h-24 w-auto opacity-90 hover:opacity-100 transition-opacity" />
            <Image src="/imgs/rkt/client2.svg" alt="client logo" width={150} height={75} className="h-24 w-auto opacity-90 hover:opacity-100 transition-opacity" />
            <Image src="/imgs/rkt/client3.svg" alt="client logo" width={150} height={75} className="h-24 w-auto opacity-90 hover:opacity-100 transition-opacity" />
            <Image src="/imgs/rkt/client4.svg" alt="client logo" width={150} height={75} className="h-24 w-auto opacity-90 hover:opacity-100 transition-opacity" />
            <Image src="/imgs/rkt/client5.svg" alt="client logo" width={150} height={75} className="h-24 w-auto opacity-90 hover:opacity-100 transition-opacity" />
            <Image src="/imgs/rkt/client6.svg" alt="client logo" width={150} height={75} className="h-24 w-auto opacity-90 hover:opacity-100 transition-opacity" />
            <Image src="/imgs/rkt/client7.svg" alt="client logo" width={150} height={75} className="h-24 w-auto opacity-90 hover:opacity-100 transition-opacity" />
            <Image src="/imgs/rkt/client8.svg" alt="client logo" width={150} height={75} className="h-24 w-auto opacity-90 hover:opacity-100 transition-opacity" />
            <Image src="/imgs/rkt/client9.svg" alt="client logo" width={150} height={75} className="h-24 w-auto opacity-90 hover:opacity-100 transition-opacity" />
          </div>
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-2 relative">
         <Image src="/imgs/rkt/rkt5.webp" alt="rocket example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-4 relative">
         <Image src="/imgs/rkt/rkt1.jpg" alt="rocket example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>
    </AnimatedSection>
  );
};

export default Rocket;
