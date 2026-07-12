"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { maintenanceSchema, MaintenanceFormData } from "@/lib/validations";
import { createMaintenanceAction } from "@/actions/maintenance";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export function MaintenanceDialog({ open, onOpenChange, vehicles }: Props) {
  const router = useRouter();
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(maintenanceSchema),
  });

  async function onSubmit(data: Record<string, unknown>) {
    const result = await createMaintenanceAction(data as unknown as MaintenanceFormData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Maintenance record created - vehicle moved to shop");
      reset();
      onOpenChange(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Maintenance Record</DialogTitle>
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
          <div className="space-y-2">
            <Label>Title</Label>
            <Input {...register("title")} placeholder="e.g. Oil Change, Brake Service, Engine Repair" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...register("description")} placeholder="Optional details" />
          </div>
          <div className="space-y-2">
            <Label>Cost ($)</Label>
            <Input type="number" step="0.01" {...register("cost")} />
            {errors.cost && <p className="text-xs text-destructive">{errors.cost.message}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
