import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const teams = [
  { name: "Alpha", joinCode: "ALPHA-2026" },
  { name: "Beta", joinCode: "BETA-2026" },
  { name: "Gamma", joinCode: "GAMMA-2026" },
  { name: "Delta", joinCode: "DELTA-2026" },
  { name: "Epsilon", joinCode: "EPSILON-2026" },
];

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL must be configured before seeding.");
}

const pool = new Pool({ connectionString });

try {
  for (const team of teams) {
    await pool.query(
      `
        INSERT INTO "Team" ("id", "name", "joinCode", "currentMilestone", "createdAt")
        VALUES (
          concat('team_', lower($1)),
          $1,
          $2,
          0,
          NOW()
        )
        ON CONFLICT ("name") DO NOTHING
      `,
      [team.name, team.joinCode]
    );
  }

  console.log(`Seeded ${teams.length} teams`);
} finally {
  await pool.end();
}
