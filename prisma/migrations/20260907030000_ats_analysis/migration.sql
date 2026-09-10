-- CreateEnum
CREATE TYPE "AtsAnalysisStatus" AS ENUM ('PROCESSING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "ats_analyses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "cv_id" UUID NOT NULL,
    "job_offer_id" UUID NOT NULL,
    "status" "AtsAnalysisStatus" NOT NULL DEFAULT 'PROCESSING',
    "error_message" TEXT,
    "score" INTEGER,
    "summary" TEXT,
    "matched_skills" JSONB NOT NULL,
    "missing_skills" JSONB NOT NULL,
    "strengths" JSONB NOT NULL,
    "gaps" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ats_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ats_analyses_cv_id_job_offer_id_key" ON "ats_analyses"("cv_id", "job_offer_id");
CREATE INDEX "ats_analyses_user_id_idx" ON "ats_analyses"("user_id");

-- AddForeignKey
ALTER TABLE "ats_analyses" ADD CONSTRAINT "ats_analyses_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ats_analyses" ADD CONSTRAINT "ats_analyses_cv_id_fkey"
    FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ats_analyses" ADD CONSTRAINT "ats_analyses_job_offer_id_fkey"
    FOREIGN KEY ("job_offer_id") REFERENCES "job_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row Level Security
ALTER TABLE "ats_analyses" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ats analyses" ON "ats_analyses" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ats analyses" ON "ats_analyses" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ats analyses" ON "ats_analyses" FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ats analyses" ON "ats_analyses" FOR DELETE USING (auth.uid() = user_id);
