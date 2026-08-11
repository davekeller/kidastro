import React from 'react';
import Image from 'next/image';

export interface ClientLogo {
  name: string;
  /** Path to a logo SVG/PNG under /public. Falls back to a wordmark when absent. */
  src?: string;
}

/**
 * A row of client marks, matching the Rocket section's client grid. Any client
 * without a logo file renders as a typeset wordmark so the row reads as
 * intentional before the real art is dropped in.
 */
const ClientLogos = ({ clients, className = '' }: { clients: ClientLogo[]; className?: string }) => (
  <div className={`clients grid grid-cols-2 items-center gap-6 p-4 sm:grid-cols-3 sm:gap-10 sm:p-8 lg:grid-cols-5 ${className}`}>
    {clients.map((client) =>
      client.src ? (
        <Image
          key={client.name}
          src={client.src}
          alt={client.name}
          width={185}
          height={50}
          className="h-10 w-full justify-self-center object-contain opacity-70 transition-opacity hover:opacity-100 sm:h-12"
        />
      ) : (
        <span
          key={client.name}
          className="justify-self-center text-center text-sm font-bold uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-white/85 sm:text-base"
        >
          {client.name}
        </span>
      )
    )}
  </div>
);

export default ClientLogos;
