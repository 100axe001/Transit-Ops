// Fuel log form dialog component
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fuelLogSchema, FuelLogFormData } from "@/lib/validations";
import { createFuelLogAction } from "@/actions/fuel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Vehicle } from "@prisma/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicles: Vehicle[];
}

export function FuelDialog({ open, onOpenChange, vehicles }: Props) {
  const router = useRouter();
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(fuelLogSchema),
  });

  async function onSubmit(data: Record<string, unknown>) {
    const result = await createFuelLogAction(data as unknown as FuelLogFormData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Fuel log created");
      reset();
      onOpenChange(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Fuel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Liters</Label>
              <Input type="number" step="0.1" {...register("liters")} />
              {errors.liters && <p className="text-xs text-destructive">{errors.liters.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Cost (₹)</Label>
              <Input type="number" step="0.01" {...register("cost")} />
              {errors.cost && <p className="text-xs text-destructive">{errors.cost.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" {...register("date")} />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Odometer (km)</Label>
              <Input type="number" {...register("odometer")} />
              {errors.odometer && <p className="text-xs text-destructive">{errors.odometer.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Log Fuel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
