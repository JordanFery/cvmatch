import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { ManageCookiesLink } from "@/components/manage-cookies-link";

export function LandingFooter({ dict }: { dict: Dictionary }) {
  const links = [
    { label: dict.footer.links.features, href: "#" },
    { label: dict.footer.links.pricing, href: "/pricing" },
    { label: dict.footer.links.about, href: "#" },
    { label: dict.footer.links.contact, href: "/contact" },
    { label: dict.footer.links.privacy, href: "/privacy" },
    { label: dict.footer.links.terms, href: "/terms" },
  ];

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 sm:flex-row sm:justify-between sm:px-6">
        <span className="font-semibold tracking-tight">CVMatch</span>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ))}
          <ManageCookiesLink label={dict.footer.manageCookies} />
        </nav>
      </div>
    </footer>
  );
}
