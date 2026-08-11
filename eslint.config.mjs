import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Flat config doesn't read .gitignore, so build output has to be listed
    // here or it drowns out real findings. .claude/worktrees/ matters because
    // git worktrees live inside the repo — each one carries its own .next/out.
    ignores: [
      "_legacy/**",
      "public/themes/**",
      "**/.next/**",
      "**/out/**",
      ".claude/worktrees/**",
    ],
  },
  {
    // Standalone Node build scripts (run directly, e.g. `npm run resume:docx`).
    // They are CommonJS by design, so require() is correct here, not a defect.
    files: ["scripts/**/*.js"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
]);

export default eslintConfig;
