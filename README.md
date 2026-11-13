# PJX internal platform

The members-only platform for the Project X Vietnam team: team directory and
network memory, knowledge & resource hub, and past internal builds (artifacts).
Public-facing work lives in the separate `landing-page` repo.

**This repo is public.** Never commit member data or secrets.

## Layout

The Next.js app sits one level down, in [`internal/`](internal/). The repo root
holds only docs, CI and editor/agent config — there is no root `package.json`.

```
.
├── AGENTS.md              ← start here (CLAUDE.md is an alias)
├── .github/workflows/     CI: typecheck, lint, smoke
└── internal/              the app — run every pnpm command from here
```

## Quickstart

```bash
cd internal
cp .env.example .env       # already points at the local DB; add Google OAuth values
pnpm install               # also runs `prisma generate`
pnpm db:up                 # local Postgres in Docker (127.0.0.1:54329)
pnpm db:reset              # migrate + seed it
pnpm dev                   # http://localhost:3010
```

Development never touches the hosted database: every script that writes to a
database refuses a non-local host unless you opt in with `ALLOW_REMOTE_DB=1`.
To look at production data, ask for the read-only role
(`internal/scripts/sql/readonly-role.sql`).

`pnpm typecheck`, `pnpm lint` and `pnpm smoke` are what CI runs. `pnpm build`
is what Vercel runs (migrate + seed + build); use `pnpm build:local` to build
without touching a database.

Everything else — purpose, guardrails, data model, routes — is in
[AGENTS.md](AGENTS.md).
