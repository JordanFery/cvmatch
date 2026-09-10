-- CreateEnum
CREATE TYPE "CvSource" AS ENUM ('UPLOADED', 'GENERATED');

-- AlterTable: cvs — allow file-less (GENERATED) CVs
ALTER TABLE "cvs"
    ADD COLUMN "source" "CvSource" NOT NULL DEFAULT 'UPLOADED',
    ALTER COLUMN "original_file_name" DROP NOT NULL,
    ALTER COLUMN "file_type" DROP NOT NULL,
    ALTER COLUMN "storage_path" DROP NOT NULL;

-- AlterTable: profiles — daily application goal
ALTER TABLE "profiles" ADD COLUMN "daily_application_goal" INTEGER;

-- AlterTable: subscriptions — lifetime credit usage counter
ALTER TABLE "subscriptions" ADD COLUMN "credits_used_lifetime" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "user_badges" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "badge_id" TEXT NOT NULL,
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_badges_user_id_badge_id_key" ON "user_badges"("user_id", "badge_id");

ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_badges" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges" ON "user_badges" FOR SELECT USING (auth.uid() = user_id);
