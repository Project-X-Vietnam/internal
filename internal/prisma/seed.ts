import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const teams = [
  { name: "Alpha", joinCode: "ALPHA-2026" },
  { name: "Beta", joinCode: "BETA-2026" },
  { name: "Gamma", joinCode: "GAMMA-2026" },
  { name: "Delta", joinCode: "DELTA-2026" },
  { name: "Epsilon", joinCode: "EPSILON-2026" },
];

async function main() {
  for (const team of teams) {
    await prisma.team.upsert({
      where: { name: team.name },
      update: {},
      create: team,
    });
  }
  console.log(`Seeded ${teams.length} teams`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
