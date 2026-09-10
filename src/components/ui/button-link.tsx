import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";

/**
 * A `Button` styled as a link. Base UI's `Button` uses a `render` prop for
 * polymorphic rendering (its replacement for Radix's `asChild`) and warns
 * unless `nativeButton={false}` is set when the rendered element isn't a
 * native `<button>` — this wrapper takes care of that.
 */
export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  ...props
}: ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & { className?: string; children?: ReactNode }) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      nativeButton={false}
      render={<Link href={href} {...props} />}
    >
      {children}
    </Button>
  );
}
