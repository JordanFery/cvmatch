-- CreateEnum
CREATE TYPE "TailoredCvStatus" AS ENUM ('PROCESSING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "tailored_cvs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "cv_id" UUID NOT NULL,
    "job_offer_id" UUID NOT NULL,
    "status" "TailoredCvStatus" NOT NULL DEFAULT 'PROCESSING',
    "error_message" TEXT,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tailored_cvs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tailored_cvs_cv_id_job_offer_id_key" ON "tailored_cvs"("cv_id", "job_offer_id");
CREATE INDEX "tailored_cvs_user_id_idx" ON "tailored_cvs"("user_id");

-- AddForeignKey
ALTER TABLE "tailored_cvs" ADD CONSTRAINT "tailored_cvs_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tailored_cvs" ADD CONSTRAINT "tailored_cvs_cv_id_fkey"
    FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tailored_cvs" ADD CONSTRAINT "tailored_cvs_job_offer_id_fkey"
    FOREIGN KEY ("job_offer_id") REFERENCES "job_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row Level Security
ALTER TABLE "tailored_cvs" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tailored cvs" ON "tailored_cvs" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tailored cvs" ON "tailored_cvs" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tailored cvs" ON "tailored_cvs" FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tailored cvs" ON "tailored_cvs" FOR DELETE USING (auth.uid() = user_id);
