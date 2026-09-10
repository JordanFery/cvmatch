import type { Metadata } from "next";
import { getCurrentProfile } from "@/lib/data/profile";
import { getCurrentSubscription } from "@/lib/data/billing";
import { PLANS } from "@/lib/billing/plans";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileTopbar } from "@/components/dashboard/mobile-topbar";
import { UserMenu } from "@/components/dashboard/user-menu";
import { CreditsIndicator } from "@/components/dashboard/credits-indicator";

// Everything under /dashboard is private, per-user data — never indexable.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth: middleware already redirects unauthenticated visitors,
  // but every private page re-verifies the session server-side.
  const [profile, subscription, { dict, locale }] = await Promise.all([
    getCurrentProfile(),
    getCurrentSubscription(),
    getDictionary(),
  ]);
  const unlimitedCredits = PLANS[subscription.plan].unlimited;

  return (
    <div className="flex min-h-full bg-background print:block">
      <div className="print:hidden">
        <Sidebar
          firstName={profile.firstName}
          lastName={profile.lastName}
          email={profile.email}
          creditsRemaining={subscription.creditsRemaining}
          unlimitedCredits={unlimitedCredits}
          isAdmin={profile.isAdmin}
          dict={dict}
          locale={locale}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col print:block">
        <div className="print:hidden">
          <MobileTopbar
            creditsIndicator={
              <CreditsIndicator creditsRemaining={subscription.creditsRemaining} unlimited={unlimitedCredits} dict={dict} />
            }
            userMenu={
              <UserMenu firstName={profile.firstName} lastName={profile.lastName} email={profile.email} dict={dict} />
            }
            isAdmin={profile.isAdmin}
            dict={dict}
            locale={locale}
          />
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 print:p-0">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
