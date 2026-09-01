import "dotenv/config";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;

const teams = [
  { name: "Alpha", joinCode: "ALPHA-2026" },
  { name: "Beta", joinCode: "BETA-2026" },
  { name: "Gamma", joinCode: "GAMMA-2026" },
  { name: "Delta", joinCode: "DELTA-2026" },
  { name: "Epsilon", joinCode: "EPSILON-2026" },
];

// Structure, not people. Adjust to match how PJX is actually organised.
const departments = [
  { name: "Programs", slug: "programs" },
  { name: "Operations", slug: "operations" },
  { name: "Partnerships", slug: "partnerships" },
  { name: "Marketing", slug: "marketing" },
  { name: "Technology", slug: "technology" },
  { name: "People", slug: "people" },
];

// The two annual programs engagements are scoped to. Structure, not people —
// their editions (program × year) are created on demand by the admin network
// UI, never seeded.
const programs = [
  { name: "SFP Recruitment", slug: "sfp-recruitment" },
  { name: "Summer Fellowship Program", slug: "summer-fellowship-program" },
];

// Knowledge-hub shelves. Structure, like departments — the material that goes on
// them is written in the admin UI at /admin/resources.
const collections = [
  {
    name: "Onboarding",
    slug: "onboarding",
    description: "Start here — what PJX is, how we work, and what your first weeks look like.",
  },
  {
    name: "Brand & assets",
    slug: "brand-assets",
    description: "Logos, colours, decks and anything else that carries the PJX name.",
  },
  {
    name: "Playbooks",
    slug: "playbooks",
    description: "How we actually run programs, events and recruitment.",
  },
  {
    name: "Templates",
    slug: "templates",
    description: "Documents worth copying rather than rewriting.",
  },
];

// The one seeded document. Its text is already committed in this public repo —
// it was the /legacy/welcome page — so moving it here exposes nothing new. Do
// not add internal-only material to this list; write it in the admin UI, where
// it stays in Postgres.
const documents = [
  {
    slug: "welcome-letter",
    title: "A letter from the President",
    summary:
      "Why the first touchpoint matters, what PJX is meant to be, and what we hope you do with your time here.",
    byline: "Liam Lee · President, Project X Vietnam",
    collection: "onboarding",
    file: "welcome-letter.md",
    sortOrder: 0,
  },
];

const contentDir = join(dirname(fileURLToPath(import.meta.url)), "content");

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

  // Platform structure only. THIS REPO IS PUBLIC — never seed real people here.
  // Members are created solely by the Google sign-in flow (lib/auth.ts).
  for (const [index, department] of departments.entries()) {
    await pool.query(
      `
        INSERT INTO "Department" ("id", "name", "slug", "sortOrder", "createdAt")
        VALUES (concat('dept_', $2::text), $1, $2, $3, NOW())
        ON CONFLICT ("slug") DO NOTHING
      `,
      [department.name, department.slug, index]
    );
  }

  console.log(`Seeded ${departments.length} departments`);

  for (const [index, program] of programs.entries()) {
    await pool.query(
      `
        INSERT INTO "Program" ("id", "name", "slug", "sortOrder")
        VALUES (concat('prog_', $2::text), $1, $2, $3)
        ON CONFLICT ("slug") DO NOTHING
      `,
      [program.name, program.slug, index]
    );
  }

  console.log(`Seeded ${programs.length} programs`);

  for (const [index, collection] of collections.entries()) {
    await pool.query(
      `
        INSERT INTO "ResourceCollection" ("id", "name", "slug", "description", "sortOrder", "createdAt")
        VALUES (concat('rescol_', $2::text), $1, $2, $3, $4, NOW())
        ON CONFLICT ("slug") DO NOTHING
      `,
      [collection.name, collection.slug, collection.description, index * 10]
    );
  }

  console.log(`Seeded ${collections.length} resource collections`);

  // DO NOTHING, not an upsert: this runs on every deploy, and an upsert would
  // overwrite whatever an admin has since edited in the hub.
  for (const document of documents) {
    await pool.query(
      `
        INSERT INTO "Resource" (
          "id", "slug", "title", "summary", "kind", "status", "body", "byline",
          "collectionId", "sortOrder", "createdAt", "updatedAt", "publishedAt"
        )
        VALUES (
          concat('res_', $1::text),
          $1,
          $2,
          $3,
          'DOC',
          'PUBLISHED',
          $4,
          $5,
          (SELECT "id" FROM "ResourceCollection" WHERE "slug" = $6),
          $7,
          NOW(),
          NOW(),
          NOW()
        )
        ON CONFLICT ("slug") DO NOTHING
      `,
      [
        document.slug,
        document.title,
        document.summary,
        readFileSync(join(contentDir, document.file), "utf8"),
        document.byline,
        document.collection,
        document.sortOrder,
      ]
    );
  }

  console.log(`Seeded ${documents.length} resource document(s)`);
} finally {
  await pool.end();
}
