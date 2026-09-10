-- CreateEnum
CREATE TYPE "CoverLetterStatus" AS ENUM ('PROCESSING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "cover_letters" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "cv_id" UUID NOT NULL,
    "job_offer_id" UUID NOT NULL,
    "status" "CoverLetterStatus" NOT NULL DEFAULT 'PROCESSING',
    "error_message" TEXT,
    "content" TEXT,
    "company_insights" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cover_letters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cover_letters_cv_id_job_offer_id_key" ON "cover_letters"("cv_id", "job_offer_id");
CREATE INDEX "cover_letters_user_id_idx" ON "cover_letters"("user_id");

-- AddForeignKey
ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_cv_id_fkey"
    FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "cover_letters" ADD CONSTRAINT "cover_letters_job_offer_id_fkey"
    FOREIGN KEY ("job_offer_id") REFERENCES "job_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row Level Security
ALTER TABLE "cover_letters" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cover letters" ON "cover_letters" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cover letters" ON "cover_letters" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cover letters" ON "cover_letters" FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cover letters" ON "cover_letters" FOR DELETE USING (auth.uid() = user_id);
