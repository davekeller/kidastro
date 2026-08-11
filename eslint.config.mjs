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
]);

export default eslintConfig;
