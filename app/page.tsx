import React from 'react';
import Image from 'next/image';
import Intro from '@/components/Intro';
import AnimatedSection from '@/components/AnimatedSection';
import Break from '@/components/Break';
import Accomplishments from '@/components/Accomplishments';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-x-hidden z-10">
      <Break bg="no_bg" symbols={[]} />
      <Intro />

      {/* QUOTAPATH */}
      <AnimatedSection className="quotapath grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 items-center">
        <div className="info col-span-1 md:col-span-2 lg:col-span-4 lg:col-start-2 text-left text-white px-8 py-4">
          <h2 className="text-4xl font-bold mb-2">Quotapath</h2>
          <h4 className="text-teal-400 text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">an industry leading sales commission saas platform</h4>
          <p className="mb-4 text-lg leading-8 text-white/90">
            At Quotapath, I led design for multiple product teams — crafting new product features monthly, as well as a brand new product called the Compensation Hub — helping sales teams explore, compare, and customize commission plans.
          </p>
        </div>

        <div className="col-span-1 md:col-span-1 lg:col-span-3 relative">
           <Image src="/imgs/quotapath/qp1.png" alt="quotapath example" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-3 relative">
           <Image src="/imgs/quotapath/qp2.png" alt="quotapath example" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-4 relative">
           <Image src="/imgs/quotapath/qp3.png" alt="quotapath example" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-2 relative">
           <Image src="/imgs/quotapath/qp4.png" alt="quotapath example" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-2 relative">
           <Image src="/imgs/quotapath/qp5.png" alt="quotapath example" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-4 relative">
           <Image src="/imgs/quotapath/qp6.png" alt="quotapath example" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>
      </AnimatedSection>

      <Break symbols={['+', '▵', '+']} />

      {/* RODIO */}
      <AnimatedSection className="rodio grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 items-center">
        <div className="info col-span-1 md:col-span-2 lg:col-span-2 text-left text-white px-8 py-4 lg:text-right lg:pl-16">
          <h2 className="text-4xl font-bold mb-2">Rodio</h2>
          <h4 className="text-teal-400 text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">workforce communication for big retail</h4>
          <p className="mb-4 text-lg leading-8 text-white/90">
            I led design from early ideas through revenue for this mid-size startup – concepting, facilitating design sprints, architecting UX, prototyping, and creating production-ready UI&apos;s across our native web, iOS and Android apps.
          </p>
          <p className="mb-4 text-lg leading-8 text-white/90">
            Within two years, we signed MarketSource/Allegis (the employee staffing agency for Target and Best Buy), and integrated with Kronos (a Fortune-100 workforce management software company).
          </p>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-4 relative">
           <Image src="/imgs/rodio/rodio1.png" alt="rodio example" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-4 relative lg:rounded-r-md overflow-hidden">
           <Image src="/imgs/rodio/rodio2.jpg" alt="rodio example" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>

        <div className="col-span-1 md:col-span-1 lg:col-span-2 relative lg:rounded-l-md overflow-hidden">
            <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white/95 p-3 rounded shadow-xl z-10 text-center">
              <h5 className="text-[#063241] font-bold">rodio design system</h5>
            </div>
           <Image src="/imgs/rodio/rodio3.jpg" alt="rodio example" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>

        <div className="col-span-1 md:col-span-1 lg:col-span-2 relative lg:rounded-r-md overflow-hidden">
            <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white/95 p-3 rounded shadow-xl z-10 text-center">
              <h5 className="text-[#063241] font-bold">ux flows</h5>
            </div>
           <Image src="/imgs/rodio/rodio4.jpg" alt="rodio example" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>

        <div className="info col-span-1 md:col-span-1 lg:col-span-2 px-8">
          <h3 className="text-2xl font-semibold text-teal-400 mb-4 tracking-wider">highlights</h3>
          <ul className="list-none space-y-2">
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-teal-400 before:rounded-full">Led design for a product team of 20 (web, iOS and Android)</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-teal-400 before:rounded-full">Facilitated design sprints to define problems, brainstorm solutions, and protoype ideas</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-teal-400 before:rounded-full">Created and maintained a design system with master, web, iOS and Android component libraries</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-teal-400 before:rounded-full">Pitched a demo that solidified an integration partnership with a Fortune-100</li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-1 lg:col-span-2 relative lg:rounded-l-md overflow-hidden">
             <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white/95 p-3 rounded shadow-xl z-10 text-center">
              <h5 className="text-[#063241] font-bold">pitch decks</h5>
            </div>
           <Image src="/imgs/rodio/rodio5.jpg" alt="rodio example" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>
      </AnimatedSection>

      <Break symbols={['+', '▵', '+']} />

      {/* BNB */}
      <AnimatedSection className="bnb grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 items-center">
        <div className="info col-span-1 md:col-span-2 lg:col-span-4 lg:col-start-2 text-left text-white px-8 py-4">
          <h2 className="text-4xl font-bold mb-2">Bnbfinder</h2>
          <h4 className="text-teal-400 text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">a platform for niche travel listings (now Savvy.com)</h4>
          <p className="mb-4 text-lg leading-8 text-white/90">
            Led design and front-end development on this platform for multiple travel listing verticals, starting with bnbfinder. The platform included a consumer app for travelers, a member app for property owners, and a back-office app for administrators.
          </p>
          <p className="mb-4 text-lg leading-8 text-white/90">
            We built the platform and the first travel site, from whiteboards to 8k subscribers (4k paid), with a team of 3, in under a year.
          </p>
        </div>

        <div className="col-span-1 md:col-span-1 lg:col-span-3 relative">
           <Image src="/imgs/bnb/bnb1.png" alt="bnbfinder example" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-3 relative">
           <Image src="/imgs/bnb/bnb2.png" alt="bnbfinder example" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-3 relative lg:rounded-r-md overflow-hidden">
            <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white/95 p-3 rounded shadow-xl z-10 text-center">
              <h5 className="text-[#063241] font-bold">bnbfinder design system</h5>
            </div>
           <Image src="/imgs/bnb/bnb3.jpg" alt="bnbfinder example" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>

        <div className="info col-span-1 md:col-span-2 lg:col-span-3 px-8">
          <h3 className="text-2xl font-semibold text-teal-400 mb-4 tracking-wider">highlights</h3>
          <ul className="list-none space-y-2">
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-teal-400 before:rounded-full">Concepted, designed and wrote front-end code for this a platform (consumer, owner and admin apps) from scratch on the tech stack: Elixir &gt; React / Next.js &gt; Custom front-end Framework / Tailwind CSS</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-teal-400 before:rounded-full">Created and helped manage our agile development process using Jira and Trello</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-teal-400 before:rounded-full">Presented bi-weekly development updates to the management, sales and marketing teams</li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-1 lg:col-span-3 relative">
           <Image src="/imgs/bnb/bnb4.png" alt="bnbfinder example" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-3 relative lg:rounded-l-md overflow-hidden">
             <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white/95 p-3 rounded shadow-xl z-10 text-center">
              <h5 className="text-[#063241] font-bold">sprint update decks</h5>
            </div>
           <Image src="/imgs/bnb/bnb5.jpg" alt="bnbfinder example" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>
      </AnimatedSection>

      <Break symbols={['+', '/', '△', '/', '+']} />

      <Accomplishments />

      <Break symbols={['▽', '\\', '+', '/', '▽']} />

      {/* ROCKET */}
      <AnimatedSection className="rkt grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 items-center">
        <div className="info col-span-1 md:col-span-2 lg:col-span-2 lg:col-start-5 text-left text-white px-8 py-4">
          <h2 className="text-4xl font-bold mb-2">Rocket</h2>
          <h4 className="text-teal-400 text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">a boutique digital agency</h4>
          <p className="mb-4 text-lg leading-8 text-white/90">
            Over the better part of a decade, I co-founded, helped grow the business, and led design for Rocket — a 2-person indie dev shop we grew into a 20-person digital agency. We specialized in concepting, prototyping and building apps and websites for early-stage startups to household names.
          </p>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-4 lg:row-start-1 relative">
           <Image src="/imgs/rkt/rkt1.jpg" alt="rocket example" width={800} height={600} className="w-full rounded shadow-2xl" />
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

        <div className="info col-span-1 md:col-span-1 lg:col-span-3 px-8">
          <h3 className="text-2xl font-semibold text-teal-400 mb-4 tracking-wider">highlights</h3>
          <ul className="list-none space-y-2">
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-teal-400 before:rounded-full">Managed marketing/sales and accounts for dozens of client projects</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-teal-400 before:rounded-full">Hired, managed and grew a product team of back-end, front-end, iOS and Android developers</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-teal-400 before:rounded-full">Concepted, designed and delivered custom apps and websites for 30+ client projects</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-teal-400 before:rounded-full">Designed and launched a #1 Paid iTunes App through a 2.0 release</li>
             <li className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-teal-400 before:rounded-full">Created a multi-million dollar CRM/CMS platform for one of the largest (and most intense) auto sales organizations in the US</li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-3 lg:col-start-4">
             <div className="clients flex flex-wrap justify-center gap-8 p-8 bg-white/5 rounded-xl">
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
      </AnimatedSection>

      <Break bg="bg2" symbols={['▽', '/', '△', '/', '▽']} />

      {/* TIMEBOMB */}
      <AnimatedSection className="tmb grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
         <div className="col-span-1 relative">
            <Image src="/imgs/tmb/tmb1.jpg" alt="tmb website" width={800} height={600} className="w-full rounded shadow-2xl" />
         </div>
         <div className="info col-span-1 text-left text-white px-8 py-4">
          <h2 className="text-4xl font-bold mb-2">Timebomb</h2>
          <h4 className="text-teal-400 text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">a conditional messaging app</h4>
          <p className="mb-4 text-lg leading-8 text-white/90">
            I Co-Founded and led design for this conditional messaging app (native iOS and Android) from whiteboard sketches through a 2.0 release with a team of 10.
          </p>
          <p className="mb-4 text-lg leading-8 text-white/90">
            The hip and user-friendly experience helped us raise two investment rounds with some big name investors and marketing partners.
          </p>
        </div>
        <div className="col-span-1 relative">
            <Image src="/imgs/tmb/tmb2.jpg" alt="timebomb website" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>
      </AnimatedSection>

      <Break symbols={['▽', '/', '△', '/', '▽']} />

      {/* PUPPYWISE */}
      <AnimatedSection className="puppy grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="info col-span-1 text-left text-white px-8 py-4">
          <h2 className="text-4xl font-bold mb-2">Puppywise</h2>
          <h4 className="text-teal-400 text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">a web app to find reputable breeders</h4>
          <p className="mb-4 text-lg leading-8 text-white/90">
            I consulted for this puppy breeder client, including: conception and design of their breed and breeder search UX, details views, and admin views.
          </p>
        </div>
        <div className="col-span-1 relative">
             <Image src="/imgs/puppy/puppy1.png" alt="puppy breeder" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>
      </AnimatedSection>

      <Break bg="bg2" symbols={['+', '△', '+']} />

      {/* DANCEFIGHT */}
      <AnimatedSection className="dance grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
         <div className="col-span-1 relative">
            <Image src="/imgs/dance/dance1.jpg" alt="dancefight example" width={800} height={600} className="w-full rounded shadow-2xl" />
         </div>
         <div className="info col-span-1 text-left text-white px-8 py-4">
          <h2 className="text-4xl font-bold mb-2">Dancefight</h2>
          <h4 className="text-teal-400 text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">a social voting app</h4>
          <p className="mb-4 text-lg leading-8 text-white/90">
            I consulted for this seed-round startup and helped with UX flows and final UIs for onboaring/tutorials, the main feed, the voting UX, tournament creation, and tournament brackets.
          </p>
        </div>
        <div className="col-span-1 relative">
            <Image src="/imgs/dance/dance2.jpg" alt="dancefight example" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>
        <div className="col-span-1 md:col-span-3 relative">
            <Image src="/imgs/dance/dance3.jpg" alt="dancefight example" width={800} height={600} className="w-full rounded shadow-2xl" />
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  );
}
