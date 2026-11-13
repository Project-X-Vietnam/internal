# PJX internal platform

The members-only platform for the Project X Vietnam team: team directory and
network memory, knowledge & resource hub, and past internal builds (artifacts).
Public-facing work lives in the separate `landing-page` repo.

**This repo is public.** Never commit member data or secrets.

## Quickstart

The Next.js 16 / Prisma 7 app lives at the repo root; every command runs here.

```bash
cp .env.example .env       # already points at the local DB; add Google OAuth values. Never commit it
pnpm install               # also runs `prisma generate`
pnpm db:up                 # local Postgres 17 in Docker (127.0.0.1:54329)
pnpm db:reset              # migrate + seed it
pnpm dev                   # http://localhost:3010
```

Development never touches the hosted database: every script that writes to a
database refuses a non-local host unless you opt in with `ALLOW_REMOTE_DB=1`
(Vercel and CI are exempt). To look at production data, ask for the read-only
role (`scripts/sql/readonly-role.sql`), never a developer `.env`.

| Command | What it does |
|---|---|
| `pnpm typecheck` | `tsc --noEmit` — the build does not typecheck for you |
| `pnpm lint` | ESLint (Next core-web-vitals + TypeScript rules) |
| `pnpm smoke` | Checks THEIA's M1 seed for spoiler leaks and schema drift |
| `pnpm build:local` | `next build` with no database side effects |
| `pnpm build` | What Vercel runs: generate → migrate + seed → build. Points at `DATABASE_URL`. |
| `pnpm db:up` / `db:down` / `db:nuke` | Start / stop / delete the local Docker Postgres |
| `pnpm db:reset` / `db:migrate` / `db:studio` | Reset, create a migration, browse — all guarded to local hosts |
| `pnpm db:deploy` / `pnpm db:seed` | Migrations + idempotent seed, on their own (guarded) |

`pnpm typecheck`, `pnpm lint` and `pnpm smoke` are what CI runs.

Everything else — purpose, guardrails, data model, routes — is in
[AGENTS.md](AGENTS.md). `BRIEF.md` and `DESIGN_SYSTEM.md` are safe to read.
