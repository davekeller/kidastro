import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';

const Quotapath = () => {
  return (
    <AnimatedSection className="quotapath grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 items-center">
      <div className="col-span-full w-full lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-start">
        {/* Description */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/10 rounded-2xl">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-4xl font-bold">Quotapath</h2>
          </div>
          <h4 className="text-(--color-2) text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">An industry leading sales commission saas platform</h4>
          <p className="mb-4 text-lg leading-8 text-white/90">
            At Quotapath, I led design for multiple product teams — crafting new product features monthly, as well as a brand new product called the Compensation Hub — helping sales teams explore, compare, and customize commission plans.
          </p>
        </div>

        {/* Highlights */}
        <div className="info text-left text-white px-8 py-8 border-2 border-white/10 rounded-2xl flex flex-col items-start">
          <h3 className="text-2xl font-bold my-2">Lead Product Designer</h3>
          <h4 className="text-xl font-semibold text-(--color-2) mb-4 tracking-wider">Highlights:</h4>
          <div className="w-full border-b-2 border-white/10 mb-6"></div>
          <ul className="list-none space-y-4 w-full">
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-2) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Helped create and implement the Shape Up product process with 4 product/engineering teams</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-2) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Led design for multiple product teams, shaping and shipping new features monthly</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-2) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Designed and launched the Compensation Hub, a new product for sales teams</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-(--color-2) before:rounded-full text-lg leading-snug text-white/90 font-semibold">Collaborated closely with engineering and product management to deliver high-quality user experiences</li>
          </ul>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-6 relative">
         <Image src="/imgs/quotapath/qp6.png" alt="quotapath example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-4 relative">
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

export default Quotapath;
