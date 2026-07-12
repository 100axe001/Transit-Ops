"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tripSchema, TripFormData } from "@/lib/validations";
import { createTripAction } from "@/actions/trips";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Vehicle, Driver } from "@prisma/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicles: Vehicle[];
  drivers: Driver[];
}

export function TripDialog({ open, onOpenChange, vehicles, drivers }: Props) {
  const router = useRouter();
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(tripSchema),
  });

  async function onSubmit(data: Record<string, unknown>) {
    const result = await createTripAction(data as unknown as TripFormData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Trip created");
      reset();
      onOpenChange(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Trip</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Source</Label>
              <Input {...register("source")} placeholder="Origin city" />
              {errors.source && <p className="text-xs text-destructive">{errors.source.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Destination</Label>
              <Input {...register("destination")} placeholder="Destination city" />
              {errors.destination && <p className="text-xs text-destructive">{errors.destination.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Vehicle</Label>
              <Select onValueChange={(v: string | null) => v && setValue("vehicleId", v)}>
                <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.vehicleName} ({v.registrationNumber}) - {v.maximumLoadCapacity}kg
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehicleId && <p className="text-xs text-destructive">{errors.vehicleId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Driver</Label>
              <Select onValueChange={(v: string | null) => v && setValue("driverId", v)}>
                <SelectTrigger><SelectValue placeholder="Select driver" /></SelectTrigger>
                <SelectContent>
                  {drivers.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name} ({d.licenseNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.driverId && <p className="text-xs text-destructive">{errors.driverId.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Cargo Weight (kg)</Label>
              <Input type="number" {...register("cargoWeight")} />
              {errors.cargoWeight && <p className="text-xs text-destructive">{errors.cargoWeight.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Planned Distance (km)</Label>
              <Input type="number" {...register("plannedDistance")} />
              {errors.plannedDistance && <p className="text-xs text-destructive">{errors.plannedDistance.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Revenue ($)</Label>
              <Input type="number" {...register("revenue")} />
              {errors.revenue && <p className="text-xs text-destructive">{errors.revenue.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Trip"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
