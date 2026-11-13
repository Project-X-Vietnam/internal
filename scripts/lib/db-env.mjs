/**
 * Shared env loading + production guard for every script that opens a
 * database connection (deploy-db, seed, import-network, prisma-guarded).
 *
 * Loads `.env.local` then `.env` — the same precedence Next.js uses — so the
 * CLI scripts and the dev server can never silently disagree about which
 * database they are pointed at.
 *
 * Then refuses to touch a database that is not on this machine unless the
 * caller is a deployment (Vercel / CI) or explicitly opts in with
 * `ALLOW_REMOTE_DB=1`. The hosted database holds real people; "I forgot my
 * .env still pointed at prod" must be a hard stop, not a surprise.
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

config({ path: [".env.local", ".env"], quiet: true });

export const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

/**
 * Path to the Prisma CLI. pnpm puts node_modules/.bin on PATH for package
 * scripts, but `node scripts/foo.mjs` run by hand does not have it — resolve
 * the local binary explicitly and fall back to PATH.
 */
export function prismaBin() {
  const local = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "node_modules", ".bin", "prisma");
  return existsSync(local) ? local : "prisma";
}

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]", "host.docker.internal", "db"]);

/** Hostname of the configured database, or null if the URL is missing/unparsable. */
export function databaseHost(url = connectionString) {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

export function isLocalDatabase(url = connectionString) {
  const host = databaseHost(url);
  return host !== null && LOCAL_HOSTS.has(host);
}

/**
 * Throws (with a readable message) unless it is safe to run `action` against
 * the configured database. Call this before opening a pool.
 */
export function assertSafeDatabaseTarget(action) {
  if (!connectionString) {
    throw new Error(
      `${action}: DATABASE_URL or DIRECT_URL is not set.\n` +
        `  Local development: run \`pnpm db:up\` and copy .env.example to .env.`
    );
  }

  const host = databaseHost();
  if (isLocalDatabase()) return;

  const deploying = Boolean(process.env.VERCEL || process.env.CI);
  const optedIn = process.env.ALLOW_REMOTE_DB === "1";

  if (deploying || optedIn) {
    console.warn(`${action}: targeting REMOTE database host ${host}`);
    return;
  }

  console.error(
    `\n${action}: refusing to run against remote database host "${host}".\n` +
      `  This looks like the hosted (production) database, which holds real people.\n` +
      `  For local work, point DATABASE_URL/DIRECT_URL at the Docker Postgres (pnpm db:up).\n` +
      `  If you really mean it, re-run with ALLOW_REMOTE_DB=1.\n`
  );
  process.exit(1);
}
