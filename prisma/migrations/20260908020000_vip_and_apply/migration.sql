-- AlterEnum: add the internal, non-purchasable VIP plan tier
ALTER TYPE "PlanId" ADD VALUE 'VIP';

-- CreateEnum
CREATE TYPE "AppliedCvType" AS ENUM ('MASTER', 'TAILORED');

-- AlterTable
ALTER TABLE "job_offers" ADD COLUMN "applied_cv_type" "AppliedCvType";
