-- CreateEnum
CREATE TYPE "CvFileType" AS ENUM ('PDF', 'DOCX');
CREATE TYPE "CvStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "cvs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "is_master" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "original_file_name" TEXT NOT NULL,
    "file_type" "CvFileType" NOT NULL,
    "storage_path" TEXT NOT NULL,
    "status" "CvStatus" NOT NULL DEFAULT 'UPLOADED',
    "raw_text" TEXT,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cvs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "cv_data" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cv_id" UUID NOT NULL,
    "personal_info" JSONB NOT NULL,
    "summary" TEXT,
    "experiences" JSONB NOT NULL,
    "education" JSONB NOT NULL,
    "skills" JSONB NOT NULL,
    "certifications" JSONB NOT NULL,
    "projects" JSONB NOT NULL,
    "languages" JSONB NOT NULL,
    "custom_sections" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cvs_user_id_idx" ON "cvs"("user_id");
CREATE UNIQUE INDEX "cv_data_cv_id_key" ON "cv_data"("cv_id");

-- Only one master CV per user, enforced at the database level.
CREATE UNIQUE INDEX "cvs_one_master_per_user" ON "cvs"("user_id") WHERE "is_master" = true;

-- AddForeignKey
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "cv_data" ADD CONSTRAINT "cv_data_cv_id_fkey"
    FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row Level Security: a user can only ever see/modify their own CVs.
-- The app talks to Postgres through Prisma's own server-side connection
-- (not subject to RLS), so this is defense-in-depth for any future
-- direct-from-browser Supabase queries, matching the `profiles` table.
ALTER TABLE "cvs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cv_data" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cvs" ON "cvs" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cvs" ON "cvs" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cvs" ON "cvs" FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cvs" ON "cvs" FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own cv_data" ON "cv_data" FOR SELECT
    USING (EXISTS (SELECT 1 FROM "cvs" WHERE "cvs".id = "cv_data".cv_id AND "cvs".user_id = auth.uid()));
CREATE POLICY "Users can insert own cv_data" ON "cv_data" FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM "cvs" WHERE "cvs".id = "cv_data".cv_id AND "cvs".user_id = auth.uid()));
CREATE POLICY "Users can update own cv_data" ON "cv_data" FOR UPDATE
    USING (EXISTS (SELECT 1 FROM "cvs" WHERE "cvs".id = "cv_data".cv_id AND "cvs".user_id = auth.uid()));
CREATE POLICY "Users can delete own cv_data" ON "cv_data" FOR DELETE
    USING (EXISTS (SELECT 1 FROM "cvs" WHERE "cvs".id = "cv_data".cv_id AND "cvs".user_id = auth.uid()));

-- Private Storage bucket for CV files. Files live at `{userId}/{cvId}/original.{ext}`;
-- no public access, ever — only signed URLs generated on demand.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'cvs',
    'cvs',
    false,
    10485760, -- 10 MB
    ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own cv files"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'cvs' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view own cv files"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'cvs' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update own cv files"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'cvs' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own cv files"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'cvs' AND (storage.foldername(name))[1] = auth.uid()::text);
