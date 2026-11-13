# internal — the app

The Next.js 16 / Prisma 7 app behind the PJX internal platform. All commands run
from this directory.

```bash
cp .env.example .env   # points at the local DB; add OAuth values. Never commit it — the repo is public
pnpm install           # runs `prisma generate` via postinstall
pnpm db:up             # local Postgres 17 in Docker on 127.0.0.1:54329
pnpm db:reset          # migrate + seed
pnpm dev               # http://localhost:3010
```

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

Writing scripts refuse a remote database host unless `ALLOW_REMOTE_DB=1` is set
(Vercel and CI are exempt). Production is inspected through the read-only role in
`scripts/sql/readonly-role.sql`, never through a developer `.env`.

Architecture, routes, data model and the THEIA spoiler-file rules are in
[../AGENTS.md](../AGENTS.md). `BRIEF.md` and `DESIGN_SYSTEM.md` here are safe to read.
