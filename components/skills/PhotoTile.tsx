'use client';

import React from 'react';
import Image from 'next/image';
import { INSTAGRAM_URL, type Photo } from './skillsData';

const PhotoTile = ({ photo }: { photo: Photo }) => {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-2xl border border-white/10"
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        className="w-full transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="text-sm font-semibold text-white">{photo.caption}</p>
        <p className="text-xs text-[#39d5cb]">@kid4stro</p>
      </div>
    </a>
  );
};

export default PhotoTile;
