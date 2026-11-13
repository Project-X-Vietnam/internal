/**
 * Runs the Prisma CLI only after the production guard passes.
 *
 *   node scripts/prisma-guarded.mjs migrate reset --force
 *
 * The `db:*` scripts in package.json go through this so that `migrate dev`,
 * `migrate reset` and `studio` can never be pointed at the hosted database by
 * accident. Plain `pnpm exec prisma …` bypasses it — that is deliberate, for
 * the rare case where you need it, but prefer ALLOW_REMOTE_DB=1 with the
 * guarded scripts so the intent is visible in your shell history.
 */
import { spawnSync } from "node:child_process";
import { assertSafeDatabaseTarget, prismaBin } from "./lib/db-env.mjs";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/prisma-guarded.mjs <prisma args…>");
  process.exit(1);
}

assertSafeDatabaseTarget(`prisma ${args.join(" ")}`);

const result = spawnSync(prismaBin(), args, { stdio: "inherit", env: process.env });
process.exit(result.status ?? 1);
