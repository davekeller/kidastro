import React from 'react';
import Image from 'next/image';

interface ProjectProps {
  title: string;
  subtitle: string;
  description: string[];
  images: { src: string; alt: string; className?: string }[];
  highlights?: string[];
  className?: string;
}

const Project = ({ title, subtitle, description, images, highlights, className = '' }: ProjectProps) => {
  return (
    <div className={`project-container ${className}`}>
      <div className="info text-left text-white z-20 px-8 py-4">
        <h2 className="text-4xl font-bold mb-2">{title}</h2>
        <h4 className="text-teal-400 text-lg font-bold italic border-b-2 border-white/10 pb-4 mb-4">{subtitle}</h4>
        {description.map((desc, index) => (
          <p key={index} className="mb-4 text-lg leading-8 text-white/90">
            {desc}
          </p>
        ))}
      </div>

      {images.map((img, index) => (
        <div key={index} className={`relative ${img.className || ''}`}>
           <Image
            src={img.src}
            alt={img.alt}
            width={800}
            height={600}
            className="rounded shadow-2xl w-full h-auto object-cover"
          />
        </div>
      ))}

      {highlights && (
        <div className="info highlights mt-8 px-8">
          <h3 className="text-2xl font-semibold text-teal-400 mb-4 tracking-wider">Highlights:</h3>
          <ul className="list-none space-y-2">
            {highlights.map((highlight, index) => (
              <li key={index} className="pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 before:w-2 before:h-2 before:bg-teal-400 before:rounded-full">
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Project;
