import React from 'react';

const ColorBar = () => {
  return (
    <div className="fixed top-0 z-50 flex h-[12px] w-full justify-evenly">
      <div className="w-[10%] bg-[var(--color-1)] shadow-[0_0_10px_var(--color-1)]"></div>
      <div className="w-[10%] bg-[var(--color-2)] shadow-[0_0_10px_var(--color-2)]"></div>
      <div className="w-[10%] bg-[var(--color-3)] shadow-[0_0_10px_var(--color-3)]"></div>
      <div className="w-[10%] bg-[var(--color-4)] shadow-[0_0_10px_var(--color-4)]"></div>
      <div className="w-[10%] bg-[var(--color-5)] shadow-[0_0_10px_var(--color-5)]"></div>
      <div className="w-[10%] bg-[var(--color-6)] shadow-[0_0_10px_var(--color-6)]"></div>
      <div className="w-[10%] bg-[var(--color-7)] shadow-[0_0_10px_var(--color-7)]"></div>
      <div className="w-[10%] bg-[var(--color-8)] shadow-[0_0_10px_var(--color-8)]"></div>
      <div className="w-[10%] bg-[var(--color-9)] shadow-[0_0_10px_var(--color-9)]"></div>
      <div className="w-[10%] bg-[var(--color-10)] shadow-[0_0_10px_var(--color-10)]"></div>
    </div>
  );
};

export default ColorBar;
