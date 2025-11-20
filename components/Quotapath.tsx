import React from 'react';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';

const Quotapath = () => {
  return (
    <AnimatedSection className="quotapath grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 items-center">
      <div className="info col-span-1 md:col-span-2 lg:col-span-6 text-left text-white px-8 py-8 border-2 border-white/10 rounded-2xl max-w-3xl mx-auto mb-8">
        <div className="flex items-start justify-between mb-2">
          <h2 className="text-4xl font-bold">Quotapath</h2>
          <span className="text-sm text-white/50 mt-2">Lead Product Designer</span>
        </div>
        <h4 className="text-(--color-2) text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">An industry leading sales commission saas platform</h4>
        <p className="mb-4 text-lg leading-8 text-white/90">
          At Quotapath, I led design for multiple product teams — crafting new product features monthly, as well as a brand new product called the Compensation Hub — helping sales teams explore, compare, and customize commission plans.
        </p>
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-5 relative">
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
