import React from 'react';
import Image from 'next/image';

const AboutPhotos = () => {
  return (
    <div className="w-[88%] lg:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
      {['about1', 'about2', 'about3'].map((name) => (
        <div key={name} className="relative aspect-[11/8] w-full overflow-hidden rounded shadow-2xl">
          <Image
            src={`/imgs/about/${name}@2x.jpg`}
            alt="Photo of Dave"
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover object-center"
          />
        </div>
      ))}
    </div>
  );
};

export default AboutPhotos;
