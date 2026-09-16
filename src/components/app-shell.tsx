import type { ReactNode } from "react";
import { Poppins, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import type { Locale } from "@/lib/i18n/config";
import "@/app/globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const GA_ID = process.env.GA_ID;

/**
 * The `<html>`/`<body>` shell shared by the two independent root layouts
 * (public `[locale]` tree and `/dashboard` tree — see Next.js's "multiple
 * root layouts" pattern, needed here because each tree sets a different
 * `<html lang>` source: the URL for the public site, a cookie for the
 * authenticated app). Consent must gate Google Analytics regardless of
 * which tree a visitor lands on first, so the cookie banner lives here
 * rather than in only one of the two layouts.
 */
export function AppShell({ lang, children }: { lang: Locale; children: ReactNode }) {
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
          <CookieConsentBanner gaId={GA_ID} locale={lang} />
        </ThemeProvider>
      </body>
    </html>
  );
}
