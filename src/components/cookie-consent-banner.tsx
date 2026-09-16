"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Button } from "@/components/ui/button";
import { ANALYTICS_CONSENT_KEY, type AnalyticsConsent } from "@/lib/cookie-consent";
import type { Locale } from "@/lib/i18n/config";

const COPY: Record<Locale, { accept: string; decline: string; privacyLink: string; before: string; after: string }> = {
  fr: {
    before: "Nous utilisons des cookies d'analyse (Google Analytics) pour comprendre l'utilisation du site. Vous pouvez accepter ou refuser — voir notre",
    privacyLink: "politique de confidentialité",
    after: ".",
    decline: "Refuser",
    accept: "Accepter",
  },
  en: {
    before: "We use analytics cookies (Google Analytics) to understand how the site is used. You can accept or decline — see our",
    privacyLink: "privacy policy",
    after: ".",
    decline: "Decline",
    accept: "Accept",
  },
};

function readStoredConsent(): AnalyticsConsent | null {
  try {
    const value = localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

/**
 * Gates Google Analytics behind an explicit accept/decline choice, shown on
 * first visit — GA never loads until the visitor accepts. Only known
 * client-side (localStorage), so the initial read has to happen in an
 * effect; the banner itself stays hidden until that read resolves,
 * avoiding a server/client mismatch flash rather than assuming "no
 * consent yet" during the first paint.
 */
export function CookieConsentBanner({ gaId, locale }: { gaId?: string; locale: Locale }) {
  const copy = COPY[locale];
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredConsent();
    const timer = setTimeout(() => {
      setConsent(stored);
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const choose = (value: AnalyticsConsent) => {
    try {
      localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
    } catch {
      // Private browsing or storage disabled — the choice still applies for this page load.
    }
    setConsent(value);
  };

  return (
    <>
      {gaId && consent === "granted" && <GoogleAnalytics gaId={gaId} />}
      {ready && consent === null && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-4 py-4 sm:flex-row sm:justify-between sm:px-6">
            <p className="text-sm text-muted-foreground">
              {copy.before}{" "}
              <Link href="/fr/privacy" className="font-medium text-foreground hover:underline">
                {copy.privacyLink}
              </Link>
              {copy.after}
            </p>
            <div className="flex shrink-0 gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => choose("denied")}>
                {copy.decline}
              </Button>
              <Button type="button" size="sm" onClick={() => choose("granted")}>
                {copy.accept}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
