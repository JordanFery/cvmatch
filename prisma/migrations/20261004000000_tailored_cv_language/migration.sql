-- CreateEnum
CREATE TYPE "TailoredCvLanguage" AS ENUM ('FR', 'EN');

-- AlterTable: existing tailored CVs were all generated in French (the only
-- language the generator supported until now) — default/backfill to FR.
ALTER TABLE "tailored_cvs" ADD COLUMN "language" "TailoredCvLanguage" NOT NULL DEFAULT 'FR';
