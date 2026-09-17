import { Download } from "lucide-react";
import type { ComponentProps } from "react";
import type { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";

/**
 * A real download link (plain `<a>`, not next/link's `Link`) — this must be
 * a genuine browser navigation so the response's `Content-Disposition:
 * attachment` header is what triggers the download, rather than Next.js
 * trying to soft-navigate/fetch it as app route data.
 */
export function DownloadPdfButton({
  href,
  label = "Télécharger en PDF",
  variant = "outline",
  size = "sm",
}: {
  href: string;
  label?: string;
} & Pick<ComponentProps<typeof Button>, "variant" | "size"> &
  VariantProps<typeof buttonVariants>) {
  return (
    <Button variant={variant} size={size} nativeButton={false} render={<a href={href} />}>
      <Download className="size-4" aria-hidden="true" />
      {label}
    </Button>
  );
}
