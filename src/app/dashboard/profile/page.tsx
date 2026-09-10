import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/data/profile";
import { ProfileForm } from "@/components/profile/profile-form";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Profil" };

export default async function ProfilePage() {
  const profile = await getCurrentProfile();

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Profil" description="Gérez vos informations personnelles." />
      <ProfileForm
        email={profile.email}
        defaultValues={{
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone ?? "",
          location: profile.location ?? "",
          linkedinUrl: profile.linkedinUrl ?? "",
          portfolioUrl: profile.portfolioUrl ?? "",
          dailyApplicationGoal: profile.dailyApplicationGoal != null ? String(profile.dailyApplicationGoal) : "",
        }}
      />
    </div>
  );
}
