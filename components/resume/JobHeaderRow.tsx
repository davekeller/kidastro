import React from 'react';

type Props = {
  company: string;
  dates: string;
  location: string;
};

const JobHeaderRow = ({ company, dates, location }: Props) => {
  return (
    <div className="flex flex-col items-baseline gap-1 sm:flex-row sm:flex-wrap sm:gap-4 print:flex-row print:flex-wrap print:gap-3">
      <h3 className="text-2xl font-bold text-white print:text-base print:text-black">{company}</h3>
      <p className="text-sm text-white/40 print:text-xs print:text-gray-700">
        {dates} · {location}
      </p>
    </div>
  );
};

export default JobHeaderRow;
