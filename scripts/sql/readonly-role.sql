-- Read-only database role for developers who need to *look at* the hosted
-- database without being able to change it.
--
-- Run ONCE on the hosted Postgres as the owner (Supabase SQL editor, or
-- `psql "$DIRECT_URL" -f scripts/sql/readonly-role.sql`). Replace the
-- password first. Then hand developers a connection string like:
--
--   postgresql://pjx_readonly.<project-ref>:<password>@<host>:5432/postgres
--
-- (Supabase's pooler expects `<role>.<project-ref>` as the username; on a
-- plain Postgres it is just `pjx_readonly`.) This string goes in a password
-- manager, never in the repo and never in a developer's `.env` — the app
-- must not run on a read-only role.
--
-- Every session on this role is forced read-only and capped at 30s per
-- statement, so an accidental `UPDATE` or a runaway query is rejected by the
-- server, not by convention.
--
-- Remember the data is still personal data (members, network contacts). Give
-- this to PJX team developers only, and rotate the password when someone leaves.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'pjx_readonly') THEN
    CREATE ROLE pjx_readonly LOGIN PASSWORD 'CHANGE-ME-before-running';
  END IF;
END
$$;

GRANT CONNECT ON DATABASE postgres TO pjx_readonly;
GRANT USAGE ON SCHEMA public TO pjx_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO pjx_readonly;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO pjx_readonly;

-- Tables created by future migrations get SELECT automatically.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO pjx_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO pjx_readonly;

-- Server-enforced safety nets.
ALTER ROLE pjx_readonly SET default_transaction_read_only = on;
ALTER ROLE pjx_readonly SET statement_timeout = '30s';
ALTER ROLE pjx_readonly SET idle_in_transaction_session_timeout = '60s';

-- To revoke later:
--   REASSIGN OWNED BY pjx_readonly TO postgres;
--   DROP OWNED BY pjx_readonly;
--   DROP ROLE pjx_readonly;
