import { execFileSync } from "node:child_process";
import { assertSafeDatabaseTarget, prismaBin } from "./lib/db-env.mjs";

// Runs on every `pnpm build`. Locally that means "migrate + seed whatever my
// .env points at", which is exactly the mistake the guard exists to catch.
assertSafeDatabaseTarget("deploy-db (migrate + seed)");

function runPrisma(args) {
  return execFileSync(prismaBin(), args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function print(output) {
  if (output) process.stdout.write(output);
}

try {
  print(runPrisma(["migrate", "deploy"]));
} catch (error) {
  const output = `${error.stdout ?? ""}${error.stderr ?? ""}`;
  print(output);

  if (!output.includes("P3005")) {
    throw error;
  }

  console.log(
    "Prisma migrate deploy found a non-empty unbaselined database. Falling back to prisma db push for deployment setup."
  );
  print(runPrisma(["db", "push"]));
}

await import("../prisma/seed.mjs");
