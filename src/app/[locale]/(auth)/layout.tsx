import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { isLocale, localeHref } from "@/lib/i18n/config";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-8 px-4 py-16">
      <Link href={localeHref(locale)} className="flex items-center gap-2 font-semibold tracking-tight">
        <FileText className="size-5" aria-hidden="true" />
        <span>CVMatch</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
