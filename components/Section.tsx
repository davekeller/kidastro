import React from 'react';

interface SectionProps {
  className?: string;
  children: React.ReactNode;
}

const Section = ({ className = '', children }: SectionProps) => {
  return (
    <div className={`section relative mx-auto grid gap-8 overflow-hidden md:w-[95%] lg:w-full ${className}`}>
      {children}
    </div>
  );
};

export default Section;
