import type { Song } from '../types';

const song: Song = {
  slug: "enjoy-the-silence",
  title: "Enjoy the Silence",
  cover: {
    artist: "Depeche Mode"
  },
  status: "ready",
  sections: [
    {
      label: "Verse 1",
      lines: [
        "Words like violence",
        "Break the silence",
        "Come crashing in",
        "Into my little world",
        "Painful to me",
        "Pierce right through me",
        "Can't you understand",
        "Oh my little girl"
      ]
    },
    {
      label: "Chorus",
      lines: [
        "All I ever wanted",
        "All I ever needed",
        "Is here in my arms",
        "Words are very unnecessary",
        "They can only do harm"
      ]
    },
    {
      label: "Verse 2",
      lines: [
        "Vows are spoken",
        "To be broken",
        "Feelings are intense",
        "Words are trivial",
        "Pleasures remain",
        "So does the pain",
        "Words are meaningless",
        "And forgettable"
      ]
    },
    {
      label: "Chorus",
      lines: [
        "All I ever wanted",
        "All I ever needed",
        "Is here in my arms",
        "Words are very unnecessary",
        "They can only do harm"
      ]
    },
    {
      label: "Outro",
      lines: [
        "Enjoy the silence"
      ]
    }
  ]
};

export default song;
