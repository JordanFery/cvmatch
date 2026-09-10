-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('NOT_SENT', 'SENT', 'INTERVIEW', 'REJECTED');

-- AlterTable
ALTER TABLE "job_offers"
    ADD COLUMN "application_status" "ApplicationStatus" NOT NULL DEFAULT 'NOT_SENT',
    ADD COLUMN "applied_at" TIMESTAMP(3);
