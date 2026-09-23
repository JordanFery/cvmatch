-- Row Level Security hardening: Supabase's security linter flags any table
-- in a PostgREST-exposed schema (public) that doesn't have RLS enabled,
-- even when the app never queries it through that API — see
-- 20260910010000_prod_hardening for the established pattern (RLS enabled,
-- zero policies, so the table is unreachable by the anon/authenticated
-- roles PostgREST uses; the app's own Prisma connection uses direct
-- Postgres credentials and is not subject to RLS at all).

-- _prisma_migrations: Prisma's own migration-history bookkeeping table,
-- created automatically in the public schema the first time a migration
-- runs. It's never modeled in schema.prisma, so it never went through the
-- usual CreateTable + RLS step every other table gets — closing that gap
-- by hand. Flagged directly by the Supabase advisor.
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- rate_limit_attempts (20260916000000_rate_limit_attempts) replaced
-- registration_attempts, which had RLS enabled, but the replacement
-- migration never re-added it — same server-only, no-policies pattern.
ALTER TABLE "rate_limit_attempts" ENABLE ROW LEVEL SECURITY;
