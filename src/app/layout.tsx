import type { Metadata } from "next";
import { Poppins, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME = "CVMatch";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.title,
      template: `%s — ${SITE_NAME}`,
    },
    description: dict.meta.description,
    keywords: [
      "CV",
      "curriculum vitae",
      "resume",
      "ATS",
      "compatibilité ATS",
      "recherche d'emploi",
      "job search",
      "candidature",
      "optimisation CV",
      "IA",
      "offre d'emploi",
    ],
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    // No blanket canonical here — it would leak to every page that doesn't
    // set its own (dashboard pages included), making them all incorrectly
    // claim the homepage as their canonical URL. Each indexable page sets
    // its own below (see src/app/page.tsx, /pricing, /login, /register).
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: dict.meta.title,
      description: dict.meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    formatDetection: {
      telephone: false,
    },
  };
}

const GA_ID = process.env.GA_ID;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale } = await getDictionary();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
          <CookieConsentBanner gaId={GA_ID} />
        </ThemeProvider>
      </body>
    </html>
  );
}
