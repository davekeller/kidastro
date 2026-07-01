'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SkillCard from './SkillCard';
import PhotoTile from './PhotoTile';
import { BUNDLE_PATH, INSTAGRAM_URL, PHOTOS, SKILLS, type Photo, type Skill } from './skillsData';

type Tile = { kind: 'skill'; skill: Skill } | { kind: 'photo'; photo: Photo };

// Sprinkle the photo tiles in among the skill cards.
const PHOTO_POSITIONS = [1, 3, 6, 8, 10, 13, 15, 17, 20, 22];

const buildTiles = (): Tile[] => {
  const tiles: Tile[] = SKILLS.map((skill) => ({ kind: 'skill', skill }));
  PHOTOS.forEach((photo, i) => {
    const at = Math.min(PHOTO_POSITIONS[i], tiles.length);
    tiles.splice(at, 0, { kind: 'photo', photo });
  });
  return tiles;
};

const SkillsView = () => {
  const tiles = buildTiles();

  return (
    <div className="mx-auto w-[96%] max-w-6xl pb-24">
      <header className="mx-auto max-w-3xl px-4 pb-14 pt-28 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-5 font-(family-name:--font-jetbrains) text-xs uppercase tracking-[0.35em] text-[#39d5cb]"
        >
          you found the hidden page
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl text-white md:text-7xl"
        >
          the skills vault
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-5 max-w-xl text-lg text-white/80"
        >
          The Claude Code skills I run every day, the best practices baked into
          them, and a few frames from{' '}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#39d5cb] transition-colors hover:text-[#e4416f]"
          >
            the feed
          </a>
          .
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <a
            href={BUNDLE_PATH}
            download
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-6 py-2.5 text-sm font-medium text-white/80 backdrop-blur-md transition-colors hover:border-(--color-2) hover:text-(--color-2)"
          >
            <span aria-hidden>⤓</span> Download the skills bundle
          </a>
          <p className="font-(family-name:--font-jetbrains) text-xs text-white/30">
            {SKILLS.length} skills · zip · unzip -d ~/.claude/skills
          </p>
        </motion.div>
      </header>

      <div className="columns-1 gap-6 sm:columns-2 xl:columns-3">
        {tiles.map((tile, i) => (
          <motion.div
            key={tile.kind === 'skill' ? tile.skill.command : tile.photo.src}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: 'easeOut' }}
            className="mb-6 break-inside-avoid"
          >
            {tile.kind === 'skill' ? (
              <SkillCard skill={tile.skill} />
            ) : (
              <PhotoTile photo={tile.photo} />
            )}
          </motion.div>
        ))}
      </div>

      <footer className="mt-16 text-center">
        <Link
          href="/"
          className="text-sm text-white/60 transition-colors hover:text-[#39d5cb]"
        >
          ← back to kidastro.com
        </Link>
        <p className="mt-3 font-(family-name:--font-jetbrains) text-xs text-white/20">
          shhh — this page isn&apos;t linked from anywhere
        </p>
      </footer>
    </div>
  );
};

export default SkillsView;
