"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Shield, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { setUserAdminAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";

export function ToggleAdminButton({ userId, isAdmin }: { userId: string; isAdmin: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await setUserAdminAction(userId, !isAdmin);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success(isAdmin ? "Accès administrateur retiré." : "Accès administrateur accordé.");
      router.refresh();
    });
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick} disabled={isPending}>
      {isAdmin ? (
        <>
          <ShieldOff className="size-4" aria-hidden="true" />
          Retirer admin
        </>
      ) : (
        <>
          <Shield className="size-4" aria-hidden="true" />
          Rendre admin
        </>
      )}
    </Button>
  );
}
