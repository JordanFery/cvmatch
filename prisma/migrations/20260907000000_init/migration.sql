-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "phone" TEXT,
    "location" TEXT,
    "linkedin_url" TEXT,
    "portfolio_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- AddForeignKey: profiles.id mirrors Supabase auth.users.id 1:1.
ALTER TABLE "profiles"
    ADD CONSTRAINT "profiles_id_fkey"
    FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row Level Security: a user can only ever read/update their own profile row.
-- This is defense-in-depth for any future direct-from-browser Supabase
-- queries; the Next.js app itself always talks to Postgres through Prisma
-- with the server-side connection, which is not subject to RLS.
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON "profiles" FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON "profiles" FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Auto-create a profile row whenever a new Supabase auth user is created,
-- seeded from the signup metadata (first_name/last_name) collected by the
-- registration form. Keeps `profiles` in sync even if a user is created
-- through a flow the Next.js app doesn't control (e.g. Supabase dashboard,
-- social login added later).
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
        CURRENT_TIMESTAMP
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
