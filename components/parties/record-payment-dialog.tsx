"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema, PaymentFormData } from "@/lib/validations";
import { recordPaymentAction } from "@/actions/billing";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { paymentModes } from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Party, PaymentMode } from "@prisma/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  party: Party | null;
}

export function RecordPaymentDialog({ open, onOpenChange, party }: Props) {
  const router = useRouter();
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: { partyId: party?.id, mode: "CASH" as PaymentMode },
  });

  async function onSubmit(data: Record<string, unknown>) {
    const payload = { ...data, partyId: party?.id } as unknown as PaymentFormData;
    const result = await recordPaymentAction(payload);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Payment recorded");
      reset();
      onOpenChange(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment{party ? ` — ${party.name}` : ""}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input type="number" step="0.01" {...register("amount")} />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Mode</Label>
              <Select
                defaultValue="CASH"
                onValueChange={(v: string | null) => v && setValue("mode", v as PaymentMode)}
              >
                <SelectTrigger><SelectValue placeholder="Mode" /></SelectTrigger>
                <SelectContent>
                  {paymentModes.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Reference</Label>
              <Input {...register("reference")} placeholder="Optional (UPI ref, etc.)" />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" {...register("date")} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Record Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
