import "dotenv/config";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import pg from "pg";

/**
 * Network backfill importer.
 *
 * Usage:  node scripts/import-network.mjs <data.json> [--dry-run]
 *
 * THIS REPO IS PUBLIC. The data file holds real people and must NEVER be
 * committed — keep it under prisma/backfill/ (gitignored) or outside the repo.
 * This script is generic and holds no personal data.
 *
 * Data shape:
 * {
 *   "organizations": [{ "name", "website"?, "note"? }],
 *   "people": [{
 *     "name", "email"?, "title"?, "location"?, "bio"?, "note"?,
 *     "engagements": [{
 *       "role",                 // TEAM | FELLOW | SPEAKER | MENTOR | TRAINER | ADVISOR | PARTNER | OTHER
 *       "title"?, "organization"?, "department"?,
 *       "program"?,             // Program slug — engagement binds to that year's edition
 *       "year",                 // start year (and the edition year when program is set)
 *       "endYear"?, "ongoing"?, // default: single-year. ongoing wins over endYear.
 *       "note"?                 // admin-only
 *     }]
 *   }],
 *   "connections": [{ "a", "b", "label", "note"? }]   // a/b: email or exact person name
 * }
 *
 * Idempotent: people are matched by email, then by normalized name (guarded —
 * see matchByName); organizations by normalized name; engagements and
 * connections are skipped when an identical row exists. Every fuzzy decision is
 * printed in the report. Runs in one transaction; --dry-run rolls it back.
 */

const { Pool } = pg;

const [dataPath, ...flags] = process.argv.slice(2);
const dryRun = flags.includes("--dry-run");
if (!dataPath) {
  console.error("Usage: node scripts/import-network.mjs <data.json> [--dry-run]");
  process.exit(1);
}

const data = JSON.parse(readFileSync(dataPath, "utf8"));

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL or DIRECT_URL must be configured.");

const ROLES = new Set([
  "TEAM",
  "FELLOW",
  "SPEAKER",
  "MENTOR",
  "TRAINER",
  "ADVISOR",
  "PARTNER",
  "OTHER",
]);

/** Diacritic-stripped, lowercased, parentheticals removed. */
function normalize(value) {
  return (value ?? "")
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Word-order-insensitive name key: Vietnamese sheets flip given/family order freely. */
function nameKey(value) {
  return normalize(value).split(" ").sort().join(" ");
}

/** Organizations match with spacing removed too — "Geek Up" and "GeekUp" are one. */
function orgKey(value) {
  return normalize(value).replace(/\s/g, "");
}

const report = {
  created: { people: 0, organizations: 0, engagements: 0, connections: 0, editions: 0, departments: 0 },
  matched: { people: 0, organizations: 0 },
  skipped: { engagements: 0, connections: 0 },
  flags: [],
};
const flag = (message) => report.flags.push(message);

const pool = new Pool({ connectionString });
const db = await pool.connect();

try {
  await db.query("BEGIN");

  // --- Existing rows, loaded once; all matching happens in JS ---

  const members = (await db.query('SELECT "id", "name", "email", "kind" FROM "Member"')).rows;
  const membersByEmail = new Map(
    members.filter((m) => m.email).map((m) => [m.email.toLowerCase(), m]),
  );
  const membersByName = new Map();
  for (const m of members) {
    const key = nameKey(m.name);
    if (!membersByName.has(key)) membersByName.set(key, []);
    membersByName.get(key).push(m);
  }
  // Org names each member is already engaged with — evidence for name matches.
  const memberOrgKeys = new Map();
  for (const row of (
    await db.query(`
      SELECT e."memberId", o."name"
      FROM "Engagement" e JOIN "Organization" o ON o."id" = e."organizationId"
    `)
  ).rows) {
    if (!memberOrgKeys.has(row.memberId)) memberOrgKeys.set(row.memberId, new Set());
    memberOrgKeys.get(row.memberId).add(orgKey(row.name));
  }

  const orgsByKey = new Map();
  for (const row of (await db.query('SELECT "id", "name" FROM "Organization"')).rows) {
    orgsByKey.set(orgKey(row.name), row);
  }

  const programsBySlug = new Map();
  for (const row of (await db.query('SELECT "id", "slug" FROM "Program"')).rows) {
    programsBySlug.set(row.slug, row.id);
  }

  const departmentsByName = new Map();
  for (const row of (await db.query('SELECT "id", "name" FROM "Department"')).rows) {
    departmentsByName.set(normalize(row.name), row.id);
  }

  // --- Helpers ---

  async function ensureOrganization(entry) {
    const key = orgKey(entry.name);
    const existing = orgsByKey.get(key);
    if (existing) {
      report.matched.organizations += 1;
      if (normalize(existing.name) !== normalize(entry.name)) {
        flag(`Organization "${entry.name}" matched existing "${existing.name}".`);
      }
      return existing.id;
    }
    const id = `org_${randomUUID()}`;
    await db.query(
      'INSERT INTO "Organization" ("id", "name", "website", "note", "createdAt") VALUES ($1, $2, $3, $4, NOW())',
      [id, entry.name, entry.website ?? null, entry.note ?? null],
    );
    orgsByKey.set(key, { id, name: entry.name });
    report.created.organizations += 1;
    return id;
  }

  async function ensureDepartment(name) {
    const existing = departmentsByName.get(normalize(name));
    if (existing) return existing;
    const slug = normalize(name).replace(/\s+/g, "-");
    const id = `dept_${slug}`;
    await db.query(
      `INSERT INTO "Department" ("id", "name", "slug", "sortOrder", "createdAt")
       VALUES ($1, $2, $3, 100, NOW()) ON CONFLICT ("slug") DO NOTHING`,
      [id, name, slug],
    );
    departmentsByName.set(normalize(name), id);
    report.created.departments += 1;
    flag(`Created department "${name}" — check its sortOrder in the admin seed.`);
    return id;
  }

  const editions = new Map(); // "programId:year" -> id
  async function ensureEdition(programSlug, year) {
    const programId = programsBySlug.get(programSlug);
    if (!programId) throw new Error(`Unknown program slug "${programSlug}" — run the seed first.`);
    const key = `${programId}:${year}`;
    if (editions.has(key)) return editions.get(key);
    const found = await db.query(
      'SELECT "id" FROM "ProgramEdition" WHERE "programId" = $1 AND "year" = $2',
      [programId, year],
    );
    let id = found.rows[0]?.id;
    if (!id) {
      id = `ed_${randomUUID()}`;
      await db.query(
        'INSERT INTO "ProgramEdition" ("id", "programId", "year") VALUES ($1, $2, $3)',
        [id, programId, year],
      );
      report.created.editions += 1;
    }
    editions.set(key, id);
    return id;
  }

  /**
   * Name matches are guarded: a sorted-token name hit counts only when the name
   * has 3+ tokens (short Vietnamese names collide constantly) or the incoming
   * person shares an organization with the candidate's existing engagements.
   */
  function matchByName(entry) {
    const key = nameKey(entry.name);
    let candidates = membersByName.get(key) ?? [];
    if (candidates.length === 0) return null;

    const entryOrgs = new Set(
      (entry.engagements ?? []).filter((e) => e.organization).map((e) => orgKey(e.organization)),
    );
    const sharesOrg = (candidate) =>
      [...(memberOrgKeys.get(candidate.id) ?? [])].some((k) => entryOrgs.has(k));

    // Several rows share the name (e.g. two distinct "Ngoc Tran"s): an
    // organization in common is the only evidence that picks one — it is also
    // what makes a re-run find the row it created last time.
    if (candidates.length > 1) {
      candidates = candidates.filter(sharesOrg);
      if (candidates.length !== 1) {
        flag(`"${entry.name}": several existing rows share this name — left unmatched, review by hand.`);
        return null;
      }
    }

    const candidate = candidates[0];
    const tokens = key.split(" ").length;
    const shared = sharesOrg(candidate);
    if (tokens >= 3 || shared) {
      flag(
        `"${entry.name}" matched existing "${candidate.name}" by name${shared ? " + shared organization" : ""} — verify this is the same person.`,
      );
      return candidate;
    }
    flag(`"${entry.name}": name matches "${candidate.name}" but the evidence is thin — imported as a separate person, review by hand.`);
    return null;
  }

  async function ensurePerson(entry) {
    const email = entry.email?.trim().toLowerCase() || null;
    let existing = (email && membersByEmail.get(email)) || matchByName(entry);

    if (existing) {
      report.matched.people += 1;
      // Fill gaps on contacts; never touch an account's identity — Google and
      // /me own it. Notes append rather than overwrite on both kinds.
      if (existing.kind === "CONTACT") {
        await db.query(
          `UPDATE "Member" SET
             "email"    = COALESCE("email", $2),
             "title"    = COALESCE("title", $3),
             "location" = COALESCE("location", $4),
             "bio"      = COALESCE("bio", $5),
             "note"     = CASE WHEN $6::text IS NULL THEN "note"
                               WHEN "note" IS NULL THEN $6
                               WHEN "note" LIKE '%' || $6 || '%' THEN "note"
                               ELSE "note" || E'\\n' || $6 END,
             "updatedAt" = NOW()
           WHERE "id" = $1`,
          [existing.id, email, entry.title ?? null, entry.location ?? null, entry.bio ?? null, entry.note ?? null],
        );
      }
      return existing.id;
    }

    const id = `net_${randomUUID()}`;
    await db.query(
      `INSERT INTO "Member"
         ("id", "email", "name", "kind", "status", "role", "title", "location", "bio", "note", "requestedAt", "updatedAt")
       VALUES ($1, $2, $3, 'CONTACT', 'PENDING', 'MEMBER', $4, $5, $6, $7, NOW(), NOW())`,
      [id, email, entry.name.trim(), entry.title ?? null, entry.location ?? null, entry.bio ?? null, entry.note ?? null],
    );
    const created = { id, name: entry.name.trim(), email, kind: "CONTACT" };
    if (email) membersByEmail.set(email, created);
    const key = nameKey(entry.name);
    if (!membersByName.has(key)) membersByName.set(key, []);
    membersByName.get(key).push(created);
    report.created.people += 1;
    return id;
  }

  async function addEngagement(memberId, entry, personName) {
    if (!ROLES.has(entry.role)) throw new Error(`Unknown role "${entry.role}" on ${personName}.`);
    const year = entry.year;
    if (!Number.isInteger(year) || year < 1990 || year > 2100) {
      throw new Error(`Bad year on ${personName}: ${entry.year}`);
    }
    if (entry.role === "PARTNER" && !entry.organization) {
      throw new Error(`PARTNER engagement without an organization on ${personName}.`);
    }

    const organizationId = entry.organization
      ? await ensureOrganization({ name: entry.organization })
      : null;
    const editionId = entry.program ? await ensureEdition(entry.program, year) : null;
    const departmentId = entry.department ? await ensureDepartment(entry.department) : null;
    // Program engagements are bounded by their edition; otherwise ongoing wins,
    // else a given endYear, else single-year.
    const endYear = entry.program ? year : entry.ongoing ? null : (entry.endYear ?? year);

    const dupe = await db.query(
      `SELECT "id" FROM "Engagement"
       WHERE "memberId" = $1 AND "role" = $2 AND "startYear" = $3
         AND COALESCE("editionId", '') = COALESCE($4, '')
         AND COALESCE("organizationId", '') = COALESCE($5, '')
         AND COALESCE("title", '') = COALESCE($6, '')`,
      [memberId, entry.role, year, editionId, organizationId, entry.title ?? null],
    );
    if (dupe.rows[0]) {
      report.skipped.engagements += 1;
      return;
    }

    // Track org evidence for later name matches within this same run.
    if (organizationId && entry.organization) {
      if (!memberOrgKeys.has(memberId)) memberOrgKeys.set(memberId, new Set());
      memberOrgKeys.get(memberId).add(orgKey(entry.organization));
    }

    await db.query(
      `INSERT INTO "Engagement"
         ("id", "memberId", "role", "title", "departmentId", "organizationId", "editionId",
          "startYear", "endYear", "note", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
      [
        `eng_${randomUUID()}`,
        memberId,
        entry.role,
        entry.title ?? null,
        departmentId,
        organizationId,
        editionId,
        year,
        endYear,
        entry.note ?? null,
      ],
    );
    report.created.engagements += 1;
  }

  function findPersonRef(ref) {
    const byEmail = membersByEmail.get(ref.trim().toLowerCase());
    if (byEmail) return byEmail;
    const candidates = membersByName.get(nameKey(ref)) ?? [];
    if (candidates.length === 1) return candidates[0];
    return null;
  }

  // --- Run ---

  for (const organization of data.organizations ?? []) {
    await ensureOrganization(organization);
  }

  for (const person of data.people ?? []) {
    const memberId = await ensurePerson(person);
    for (const engagement of person.engagements ?? []) {
      await addEngagement(memberId, engagement, person.name);
    }
  }

  for (const connection of data.connections ?? []) {
    const a = findPersonRef(connection.a);
    const b = findPersonRef(connection.b);
    if (!a || !b || a.id === b.id) {
      flag(`Connection "${connection.a}" ↔ "${connection.b}" skipped — could not resolve both people.`);
      report.skipped.connections += 1;
      continue;
    }
    const [aId, bId] = [a.id, b.id].sort();
    const inserted = await db.query(
      `INSERT INTO "Connection" ("id", "aId", "bId", "label", "note", "createdAt")
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT ("aId", "bId", "label") DO NOTHING RETURNING "id"`,
      [`conn_${randomUUID()}`, aId, bId, connection.label, connection.note ?? null],
    );
    if (inserted.rows[0]) report.created.connections += 1;
    else report.skipped.connections += 1;
  }

  // The schema migration seeded one snapshot engagement per member (id
  // 'eng_<memberId>', start year guessed from their cohort text) so timelines
  // weren't empty on day one. Real TEAM history supersedes that guess — keep
  // the snapshot only for members no import has covered yet.
  const superseded = await db.query(
    `DELETE FROM "Engagement" b
     WHERE b."id" = 'eng_' || b."memberId"
       AND EXISTS (
         SELECT 1 FROM "Engagement" i
         WHERE i."memberId" = b."memberId" AND i."role" = 'TEAM' AND i."id" <> b."id"
       )
     RETURNING b."memberId"`,
  );
  if (superseded.rows.length > 0) {
    flag(
      `Removed ${superseded.rows.length} migration-seeded snapshot engagement(s) superseded by imported TEAM history.`,
    );
  }

  await db.query(dryRun ? "ROLLBACK" : "COMMIT");

  console.log(dryRun ? "\n=== DRY RUN (rolled back) ===" : "\n=== Imported ===");
  console.log("Created:", report.created);
  console.log("Matched existing:", report.matched);
  console.log("Skipped duplicates:", report.skipped);
  if (report.flags.length > 0) {
    console.log(`\nReview (${report.flags.length}):`);
    for (const message of report.flags) console.log(` - ${message}`);
  }
} catch (error) {
  await db.query("ROLLBACK");
  throw error;
} finally {
  db.release();
  await pool.end();
}
