import React from 'react';

const ColorBar = () => {
  return (
    <div className="fixed top-0 z-50 flex h-[5px] w-full justify-evenly bg-black/50 backdrop-blur-sm">
      <div className="w-[12.5%] bg-[var(--neon-blue)] shadow-[0_0_10px_var(--neon-blue)]"></div>
      <div className="w-[12.5%] bg-[var(--neon-pink)] shadow-[0_0_10px_var(--neon-pink)]"></div>
      <div className="w-[12.5%] bg-[var(--neon-green)] shadow-[0_0_10px_var(--neon-green)]"></div>
      <div className="w-[12.5%] bg-[var(--neon-yellow)] shadow-[0_0_10px_var(--neon-yellow)]"></div>
      <div className="w-[12.5%] bg-[var(--neon-purple)] shadow-[0_0_10px_var(--neon-purple)]"></div>
      <div className="w-[12.5%] bg-[var(--neon-blue)] shadow-[0_0_10px_var(--neon-blue)]"></div>
      <div className="w-[12.5%] bg-[var(--neon-pink)] shadow-[0_0_10px_var(--neon-pink)]"></div>
      <div className="w-[12.5%] bg-[var(--neon-green)] shadow-[0_0_10px_var(--neon-green)]"></div>
      <div className="w-[12.5%] bg-[var(--neon-yellow)] shadow-[0_0_10px_var(--neon-yellow)]"></div>
      <div className="w-[12.5%] bg-[var(--neon-purple)] shadow-[0_0_10px_var(--neon-purple)]"></div>
    </div>
  );
};

export default ColorBar;
