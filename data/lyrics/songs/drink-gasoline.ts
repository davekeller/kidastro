import type { Song } from '../types';

const song: Song = {
  slug: "drink-gasoline",
  title: "Drink Gasoline",
  status: "ready",
  sections: [
    {
      label: "Verse 1",
      lines: [
        "crawl down the drain",
        "bury your head and",
        "",
        "drink gasoline",
        "it's all in your head now"
      ]
    },
    {
      label: "Chorus",
      lines: [
        "wait a minute",
        "what's already done",
        "slow your faders",
        "you're the only one",
        "you're the only one"
      ]
    },
    {
      label: "Verse 2",
      lines: [
        "sniff kerosene",
        "why won't you tell me",
        "",
        "bleed on your screen",
        "down in your belly"
      ]
    }
  ]
};

export default song;
