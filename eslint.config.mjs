import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // `const { key: _key, ...rest } = obj` is the idiom for omitting a key;
      // the sibling is unused by design.
      "@typescript-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Build output. `.next*` also covers the alternate dist dirs that
    // NEXT_DIST_DIR selects (see next.config.ts), e.g. `.next-network`.
    ".next*/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated Prisma client — not ours to lint.
    "lib/generated/**",
    // Agent config, skills and worktrees (other checkouts of this repo live
    // under .claude/worktrees) and stray package stores are not app code.
    ".claude/**",
    ".pnpm-store/**",
  ]),
]);

export default eslintConfig;
