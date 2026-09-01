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

The Next.js app is **one level down**, at `internal/` inside the repo root:

```
internal/                    ← repo root, no package.json here
├── AGENTS.md                ← this file
├── PATCH_NOTES.md           Commit hygiene rules — read them
├── tailwind.config.js       ⚠ stray, orphaned (no root package.json to use it)
├── postcss.config.js        ⚠ stray, orphaned
├── components.json          ⚠ stray, orphaned
├── changes_non_deps.patch   Salvage artifact from a past bad commit
└── internal/                ← THE ACTUAL APP — work here
    ├── package.json
    ├── app/
    ├── components/
    ├── lib/
    ├── prisma/
    └── tailwind.config.ts   the real one
```

The root-level `tailwind.config.js`, `postcss.config.js` and `components.json` are leftovers from an earlier flat layout. No build reads them. Don't edit them expecting an effect; the live config is `internal/tailwind.config.ts`.

## Commands

All commands run from `internal/internal/`:

```bash
pnpm dev          # prisma generate && next dev
pnpm build        # prisma generate && deploy-db && next build
pnpm typecheck    # tsc --noEmit — run this, the build does not
pnpm lint         # ⚠ BROKEN: `next lint` was removed in Next 16, and eslint
                  #   is not in devDependencies. Needs fixing before it runs.
pnpm db:deploy    # node scripts/deploy-db.mjs
pnpm db:seed      # node prisma/seed.mjs
pnpm smoke        # node scripts/smoke.mjs
```

Or from the repo root: `pnpm --dir internal dev` (this is what `.claude/launch.json` does).

`pnpm build` runs migrations against whatever `DATABASE_URL` points at. Be sure that's not production before you run it.

## Stack

| Technology | Version | Notes |
|---|---|---|
| Next.js | 16.x | App Router — newer than landing-page's 15.x |
| React | 19.x | |
| Prisma | 7.x | client generated to `lib/generated/prisma`, **gitignored** |
| PostgreSQL | — | via `pg` + `@prisma/adapter-pg` |
| Tailwind CSS | 3.4.x | |
| Framer Motion / `motion` | 12.x | |
| three.js | 0.182 | 3D/shader backgrounds |
| TypeScript | 5.x | |

`prisma generate` must run before anything compiles — the `dev`, `build`, and `postinstall` scripts all do it. A fresh clone that skips install will fail with missing `@/lib/generated/prisma`.

### Environment

```
DATABASE_URL     Postgres connection (pooled)
DIRECT_URL       Direct connection — lib/db.ts prefers this
FACILITATOR_PIN  Gate for the THEIA facilitator console
SESSION_SECRET   HMAC key for signing session cookies; falls back to FACILITATOR_PIN
```

`.env*` is gitignored. Copy `internal/.env.example` (tracked via a `!.env.example` negation) to `.env` and fill it in — never commit real values.

## Data model

`internal/prisma/schema.prisma` holds three unrelated groups — THEIA, platform identity, and the knowledge hub. **Never join THEIA to the others** — the platform's `Member` is a person, THEIA's `Team` is a game session that merely uses the word.

Platform: **`Member`** (identity, status, role, profile), **`Department`**, **`ExpertiseTag`** (implicit m-n "ask me about").

THEIA — four models:

- **`Team`** — name, `joinCode`, `currentMilestone`, `startedAt`/`finishedAt`
- **`Progress`** — per-team, per-milestone start/solve timestamps
- **`Submission`** — every answer attempt, with `correct` flag
- **`ClueToken`** — unlocked clue key/value pairs per team

Knowledge hub: **`Resource`** (a `DOC` whose markdown `body` lives here, or a `LINK` pointing at Lark/Drive/Figma), **`ResourceCollection`** (the shelves it sits on). `Resource.byline` is free text rather than a `Member` relation — attribution has to outlive the account, and seeded rows must not create people.

Migrations: `20260724201333_init`, `20260824120000_add_platform_members`, `20260825120000_add_resource_hub`.

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
| `/directory`, `/directory/[id]` | **Team directory** — search, filters, profiles |
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

`PATCH_NOTES.md` exists because **`node_modules/` was committed to `main`** — 1,444 files. They have since been untracked (`git rm -r --cached`), along with the 201-file `.agent/` starter kit, taking the repo from 1,784 tracked files to ~140. The blobs remain in git history; only a history rewrite would remove them. Its rules are repo policy:

- Run `git status` before every commit.
- **If thousands of files appear, stop** and fix `.gitignore` first.
- Never commit `node_modules/`, `.next/`, `dist/`, `build/`, `out/`, `.DS_Store`, or media over 50MB.

`changes_non_deps.patch` and `SALVAGE_NON_DEPS.md` are the recovery artifacts from that incident. Leave them; they're history, not active work.

Also note: `internal/dev.db` (a 61KB SQLite file) sits in the working tree and is gitignored. The app uses Postgres — that file is a leftover.

### Working state

The repo is usually mid-flight. At time of writing there are uncommitted changes across the mock API routes and `ANSWER_KEY.md` on `codex/simplify-m2-case-note-scope`. Check `git status` before assuming a clean tree, and don't stash or revert someone else's work.

## Design system

PJX has **one** design system across both products. This repo's copy is `internal/DESIGN_SYSTEM.md`; the canonical version is `PJX_UI_STYLE_GUIDE.md` in the landing-page repo. They are the same document (3-line diff) — if brand tokens change, update both or the products drift.

Brand colors: `#0E56FA` blue, `#17CAFA` cyan, `#01001F` deep navy.

The stacks stay separate — internal is on Next 16 with Prisma, landing-page is on Next 15 with no database, and neither shares components with the other. **Consistency is at the visual layer, not the code layer.** Don't try to unify the codebases.

Note that THEIA's visual language is deliberately off-brand — dark, cinematic, in-fiction. That's correct for an Artifact. New platform modules (directory, knowledge hub) should follow the PJX design system, not THEIA's look.

## Building a new platform module

When the first real module lands (team directory or knowledge hub), the expectations are:

1. **Build alongside THEIA, not inside it.** New route group, new Prisma models. Don't extend `Team`/`Progress` — those are game models that happen to use the word "team".
2. **Follow `PJX_UI_STYLE_GUIDE.md`**, not THEIA's aesthetic.
3. **Ask about identity before implementing it.** How team members sign in is an open decision, not a detail to improvise.
4. **Keep it lightweight.** The line between "knowledge hub" and "we accidentally built an ERP" is the point of this platform. Fewer, sharper surfaces beat feature coverage.
5. **Add a migration**, don't hand-edit the database.

## Other agent files in this repo

`CLAUDE.md` is an alias of this file. `.agent/` contains a generic third-party starter kit (20 personas, ~39 skills, 11 workflows) copied in wholesale — **it is not PJX policy** and nothing in it references this project. Where it conflicts with this file, this file wins.
