# Skill: CSS Dark/Light Mode Variables

Use this skill when implementing dark/light mode theming in CSS.

## Reference

Full bookmark with code: `Bookmarks/css/dark-light-mode-variables.md`

## Quick Pattern

```css
/* Root setup */
:root {
  color-scheme: light dark;
  --theme: light;
  @media (prefers-color-scheme: dark) { --theme: dark; }
}

/* Color tokens */
:root {
  --color-bg: light-dark(white, black);
  --color-text: light-dark(black, white);
}

/* Invert a section */
@container style(--theme: light) {
  [data-theme="inverted"] { --theme: dark; }
}
@container style(--theme: dark) {
  [data-theme="inverted"] { --theme: light; }
}
```

## Rules

- Always use `light-dark()` for color values — never hardcode for one mode
- Never use JS for theme switching unless polyfilling Firefox
- Apply `data-theme="inverted"` to flip any section to the opposite mode
- Browser support: Chrome/Edge 111+, Safari 18+, Firefox TBD 2026

## Source

https://daverupert.com/2026/04/inverted-light-dark/
