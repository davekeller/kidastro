import React from 'react';

interface BreakProps {
  bg?: 'default' | 'no_bg' | 'bg2' | 'bg3';
  symbols: string[];
}

const Break = ({ bg = 'default', symbols }: BreakProps) => {
  let bgClass = 'bg-[#063341]'; // default
  let bgImage = '';
  
  if (bg === 'no_bg') {
    bgClass = 'bg-transparent';
  } else if (bg === 'bg2') {
    bgClass = 'bg-[#073f50]';
    bgImage = 'bg-[url("/imgs/breaks/break2.svg")] bg-center bg-no-repeat bg-cover';
  } else if (bg === 'bg3') {
    bgClass = 'bg-[#063341]';
    bgImage = 'bg-[url("/imgs/breaks/break3.svg")] bg-center bg-no-repeat bg-cover';
  } else if (bg === 'default') {
    bgImage = 'bg-[url("/imgs/breaks/break1.svg")] bg-center bg-no-repeat bg-cover';
  }

  return (
    <div className={`break flex w-full justify-center py-16 md:py-20 ${bgClass} ${bgImage}`}>
      <ul className="flex space-x-6 md:space-x-12 text-2xl md:text-3xl font-bold text-white/20">
        {symbols.map((symbol, index) => (
          <li key={index}>{symbol}</li>
        ))}
      </ul>
    </div>
  );
};

export default Break;
