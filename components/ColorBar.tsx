import React from 'react';

// Ten stripes, palette colors 1-5 repeated twice. Each stripe starts the shared
// color-cycle animation 5s behind its left neighbor (one full color slot), which
// reproduces the original static striping while the colors drift along the bar.
// The inline backgroundColor keeps that striping when reduced motion disables
// the animation.
const ColorBar = () => {
  return (
    <div className="fixed top-0 z-50 flex h-[3px] w-full justify-evenly">
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={i}
          className="color-bar-stripe w-[10%]"
          style={{
            backgroundColor: `var(--color-${(i % 5) + 1})`,
            animationDelay: `${i * -5}s`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default ColorBar;
