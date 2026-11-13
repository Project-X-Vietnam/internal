import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
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
  ]),
]);

export default eslintConfig;
