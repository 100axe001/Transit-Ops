"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { biltySchema, BiltyFormData } from "@/lib/validations";
import { createBiltyAction } from "@/actions/billing";
import { calculateBiltyCharges } from "@/lib/domain/billing";
import { formatCurrency } from "@/lib/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Party } from "@prisma/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parties: Party[];
}

export function BiltyDialog({ open, onOpenChange, parties }: Props) {
  const router = useRouter();
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(biltySchema),
  });

  const charges = calculateBiltyCharges({
    actualWeight: Number(watch("actualWeight")) || 0,
    doorDelivery: Number(watch("doorDelivery")) || 0,
    pfCharge: Number(watch("pfCharge")) || 0,
    serviceTax: Number(watch("serviceTax")) || 0,
  });

  async function onSubmit(data: Record<string, unknown>) {
    const result = await createBiltyAction(data as unknown as BiltyFormData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Bilty ${result.data?.biltyNumber} created`);
      reset();
      onOpenChange(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Bilty (LR)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Consignor</Label>
              <Select onValueChange={(v: string | null) => v && setValue("consignorId", v)}>
                <SelectTrigger><SelectValue placeholder="Select consignor" /></SelectTrigger>
                <SelectContent>
                  {parties.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.consignorId && <p className="text-xs text-destructive">{errors.consignorId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Consignee</Label>
              <Select onValueChange={(v: string | null) => v && setValue("consigneeId", v)}>
                <SelectTrigger><SelectValue placeholder="Select consignee" /></SelectTrigger>
                <SelectContent>
                  {parties.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.consigneeId && <p className="text-xs text-destructive">{errors.consigneeId.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Input {...register("fromLocation")} placeholder="Origin" />
              {errors.fromLocation && <p className="text-xs text-destructive">{errors.fromLocation.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input {...register("toLocation")} placeholder="Destination" />
              {errors.toLocation && <p className="text-xs text-destructive">{errors.toLocation.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-2">
              <Label>Goods Description</Label>
              <Input {...register("goodsDesc")} placeholder="e.g. Cotton bales" />
              {errors.goodsDesc && <p className="text-xs text-destructive">{errors.goodsDesc.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Packages</Label>
              <Input type="number" {...register("packages")} />
              {errors.packages && <p className="text-xs text-destructive">{errors.packages.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Actual Weight (kg)</Label>
              <Input type="number" step="0.01" {...register("actualWeight")} />
              {errors.actualWeight && <p className="text-xs text-destructive">{errors.actualWeight.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Packing Method</Label>
              <Input {...register("packingMethod")} placeholder="Optional" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Door Delivery (₹)</Label>
              <Input type="number" step="0.01" {...register("doorDelivery")} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Platform Fee (₹)</Label>
              <Input type="number" step="0.01" {...register("pfCharge")} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Service Tax (₹)</Label>
              <Input type="number" step="0.01" {...register("serviceTax")} placeholder="0" />
            </div>
          </div>

          {/* Live auto-calculated charges (Rule B-02) */}
          <div className="rounded-lg border bg-muted/40 p-3 text-sm">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Auto-calculated charges
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1">
              <span className="text-muted-foreground">Charged weight</span>
              <span className="text-right tabular-nums">{charges.chargedWeight.toFixed(2)} qtl</span>
              <span className="text-muted-foreground">Labour (₹15/qtl)</span>
              <span className="text-right tabular-nums">{formatCurrency(charges.labourCharge, { decimals: true })}</span>
              <span className="text-muted-foreground">GR charge</span>
              <span className="text-right tabular-nums">{formatCurrency(charges.grCharge)}</span>
              <span className="text-muted-foreground">Door + PF + Tax</span>
              <span className="text-right tabular-nums">{formatCurrency(charges.doorDelivery + charges.pfCharge + charges.serviceTax, { decimals: true })}</span>
              <span className="font-medium">Total</span>
              <span className="text-right font-semibold tabular-nums text-primary">{formatCurrency(charges.total, { decimals: true })}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Bilty"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
