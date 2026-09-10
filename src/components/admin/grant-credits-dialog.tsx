"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Gift } from "lucide-react";
import { toast } from "sonner";
import { grantBonusCreditsAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function GrantCreditsDialog({ userId, email }: { userId: string; email: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("10");
  const [isPending, startTransition] = useTransition();

  const onConfirm = () => {
    const parsed = Number(amount);
    startTransition(async () => {
      const result = await grantBonusCreditsAction(userId, parsed);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success(`${parsed} crédits offerts à ${email}.`);
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Gift className="size-4" aria-hidden="true" />
        Offrir des crédits
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Offrir des crédits</DialogTitle>
          <DialogDescription>
            Ajoute des crédits bonus au solde actuel de {email}, sans changer son forfait.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="grant-amount">Nombre de crédits</Label>
          <Input
            id="grant-amount"
            type="number"
            min={1}
            max={1000}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Annuler</DialogClose>
          <Button type="button" onClick={onConfirm} disabled={isPending}>
            {isPending ? "Envoi..." : "Offrir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
