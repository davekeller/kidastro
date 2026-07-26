import type { Song } from '../types';

const song: Song = {
  slug: "go-dark",
  title: "Go Dark",
  cover: {
    artist: "Korn"
  },
  status: "ready",
  sections: [
    {
      label: "Verse 1",
      lines: [
        "keep your head down",
        "eat your heart out",
        "or: find your way out"
      ]
    },
    {
      label: "Chorus 1",
      lines: [
        "holy ghost / you lied"
      ]
    },
    {
      label: "Verse 2",
      lines: [
        "do the right thing",
        "end the suffering"
      ]
    },
    {
      label: "Chorus 2",
      lines: [
        "holy ghost / you died",
        "hide the truth / feed your pride"
      ]
    },
    {
      label: "Break",
      lines: [
        "break free / the end of me",
        "",
        "fuck all / no light",
        "go dark / permanent midnight",
        "",
        "think free / don't hide",
        "feed on / the end of me"
      ]
    }
  ]
};

export default song;
