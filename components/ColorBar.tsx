import React from 'react';

const ColorBar = () => {
  return (
    <div className="fixed top-0 z-50 flex h-[3px] w-full justify-evenly">
      <div className="w-[10%] bg-[var(--color-1)]"></div>
      <div className="w-[10%] bg-[var(--color-2)]"></div>
      <div className="w-[10%] bg-[var(--color-3)]"></div>
      <div className="w-[10%] bg-[var(--color-4)]"></div>
      <div className="w-[10%] bg-[var(--color-5)]"></div>
      <div className="w-[10%] bg-[var(--color-1)]"></div>
      <div className="w-[10%] bg-[var(--color-2)]"></div>
      <div className="w-[10%] bg-[var(--color-3)]"></div>
      <div className="w-[10%] bg-[var(--color-4)]"></div>
      <div className="w-[10%] bg-[var(--color-5)]"></div>
    </div>
  );
};

export default ColorBar;
