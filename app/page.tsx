import React from 'react';
import Image from 'next/image';
import Intro from '@/components/Intro';
import Section from '@/components/Section';
import Project from '@/components/Project';
import Break from '@/components/Break';
import Accomplishments from '@/components/Accomplishments';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Break bg="no_bg" symbols={[]} />
      <Intro />

      {/* QUOTAPATH */}
      <Section className="quotapath">
        <Project
          title="Quotapath"
          subtitle="an industry leading sales commission saas platform"
          description={[
            "At Quotapath, I led design for multiple product teams — crafting new product features monthly, as well as a brand new product called the Compensation Hub — helping sales teams explore, compare, and customize commission plans."
          ]}
          images={[
            { src: "/imgs/quotapath/qp1.png", alt: "quotapath example" },
            { src: "/imgs/quotapath/qp2.png", alt: "quotapath example" },
            { src: "/imgs/quotapath/qp3.png", alt: "quotapath example" },
            { src: "/imgs/quotapath/qp4.png", alt: "quotapath example" },
            { src: "/imgs/quotapath/qp5.png", alt: "quotapath example" },
            { src: "/imgs/quotapath/qp6.png", alt: "quotapath example" },
          ]}
        />
      </Section>

      <Break symbols={['+', '▵', '+']} />

      {/* RODIO */}
      <Section className="rodio">
        <Project
          title="Rodio"
          subtitle="workforce communication for big retail"
          description={[
            "I led design from early ideas through revenue for this mid-size startup – concepting, facilitating design sprints, architecting UX, prototyping, and creating production-ready UI's across our native web, iOS and Android apps.",
            "Within two years, we signed MarketSource/Allegis (the employee staffing agency for Target and Best Buy), and integrated with Kronos (a Fortune-100 workforce management software company)."
          ]}
          images={[
            { src: "/imgs/rodio/rodio1.png", alt: "rodio example" },
            { src: "/imgs/rodio/rodio2.jpg", alt: "rodio example" },
            { src: "/imgs/rodio/rodio3.jpg", alt: "rodio example" },
          ]}
          highlights={[
            "Led design for a product team of 20 (web, iOS and Android)",
            "Facilitated design sprints to define problems, brainstorm solutions, and protoype ideas",
            "Created and maintained a design system with master, web, iOS and Android component libraries",
            "Pitched a demo that solidified an integration partnership with a Fortune-100"
          ]}
        />
         <div className="grid gap-8 mt-8">
            <div className="relative">
                 <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white/95 p-3 rounded shadow-xl z-10 text-center">
                  <h5 className="text-[#063241] font-bold">ux flows</h5>
                </div>
                <Image src="/imgs/rodio/rodio4.jpg" alt="rodio example" width={800} height={600} className="w-full rounded shadow-2xl" />
            </div>
             <div className="relative">
                 <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white/95 p-3 rounded shadow-xl z-10 text-center">
                  <h5 className="text-[#063241] font-bold">pitch decks</h5>
                </div>
                <Image src="/imgs/rodio/rodio5.jpg" alt="rodio example" width={800} height={600} className="w-full rounded shadow-2xl" />
            </div>
         </div>
      </Section>

      <Break symbols={['+', '▵', '+']} />

      {/* BNB */}
      <Section className="bnb">
        <Project
          title="Bnbfinder"
          subtitle="a platform for niche travel listings (now Savvy.com)"
          description={[
            "Led design and front-end development on this platform for multiple travel listing verticals, starting with bnbfinder. The platform included a consumer app for travelers, a member app for property owners, and a back-office app for administrators.",
            "We built the platform and the first travel site, from whiteboards to 8k subscribers (4k paid), with a team of 3, in under a year."
          ]}
          images={[
            { src: "/imgs/bnb/bnb1.png", alt: "bnbfinder example" },
            { src: "/imgs/bnb/bnb2.png", alt: "bnbfinder example" },
            { src: "/imgs/bnb/bnb3.jpg", alt: "bnbfinder example" },
          ]}
           highlights={[
            "Concepted, designed and wrote front-end code for this a platform (consumer, owner and admin apps) from scratch on the tech stack: Elixir > React / Next.js > Custom front-end Framework / Tailwind CSS",
            "Created and helped manage our agile development process using Jira and Trello",
            "Presented bi-weekly development updates to the management, sales and marketing teams"
          ]}
        />
        <div className="grid gap-8 mt-8">
             <Image src="/imgs/bnb/bnb4.png" alt="bnbfinder example" width={800} height={600} className="w-full rounded shadow-2xl" />
            <div className="relative">
                 <div className="absolute top-1/2 left-0 right-0 mx-auto max-w-max bg-white/95 p-3 rounded shadow-xl z-10 text-center">
                  <h5 className="text-[#063241] font-bold">sprint update decks</h5>
                </div>
                <Image src="/imgs/bnb/bnb5.jpg" alt="bnbfinder example" width={800} height={600} className="w-full rounded shadow-2xl" />
            </div>
        </div>
      </Section>

      <Break symbols={['+', '/', '△', '/', '+']} />

      <Accomplishments />

      <Break symbols={['▽', '\\', '+', '/', '▽']} />

      {/* ROCKET */}
      <Section className="rkt">
        <Project
          title="Rocket"
          subtitle="a boutique digital agency"
          description={[
            "Over the better part of a decade, I co-founded, helped grow the business, and led design for Rocket — a 2-person indie dev shop we grew into a 20-person digital agency. We specialized in concepting, prototyping and building apps and websites for early-stage startups to household names."
          ]}
          images={[
            { src: "/imgs/rkt/rkt1.jpg", alt: "rocket example" },
            { src: "/imgs/rkt/rkt2.png", alt: "rocket example" },
            { src: "/imgs/rkt/rkt3.png", alt: "rocket example" },
          ]}
          highlights={[
            "Managed marketing/sales and accounts for dozens of client projects",
            "Hired, managed and grew a product team of back-end, front-end, iOS and Android developers",
            "Concepted, designed and delivered custom apps and websites for 30+ client projects",
            "Designed and launched a #1 Paid iTunes App through a 2.0 release",
            "Created a multi-million dollar CRM/CMS platform for one of the largest (and most intense) auto sales organizations in the US"
          ]}
        />
         <div className="grid gap-8 mt-8">
            <Image src="/imgs/rkt/rkt4.jpg" alt="rocket example" width={800} height={600} className="w-full rounded shadow-2xl" />
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
      </Section>

      <Break bg="bg2" symbols={['▽', '/', '△', '/', '▽']} />

      {/* TIMEBOMB */}
      <Section className="tmb">
         <Image src="/imgs/tmb/tmb1.jpg" alt="tmb website" width={800} height={600} className="w-full rounded shadow-2xl" />
        <Project
          title="Timebomb"
          subtitle="a conditional messaging app"
          description={[
            "I Co-Founded and led design for this conditional messaging app (native iOS and Android) from whiteboard sketches through a 2.0 release with a team of 10.",
            "The hip and user-friendly experience helped us raise two investment rounds with some big name investors and marketing partners."
          ]}
          images={[]}
        />
        <Image src="/imgs/tmb/tmb2.jpg" alt="timebomb website" width={800} height={600} className="w-full rounded shadow-2xl" />
      </Section>

      <Break symbols={['▽', '/', '△', '/', '▽']} />

      {/* PUPPYWISE */}
      <Section className="puppy">
        <Project
          title="Puppywise"
          subtitle="a web app to find reputable breeders"
          description={[
            "I consulted for this puppy breeder client, including: conception and design of their breed and breeder search UX, details views, and admin views."
          ]}
          images={[
             { src: "/imgs/puppy/puppy1.png", alt: "puppy breeder" },
          ]}
        />
      </Section>

      <Break bg="bg2" symbols={['+', '△', '+']} />

      {/* DANCEFIGHT */}
      <Section className="dance">
         <Image src="/imgs/dance/dance1.jpg" alt="dancefight example" width={800} height={600} className="w-full rounded shadow-2xl" />
        <Project
          title="Dancefight"
          subtitle="a social voting app"
          description={[
            "I consulted for this seed-round startup and helped with UX flows and final UIs for onboaring/tutorials, the main feed, the voting UX, tournament creation, and tournament brackets."
          ]}
          images={[]}
        />
        <Image src="/imgs/dance/dance2.jpg" alt="dancefight example" width={800} height={600} className="w-full rounded shadow-2xl" />
      </Section>

      <Footer />
    </main>
  );
}
