import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';

const QuotaPath = () => {
  return (
    <AnimatedSection className="quotapath grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 items-center">
      <div className="col-span-full w-full lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-start">
        {/* Description */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/10 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-4xl font-bold">QuotaPath</h2>
          </div>
          <h4 className="text-(--color-2) text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">A Series B SaaS platform for sales commission planning and tracking</h4>
          <p className="mb-4 text-lg leading-8 text-white/90">
            Commission plans are a tangle of rates, tiers, and edge cases. I designed across teams to make that math clear, shipping features monthly and building the Compensation Hub from scratch so sales teams could explore, compare, and model plans.
          </p>
        </div>

        {/* Highlights */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/10 rounded-lg flex flex-col items-start">
          <h3 className="text-2xl font-bold my-2">Senior Product UX/UI Designer</h3>
          <h4 className="text-xl font-semibold text-(--color-2) mb-4 tracking-wider">Highlights:</h4>
          <div className="w-full border-b-2 border-white/10 mb-6"></div>
          <ul className="list-none space-y-4 w-full">
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-2) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Shipped platform features monthly: comp modeling, onboarding, sandboxes, and payouts</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-2) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Designed and launched the Compensation Hub, a commission-plan library and modeling tool that drove $1.5M+ in new pipeline in a year</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-2) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Co-created the Shape Up process across 4 cross-functional teams and mentored the designers running it</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-2) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Kept design and engineering building from the same Figma component libraries</li>
          </ul>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-5 relative">
         <Image src="/imgs/quotapath/qp6.png" alt="quotapath example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-4 relative">
          <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white px-4 py-2 rounded-lg shadow-xl z-10 text-center">
            <h5 className="text-black font-bold text-xl">design sprints &amp; prototyping</h5>
          </div>
         <Image src="/imgs/quotapath/qp3.png" alt="quotapath example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>
      
      <div className="col-span-1 md:col-span-1 lg:col-span-2 relative">
         <Image src="/imgs/quotapath/qp4.png" alt="quotapath example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>
      
      {/* <div className="col-span-1 md:col-span-1 lg:col-span-2 relative">
         <Image src="/imgs/quotapath/qp5.png" alt="quotapath example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div> */}
      
      <div className="col-span-1 md:col-span-1 lg:col-span-3 relative">
         <Image src="/imgs/quotapath/qp1.png" alt="quotapath example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>
      
      <div className="col-span-1 md:col-span-1 lg:col-span-3 relative">
         <Image src="/imgs/quotapath/qp2.png" alt="quotapath example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

    </AnimatedSection>
  );
};

export default QuotaPath;
