import Link from "next/link";
import { FileText } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-8 px-4 py-16">
      <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
        <FileText className="size-5" aria-hidden="true" />
        <span>CVMatch</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
