"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema, VehicleFormData } from "@/lib/validations";
import { createVehicleAction, updateVehicleAction } from "@/actions/vehicles";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { vehicleTypes } from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Vehicle } from "@prisma/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
}

export function VehicleDialog({ open, onOpenChange, vehicle }: Props) {
  const router = useRouter();
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(vehicleSchema),
  });

  useEffect(() => {
    if (vehicle) {
      reset({
        registrationNumber: vehicle.registrationNumber,
        vehicleName: vehicle.vehicleName,
        model: vehicle.model,
        vehicleType: vehicle.vehicleType,
        maximumLoadCapacity: vehicle.maximumLoadCapacity,
        acquisitionCost: vehicle.acquisitionCost,
        odometer: vehicle.odometer,
        region: vehicle.region || undefined,
      });
    } else {
      reset({
        registrationNumber: "",
        vehicleName: "",
        model: "",
        vehicleType: "TRUCK",
        maximumLoadCapacity: 0,
        acquisitionCost: 0,
        odometer: 0,
        region: "",
      });
    }
  }, [vehicle, reset]);

  async function onSubmit(data: Record<string, unknown>) {
    const typedData = data as unknown as VehicleFormData;
    const result = vehicle
      ? await updateVehicleAction(vehicle.id, typedData)
      : await createVehicleAction(typedData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(vehicle ? "Vehicle updated" : "Vehicle created");
      onOpenChange(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{vehicle ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Registration Number</Label>
              <Input {...register("registrationNumber")} />
              {errors.registrationNumber && <p className="text-xs text-destructive">{errors.registrationNumber.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Vehicle Name</Label>
              <Input {...register("vehicleName")} />
              {errors.vehicleName && <p className="text-xs text-destructive">{errors.vehicleName.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Model</Label>
              <Input {...register("model")} />
              {errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select defaultValue={vehicle?.vehicleType || "TRUCK"} onValueChange={(v) => v && setValue("vehicleType", v as VehicleFormData["vehicleType"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Max Load Capacity (kg)</Label>
              <Input type="number" {...register("maximumLoadCapacity")} />
              {errors.maximumLoadCapacity && <p className="text-xs text-destructive">{errors.maximumLoadCapacity.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Acquisition Cost ($)</Label>
              <Input type="number" {...register("acquisitionCost")} />
              {errors.acquisitionCost && <p className="text-xs text-destructive">{errors.acquisitionCost.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Odometer (km)</Label>
              <Input type="number" {...register("odometer")} />
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <Input {...register("region")} placeholder="Optional" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : vehicle ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
