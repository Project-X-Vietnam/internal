# AGENTS.md — internal

## What this platform is for

The **internal platform for the Project X Vietnam (PJX) team** — roughly 30 volunteers, remote-first. Members only. Nobody outside the organization should ever see a page from this repo.

It exists to hold three things:

| Area | What belongs here |
|---|---|
| **Team repo & directory / network** | Who's on the team, departments, roles, cohorts, ownership — who to ask about what. Plus **network memory**: everyone who has ever touched PJX (fellows, speakers, mentors, trainers, advisors, partner representatives), their engagements per year and program, and explicit admin-curated connections |
| **Knowledge & resource hub** | Brand assets, templates, program playbooks, style guides, onboarding docs — the material currently scattered across markdown files and Lark |
| **Artifacts** | One-off internal builds: bonding games, experiments, retired tools. Kept alive and browsable, clearly separated from live team resources |

**What it is deliberately not:** an ERP, an HRIS, or a full operations suite. No payroll, no approval chains, no ticketing system, no finance. Network *memory* is in scope (who touched PJX, in what role, when, how it went); CRM *workflows* are not — no pipelines, no outreach sequences, no email sync, no reminders. If a proposed feature starts to look like any of those, stop and ask before building it.

Anything **public-facing** — programs, applications, mentors, partners, recruitment of new volunteers — belongs in the separate `Project-X-Vietnam/landing-page` repo instead.

## Current state — read before you plan anything

**The platform grew out of THEIA**, an AI treasure-hunt game built as a temporary bonding session for Fellows. For a long time it was the whole repo — every Prisma model and every component was its — and most history and active branches are still THEIA work.

THEIA is **an Artifact, not the platform.** It has served its purpose as an event. The intended shape is for it to live under an Artifacts section alongside other past internal builds, with the team directory and knowledge hub as the platform's primary surfaces.

**That move has now happened.** THEIA's game shell lives under `/artifacts/theia`, the app root serves a platform home, and `/artifacts` is the Artifacts index. THEIA still works; old links 307-redirect to the new paths (see `internal/next.config.ts`). So:

- The **team directory** is built (`/directory`), behind Google sign-in with an admin approval queue. The **knowledge hub** is built (`/resources`), authored by admins at `/admin/resources`.
- When building new platform features, do **not** extend THEIA's routes, models, or navigation to host them. Build the new module alongside, under its own route group.
- Do not delete or break THEIA while doing so. It's kept, not discarded.

### The repo is public

`Project-X-Vietnam/internal` is a **public** GitHub repo, by decision. That is a hard constraint on the platform modules:

- **Never commit member data.** Names, roles, contact details, cohorts and photos live in Postgres only — no seed files, no fixtures, no JSON constants, no `public/assets/` uploads.
- Seed scripts may create *structure* (departments, roles) but never *people*.
- Assume anything committed here is world-readable, permanently.

## Repo layout — the nesting quirk

The Next.js app is **one level down**, at `internal/` inside the repo root. The root holds only docs, CI and editor/agent config — there is no root `package.json`, and nothing at the root is read by any build.

```
internal/                      ← repo root
├── AGENTS.md                  ← this file (CLAUDE.md is an alias)
├── README.md                  Quickstart
├── .github/workflows/ci.yml   typecheck · lint · smoke on push / PR
├── .claude/launch.json        Dev-server presets for the Claude desktop app
├── .nvmrc                     Node 22
└── internal/                  ← THE ACTUAL APP — every pnpm command runs here
    ├── package.json           pins pnpm via "packageManager"
    ├── app/  components/  lib/  prisma/  scripts/  public/  types/
    ├── docker-compose.yml     local Postgres for development (pnpm db:up)
    ├── next.config.ts  tailwind.config.ts  eslint.config.mjs  tsconfig.json
    ├── BRIEF.md  DESIGN_SYSTEM.md
    └── ANSWER_KEY.md  MILESTONES.md  STORY_PLOT.md  PJX_AI_…_Plot.md   ← spoilers, see Guardrails
```

The earlier flat-layout leftovers (root `tailwind.config.js`, `postcss.config.js`, `components.json`, npm and pnpm lockfiles) and the salvage artifacts from the `node_modules` incident (`changes_non_deps.patch`, `SALVAGE_NON_DEPS.md`, `PATCH_NOTES.md`) were removed in the 2026-11 repo cleanup. They are still in git history if ever needed.

Keep it that way: **no new top-level files** unless they are repo-wide (docs, CI, agent config). App code and config belong in `internal/`.

## Commands

All commands run from `internal/internal/`:

```bash
pnpm dev          # prisma generate && next dev -p 3010
pnpm build        # prisma generate && deploy-db && next build  ← what Vercel runs
pnpm build:local  # prisma generate && next build — no database side effects
pnpm typecheck    # tsc --noEmit — run this, the build does not
pnpm lint         # eslint . (flat config, Next core-web-vitals + TS rules)
pnpm smoke        # node scripts/smoke.mjs — THEIA M1 seed spoiler/schema check
pnpm db:up / db:reset / db:migrate / db:studio / db:down / db:nuke   # local Docker Postgres — see "Databases"
pnpm db:deploy    # node scripts/deploy-db.mjs — migrate deploy, then seed (guarded)
pnpm db:seed      # node prisma/seed.mjs (guarded)
```

Or from the repo root: `pnpm --dir internal dev` (this is what `.claude/launch.json` does).

`pnpm build` runs migrations **and the seed** against whatever `DATABASE_URL` points at. Locally the production guard (see "Databases") stops it from reaching a remote host; use `pnpm build:local` to check that the app compiles.

### CI

`.github/workflows/ci.yml` runs `pnpm install --frozen-lockfile` → `typecheck` → `lint` → `smoke` on every push to `main`/`dev` and every PR. No database is involved (`prisma generate` needs none). All three steps are blocking: a lint error fails the PR, so keep `pnpm lint` at zero errors. Warnings don't fail it — the few that remain are `<img>` tags on arbitrary image URLs, which `next/image` would need `remotePatterns` for.

Toolchain is pinned in `internal/package.json`: `"packageManager": "pnpm@10.x"` (read by Vercel, CI and corepack) and `"engines": { "node": ">=22" }`. `.nvmrc` at the root says the same.

## Stack

| Technology | Version | Notes |
|---|---|---|
| Next.js | 16.x | App Router — newer than landing-page's 15.x |
| React | 19.x | |
| Prisma | 7.x | client generated to `lib/generated/prisma`, **gitignored** |
| PostgreSQL | — | via `pg` + `@prisma/adapter-pg` |
| Tailwind CSS | 3.4.x | |
| Framer Motion | 12.x | Import from `framer-motion`, not `motion` — the `motion` alias package was dropped to avoid shipping two copies |
| TypeScript | 5.x | |

`prisma generate` must run before anything compiles — the `dev`, `build`, and `postinstall` scripts all do it. A fresh clone that skips install will fail with missing `@/lib/generated/prisma`. The generated client imports `@prisma/client/runtime` at runtime, so `@prisma/client` is a regular dependency, not a dev one.

### Environment

```
DATABASE_URL            Postgres connection (pooled)
DIRECT_URL              Direct connection — lib/db.ts and migrations prefer this
AUTH_SECRET             Auth.js signing key (platform identity)
GOOGLE_CLIENT_ID        Google OAuth client for sign-in
GOOGLE_CLIENT_SECRET
BOOTSTRAP_ADMIN_EMAILS  Comma-separated; auto-approved as ADMIN on first sign-in
FACILITATOR_PIN         Gate for the THEIA facilitator console
SESSION_SECRET          HMAC key for THEIA's facilitator cookie; falls back to FACILITATOR_PIN
```

`.env*` is gitignored. Copy `internal/.env.example` (tracked via a `!.env.example` negation) to `.env` and fill it in — never commit real values. `.env.local` overrides `.env` everywhere (Next.js, Prisma CLI and the scripts all load them in that order), so keep one file unless you know why you need two.

### Databases — local by default, production by exception

There are three ways to reach a database, and the default for every developer is the first:

| | What | How |
|---|---|---|
| **Local** (default) | Your own Postgres 17 in Docker, from `internal/docker-compose.yml`, on `127.0.0.1:54329` | `pnpm db:up` → `pnpm db:reset` (migrate + seed). `.env.example` already points here. Break it freely; `pnpm db:nuke` deletes it. |
| **Read-only production** | The role `pjx_readonly` on the hosted DB — `SELECT` only, server-enforced read-only transactions, 30s statement cap | Owner runs `scripts/sql/readonly-role.sql` once; the connection string lives in the team password manager, **never** in a `.env`. Use it with `psql` or a GUI to look at real data. |
| **Read-write production** | The owner connection string | Vercel only (`pnpm build` runs migrations + seed there). Locally, every writing script refuses a non-local host unless `ALLOW_REMOTE_DB=1` is set. |

**The guard.** `scripts/lib/db-env.mjs` is imported by `deploy-db.mjs`, `prisma/seed.mjs`, `import-network.mjs` and the `db:*` scripts (via `scripts/prisma-guarded.mjs`). It exits 1 with an explanation if the database host is not local, unless `VERCEL`/`CI` is set (deployments) or `ALLOW_REMOTE_DB=1` (you, on purpose, visibly in your shell history). Plain `pnpm exec prisma …` bypasses it — don't do that against production; use the opt-in so intent is explicit. New scripts that open a connection must import the guard.

**Preview deployments.** Vercel Preview builds also run `pnpm build`, which migrates and seeds whatever `DATABASE_URL` the Preview environment holds. Scope the production connection string to the Production environment only; give Preview a separate (staging) Supabase project or leave it unset so preview builds fail loudly rather than migrating prod from a feature branch.

```
pnpm db:up        # start local Postgres (Docker)
pnpm db:reset     # drop, migrate, seed — known-good state
pnpm db:migrate   # prisma migrate dev (new migration from schema changes)
pnpm db:studio    # Prisma Studio against the local DB
pnpm db:down      # stop; data kept     pnpm db:nuke  # stop; data deleted
```

## Data model

`internal/prisma/schema.prisma` holds three unrelated groups — THEIA, platform identity, and the knowledge hub. **Never join THEIA to the others** — the platform's `Member` is a person, THEIA's `Team` is a game session that merely uses the word.

Platform: **`Member`** (identity, status, role, profile), **`Department`**, **`ExpertiseTag`** (implicit m-n "ask me about").

THEIA — four models:

- **`Team`** — name, `joinCode`, `currentMilestone`, `startedAt`/`finishedAt`
- **`Progress`** — per-team, per-milestone start/solve timestamps
- **`Submission`** — every answer attempt, with `correct` flag
- **`ClueToken`** — unlocked clue key/value pairs per team

Knowledge hub: **`Resource`** (a `DOC` whose markdown `body` lives here, or a `LINK` pointing at Lark/Drive/Figma), **`ResourceCollection`** (the shelves it sits on). `Resource.byline` is free text rather than a `Member` relation — attribution has to outlive the account, and seeded rows must not create people.

Network memory: **`Person`**, **`Organization`**, **`Program`**/editions, **`Engagement`** (a person's role in a given year/program) and admin-curated **`Connection`** rows — see `lib/network.ts` and `scripts/import-network.mjs` for the shape. `Member` (a signed-in account) and `Person` (someone in the network) are distinct on purpose.

Migrations live in `prisma/migrations/` — `ls` it rather than trusting a list here; the newest at time of writing is `20260901090000_add_network_management`.

`prisma/seed.mjs` seeds THEIA teams, platform **departments**, hub **collections**, and one hub document — the President's welcome letter in `prisma/content/welcome-letter.md`, whose text was already committed here as the `/legacy/welcome` page. This repo is public — never seed real people (`Member` rows are created solely by the Google sign-in flow) and never seed internal-only material into `Resource`; write that in the admin UI, where it stays in Postgres.

Seed inserts are `ON CONFLICT DO NOTHING`, not upserts: `scripts/deploy-db.mjs` runs the seed on every deploy, and an upsert would overwrite whatever an admin has since edited.

**Two independent session systems — don't mix them up.**

*Platform identity* is Auth.js v5 (`next-auth@beta`) with Google sign-in, in `lib/auth.ts`. Sign-in is open to any Google account (volunteers use personal Gmail); membership is decided by the **admin approval queue** at `/admin/members`, not by email domain. `BOOTSTRAP_ADMIN_EMAILS` auto-approves the first admin, without which nobody can approve anyone.

Note it uses the **JWT session strategy and no Prisma adapter** — `@auth/prisma-adapter` declares support only through `@prisma/client >=6`, and this repo is on Prisma 7. The `Member` row is written by hand in the `signIn` callback instead.

Authorization is split in two, and both halves matter:

| Layer | Answers | Where |
|---|---|---|
| `middleware.ts` (Edge) | Is there a valid session? | JWT only — **no database**, because `lib/db.ts` needs `pg` |
| Server components / actions | Approved? Admin? | `lib/auth-guards.ts`, one query per request |

Keeping approval out of the token is deliberate: an admin's decision takes effect on the member's next request, with no sign-out.

*THEIA's own sessions* are unrelated — `lib/session.ts` sets `theia-team` (24h) and `theia-facilitator` (12h). The facilitator cookie is an HMAC-signed `<expiry>.<nonce>.<sig>` token and can't be forged by hand. `theia-team` is still a bare team id — unguessable, but unsigned.

## Current routes

Everything requires an approved member session except `/signin`, `/pending`, `/api/auth/*` and static assets. To reopen THEIA to non-members (e.g. to run the game at an onboarding event), add it to `PUBLIC_PREFIXES` in `middleware.ts`.

| Route | Purpose |
|---|---|
| `/` | **Platform home** |
| `/signin`, `/pending` | Google sign-in; awaiting-approval screen |
| `/directory`, `/directory/[id]` | **Team directory** — search, filters, profiles. `?scope=network` is the network memory scope; `&view=graph` draws it as a map (layout in `lib/network-graph.ts`, server-side) |
| `/resources`, `/resources/[slug]` | **Knowledge hub** — published docs and links, grouped by collection |
| `/me` | Edit your own profile |
| `/admin/members` | Approval queue + roles (admins only) |
| `/admin/resources`, `/admin/resources/{new,[id]}` | Hub authoring — drafts, publishing, collections (admins only) |
| `/artifacts` | **Artifacts index** |
| `/artifacts/theia` | Entry — team join by code |
| `/artifacts/theia/prologue` | Narrative opening |
| `/artifacts/theia/hub` | Team hub — milestone progress |
| `/artifacts/theia/milestone/[id]` | Milestone puzzle surface (M1–M5) |
| `/artifacts/theia/finale` | Endgame reveal |
| `/artifacts/theia/facilitator` | Facilitator console, PIN-gated |
| `/archive/kai-profile`, `/theia/41`, `/legacy/*` | In-fiction props |
| `/api/mock/{airline,archive,banking,mail,maps,ride,telecom}` | Fake third-party APIs teams query as part of puzzles |
| `/api/m3/reveal`, `/api/m5/verify-password` | Milestone-specific server checks |

The in-fiction prop routes (`/theia/41`, `/archive/*`, `/legacy/*`) and `/api/mock/*` deliberately **stay at the top level** — their literal URLs are part of the puzzle content, so they were not moved under `/artifacts/theia`.

The `/api/mock/*` routes are **intentionally fake data**. They are not integrations, they don't call anything real, and they should not be mistaken for service clients.

Puzzle components live in `components/puzzles/m1..m5-puzzle.tsx`; game shell in `components/game/`; visual effects in `components/ui/` (aurora, shader, warp, grid-pattern — mostly decorative, not a primitive library like landing-page's).

## Guardrails

### Spoiler files — do not surface these

Four committed files carry **the solution to THEIA** and each says so in its own header:

| File | Contains |
|---|---|
| `internal/ANSWER_KEY.md` | Milestone answers, clue tokens, final reveal |
| `internal/PJX_AI_Treasure_Hunt_THEIA_Plot.md` | Full plot and designer-only solution |
| `internal/MILESTONES.md` | Per-milestone solutions and clue chains |
| `internal/STORY_PLOT.md` | Narrative reveals |

`BRIEF.md` explicitly instructs that the plot file be kept out of the client bundle and away from AI assistants reading the repo freely.

They are committed, so nothing mechanically stops you from opening them. The rules are:

- Never read them to "understand the game" — `BRIEF.md` explains the structure without spoilers.
- Never quote, summarize, or paraphrase their contents in output, commits, or comments.
- Never import them into anything that reaches the client bundle.
- If a task genuinely requires them (e.g. fixing a wrong answer key), say so and confirm first.

`BRIEF.md` is the safe one — it covers architecture, hosting and cost model without giving away answers. Start there.

### Commit hygiene

**`node_modules/` was once committed to `main`** — 1,444 files. They have since been untracked, along with the `.agent/` starter kit; the blobs remain in git history and only a history rewrite would remove them. The rules that came out of it are repo policy:

- Run `git status` before every commit.
- **If thousands of files appear, stop** and fix `.gitignore` first.
- Never commit `node_modules/`, `.next*/`, `dist/`, `build/`, `out/`, `.DS_Store`, lockfiles other than `internal/pnpm-lock.yaml`, or media over 50MB.
- If something goes wrong, salvage with `git diff --name-only` + `git diff > fix.patch` onto a fresh branch — never try to push the bad tree.

pnpm is the only package manager. There is one lockfile, `internal/pnpm-lock.yaml`; a `package-lock.json` appearing anywhere means someone ran `npm install` — delete it, don't commit it.

Local leftovers you may see in a working tree that are gitignored and safe to delete: `internal/dev.db` (SQLite from before Postgres), `internal/.env.*.bak`, `.pnpm-store/` at either level (a stray store; the real one is `~/Library/pnpm/store`), and `internal/.claude/`.

### Working state

The repo is usually mid-flight, with several feature branches open. Check `git status` and the current branch before assuming a clean tree, and don't stash or revert someone else's work.

## Design system

PJX has **one** design system across both products. This repo's copy is `internal/DESIGN_SYSTEM.md`; the canonical version is `PJX_UI_STYLE_GUIDE.md` in the landing-page repo. They are the same document (3-line diff) — if brand tokens change, update both or the products drift.

Brand colors: `#0E56FA` blue, `#17CAFA` cyan, `#01001F` deep navy.

The stacks stay separate — internal is on Next 16 with Prisma, landing-page is on Next 15 with no database, and neither shares components with the other. **Consistency is at the visual layer, not the code layer.** Don't try to unify the codebases.

Note that THEIA's visual language is deliberately off-brand — dark, cinematic, in-fiction. That's correct for an Artifact. New platform modules (directory, knowledge hub) should follow the PJX design system, not THEIA's look.

## Building a new platform module

The directory, network memory and knowledge hub set the pattern. For the next module:

1. **Build alongside THEIA, not inside it.** New route group, new Prisma models. Don't extend `Team`/`Progress` — those are game models that happen to use the word "team".
2. **Follow `PJX_UI_STYLE_GUIDE.md`**, not THEIA's aesthetic. Shared platform chrome is in `components/platform/`; `components/ui/` is mostly THEIA/legacy decoration, not a primitive library.
3. **Reuse the identity layer.** Google sign-in + admin approval queue is decided; gate pages with `lib/auth-guards.ts`, never with a new session scheme.
4. **Keep it lightweight.** The line between "knowledge hub" and "we accidentally built an ERP" is the point of this platform. Fewer, sharper surfaces beat feature coverage.
5. **Add a migration**, don't hand-edit the database.

## Other agent files in this repo

`CLAUDE.md` is an alias of this file. A gitignored `.agent/` directory (a generic third-party starter kit — 20 personas, ~39 skills, 11 workflows) may exist in older working trees; it is not tracked, **it is not PJX policy**, and nothing in it references this project. Delete it freely. Where anything in it conflicts with this file, this file wins.
