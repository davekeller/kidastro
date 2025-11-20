import React from 'react';

interface BreakProps {
  bg?: 'default' | 'no_bg' | 'bg2' | 'bg3';
  symbols: string[];
}

const Break = ({ bg = 'default', symbols }: BreakProps) => {
  let bgClass = 'bg-[#063341]'; // default
  if (bg === 'no_bg') bgClass = 'bg-transparent';
  if (bg === 'bg2') bgClass = 'bg-[#073f50]'; // darker blue
  if (bg === 'bg3') bgClass = 'bg-[#063341]'; // same as default for now, check css

  return (
    <div className={`break flex w-full justify-center py-12 ${bgClass}`}>
      <ul className="flex space-x-8 text-2xl font-bold text-white/20">
        {symbols.map((symbol, index) => (
          <li key={index}>{symbol}</li>
        ))}
      </ul>
    </div>
  );
};

export default Break;
