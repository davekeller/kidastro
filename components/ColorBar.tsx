import React from 'react';

// A single 3px gradient bar that slowly drifts through the site palette
// (see .color-bar in globals.css). Static gradient under reduced motion.
const ColorBar = () => {
  return <div className="color-bar fixed top-0 z-50 h-[3px] w-full"></div>;
};

export default ColorBar;
