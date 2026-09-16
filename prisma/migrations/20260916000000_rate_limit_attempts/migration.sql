-- CreateTable
CREATE TABLE "rate_limit_attempts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "bucket" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rate_limit_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rate_limit_attempts_bucket_ip_address_created_at_idx" ON "rate_limit_attempts"("bucket", "ip_address", "created_at");

-- DropTable
DROP TABLE "registration_attempts";
