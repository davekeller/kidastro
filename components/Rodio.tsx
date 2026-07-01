import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';

const Rodio = () => {
  return (
    <AnimatedSection className="rodio grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 items-start">
      <div className="col-span-full w-full lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-start">
        {/* Description */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/10 rounded-2xl">
          <h2 className="text-4xl font-bold mb-2">Rodio</h2>
          <h4 className="text-[var(--color-3)] text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">Workforce communication for big retail</h4>
          <p className="mb-4 text-lg leading-8 text-white/90">
            Led design from first sketch to revenue at this workforce-comms startup, building one multi-platform design system that kept web, iOS, and Android in sync. I ran the sprints and shipped production UI across all three.
          </p>
          <p className="mb-4 text-lg leading-8 text-white/90">
            Within two years we partnered with Kronos, the Fortune-100 workforce-management company, and signed MarketSource, the staffing agency for Target and Best Buy, reaching millions of daily interactions.
          </p>
        </div>

        {/* Highlights */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/10 rounded-2xl flex flex-col items-start">
          <h3 className="text-2xl font-bold my-2">Product UX/UI Design Lead</h3>
          <h4 className="text-xl font-semibold text-[var(--color-3)] mb-4 tracking-wider">Highlights:</h4>
          <div className="w-full border-b-2 border-white/10 mb-6"></div>
          <ul className="list-none space-y-4 w-full">
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-[var(--color-3)] before:rounded-full text-lg leading-snug text-white/90 font-semibold">Led design for a 20-person team building across web, iOS, and Android</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-[var(--color-3)] before:rounded-full text-lg leading-snug text-white/90 font-semibold">Ran design sprints to frame problems and prototype solutions fast</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-[var(--color-3)] before:rounded-full text-lg leading-snug text-white/90 font-semibold">Built and maintained a multi-platform design system: master, web, iOS, and Android component libraries</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-[var(--color-3)] before:rounded-full text-lg leading-snug text-white/90 font-semibold">Pitched the demo that closed the Fortune-100 partnership and led to acquisition</li>
          </ul>
        </div>
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-1 relative"></div>

      <div className="col-span-1 md:col-span-2 lg:col-span-5 relative">
         <Image src="/imgs/rodio/rodio1.png" alt="rodio example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-3 relative lg:rounded-r-md overflow-hidden">
          <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white px-4 py-2 rounded-lg shadow-xl z-10 text-center">
            <h5 className="text-black font-extrabold text-xl">ux flows</h5>
          </div>
         <Image src="/imgs/rodio/rodio4.jpg" alt="rodio example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-1 lg:col-span-3 relative lg:rounded-l-md overflow-hidden">
        <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white px-4 py-2 rounded-lg shadow-xl z-10 text-center">
        <h5 className="text-black font-bold text-xl">pitch decks</h5>
        </div>
        <Image src="/imgs/rodio/rodio5.jpg" alt="rodio example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>
      
      <div className="col-span-1 md:col-span-1 lg:col-span-2 relative lg:rounded-l-md overflow-hidden">
        <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white px-4 py-2 rounded-lg shadow-xl z-10 text-center">
        <h5 className="text-black font-bold text-xl">rodio design system</h5>
        </div>
        <Image src="/imgs/rodio/rodio3.jpg" alt="rodio example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-4 relative lg:rounded-r-md overflow-hidden">
          <Image src="/imgs/rodio/rodio2.jpg" alt="rodio example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

    </AnimatedSection>
  );
};

export default Rodio;
