import React from 'react';

interface BreakProps {
  bg?: 'default' | 'no_bg' | 'bg2' | 'bg3';
  symbols: string[];
}

const Break = ({ symbols }: BreakProps) => {
  return (
    <div className="break flex w-full justify-center py-16 md:py-32 bg-transparent">
      <ul className="flex space-x-6 md:space-x-12 text-2xl md:text-3xl font-bold">
        {symbols.map((symbol, index) => (
          <li key={index}>{symbol}</li>
        ))}
      </ul>
    </div>
  );
};

export default Break;
