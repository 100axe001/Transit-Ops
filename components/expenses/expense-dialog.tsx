"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, ExpenseFormData } from "@/lib/validations";
import { createExpenseAction } from "@/actions/expenses";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { expenseTypes } from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Vehicle } from "@prisma/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicles: Vehicle[];
}

export function ExpenseDialog({ open, onOpenChange, vehicles }: Props) {
  const router = useRouter();
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(expenseSchema),
  });

  async function onSubmit(data: Record<string, unknown>) {
    const result = await createExpenseAction(data as unknown as ExpenseFormData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Expense recorded");
      reset();
      onOpenChange(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Vehicle</Label>
              <Select onValueChange={(v: string | null) => v && setValue("vehicleId", v)}>
                <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.vehicleName} ({v.registrationNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehicleId && <p className="text-xs text-destructive">{errors.vehicleId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select onValueChange={(v: string | null) => v && setValue("type", v as "TOLL" | "REPAIR" | "INSURANCE" | "PARKING" | "MAINTENANCE" | "OTHER")}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {expenseTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount ($)</Label>
              <Input type="number" step="0.01" {...register("amount")} />
              {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" {...register("date")} />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input {...register("description")} placeholder="Optional" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
