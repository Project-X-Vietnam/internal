import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Same precedence as Next.js and scripts/lib/db-env.mjs: .env.local wins over .env.
config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // `prisma migrate reset` / `migrate dev` re-seed automatically.
    seed: "node prisma/seed.mjs",
  },
  datasource: {
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
