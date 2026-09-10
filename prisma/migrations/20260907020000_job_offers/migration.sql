-- CreateEnum
CREATE TYPE "JobOfferStatus" AS ENUM ('PROCESSING', 'READY', 'FAILED');
CREATE TYPE "JobOfferSourceType" AS ENUM ('TEXT', 'URL');

-- CreateTable
CREATE TABLE "job_offers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "status" "JobOfferStatus" NOT NULL DEFAULT 'PROCESSING',
    "source_type" "JobOfferSourceType" NOT NULL,
    "source_url" TEXT,
    "raw_description" TEXT NOT NULL,
    "error_message" TEXT,
    "title" TEXT NOT NULL,
    "company" TEXT,
    "location" TEXT,
    "employment_type" TEXT,
    "remote_policy" TEXT,
    "salary_range" TEXT,
    "seniority_level" TEXT,
    "summary" TEXT,
    "responsibilities" JSONB NOT NULL,
    "requirements" JSONB NOT NULL,
    "nice_to_have" JSONB NOT NULL,
    "key_skills" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_offers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_offers_user_id_idx" ON "job_offers"("user_id");

-- AddForeignKey
ALTER TABLE "job_offers" ADD CONSTRAINT "job_offers_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row Level Security: a user can only ever see/modify their own job offers.
ALTER TABLE "job_offers" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own job offers" ON "job_offers" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own job offers" ON "job_offers" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own job offers" ON "job_offers" FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own job offers" ON "job_offers" FOR DELETE USING (auth.uid() = user_id);
