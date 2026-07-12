import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import CompanyMark from '@/components/CompanyMark';

const Rodio = () => {
  return (
    <AnimatedSection className="rodio grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 items-start">
      <div className="col-span-full w-full lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-start">
        {/* Description */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/20 rounded-lg">
          <div className="flex items-start gap-4 mb-4">
            <CompanyMark company="rodio" />
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Rodio</h2>
              <h4 className="text-white/50 text-balance text-base font-bold italic mt-1.5">Workforce communication for big retail</h4>
            </div>
          </div>
          <div className="w-full border-b-2 border-white/20 mb-4"></div>
          <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
            Led design from first sketch to revenue at this workforce-comms startup, building one multi-platform design system that kept web, iOS, and Android in sync. I ran the sprints and shipped production UI across all three.
          </p>
          <p className="mb-4 text-lg leading-8 text-white/90 text-pretty">
            Within two years we partnered with Kronos, the Fortune-100 workforce-management company, and signed MarketSource, the staffing agency for Target and Best Buy, reaching millions of daily interactions.
          </p>
        </div>

        {/* Highlights */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/20 rounded-lg flex flex-col items-start">
          <h3 className="text-xl font-bold mt-2 mb-4 text-balance">Product UX/UI Design Lead</h3>
          <div className="w-full border-b-2 border-white/20 mb-6"></div>
          <ul className="list-none space-y-4 w-full">
             <li className="pl-6 relative before:content-['+'] before:absolute before:left-0 before:top-0 before:font-bold before:text-2xl before:leading-none before:text-white/50 text-lg leading-snug text-white/90 text-pretty">Led design for a 20-person team, from early ideas to 20K+ paid users</li>
             <li className="pl-6 relative before:content-['+'] before:absolute before:left-0 before:top-0 before:font-bold before:text-2xl before:leading-none before:text-white/50 text-lg leading-snug text-white/90 text-pretty">Ran design sprints to frame problems and prototype solutions fast</li>
             <li className="pl-6 relative before:content-['+'] before:absolute before:left-0 before:top-0 before:font-bold before:text-2xl before:leading-none before:text-white/50 text-lg leading-snug text-white/90 text-pretty">Built and maintained a multi-platform design system: master, web, iOS, and Android component libraries</li>
             <li className="pl-6 relative before:content-['+'] before:absolute before:left-0 before:top-0 before:font-bold before:text-2xl before:leading-none before:text-white/50 text-lg leading-snug text-white/90 text-pretty">Pitched the demo that closed the Fortune-100 partnership and led to acquisition</li>
          </ul>
        </div>
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-1 relative"></div>

      <div className="col-span-1 md:col-span-2 lg:col-span-5 relative">
         <Image src="/imgs/rodio/rodio1.webp" alt="rodio example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-3 relative lg:rounded-r-md overflow-hidden">
          <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white/40 backdrop-blur-sm px-4 py-2 rounded-lg shadow-xl z-10 text-center">
            <h5 className="text-black font-extrabold text-xl">ux flows</h5>
          </div>
         <Image src="/imgs/rodio/rodio4.webp" alt="rodio example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-3 relative lg:rounded-l-md overflow-hidden">
        <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white/40 backdrop-blur-sm px-4 py-2 rounded-lg shadow-xl z-10 text-center">
        <h5 className="text-black font-bold text-xl">pitch decks</h5>
        </div>
        <Image src="/imgs/rodio/rodio5.webp" alt="rodio example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>
      
      <div className="col-span-1 md:col-span-1 lg:col-span-2 relative lg:rounded-l-md overflow-hidden">
        <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white/40 backdrop-blur-sm px-4 py-2 rounded-lg shadow-xl z-10 text-center">
        <h5 className="text-black font-bold text-xl">rodio design system</h5>
        </div>
        <Image src="/imgs/rodio/rodio3.webp" alt="rodio example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-4 relative lg:rounded-r-md overflow-hidden">
          <Image src="/imgs/rodio/rodio2.jpg" alt="rodio example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

    </AnimatedSection>
  );
};

export default Rodio;
