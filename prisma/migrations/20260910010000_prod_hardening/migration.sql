-- AlterTable: per-user AI-action cooldown timestamp
ALTER TABLE "subscriptions" ADD COLUMN "last_ai_action_at" TIMESTAMP(3);

-- CreateTable: signup rate-limiting (no user_id — never linked to a profile)
CREATE TABLE "registration_attempts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ip_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registration_attempts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "registration_attempts_ip_address_created_at_idx" ON "registration_attempts"("ip_address", "created_at");

-- Row Level Security: server-only table — RLS enabled with no policies at
-- all, so it is unreachable from anon/authenticated Supabase roles
-- (browser clients) even though nothing in the app currently queries it
-- that way. Only the server-side Prisma connection (direct Postgres
-- credentials, not subject to RLS) reads/writes this table.
ALTER TABLE "registration_attempts" ENABLE ROW LEVEL SECURITY;
