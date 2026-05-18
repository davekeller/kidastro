import React from 'react';

type Props = {
  company: string;
  dates: string;
  location: string;
};

const JobHeaderRow = ({ company, dates, location }: Props) => {
  return (
    <div className="flex flex-col items-baseline gap-1 sm:flex-row sm:flex-wrap sm:gap-4">
      <h3 className="text-2xl font-bold text-white">{company}</h3>
      <p className="text-sm text-white/40">
        {dates} · {location}
      </p>
    </div>
  );
};

export default JobHeaderRow;
