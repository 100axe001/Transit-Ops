"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { completeTripSchema, CompleteTripFormData } from "@/lib/validations";
import { completeTripAction } from "@/actions/trips";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Trip, Vehicle, Driver } from "@prisma/client";

type TripWithRelations = Trip & { vehicle: Vehicle; driver: Driver };

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: TripWithRelations | null;
}

export function CompleteTripDialog({ open, onOpenChange, trip }: Props) {
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(completeTripSchema),
  });

  async function onSubmit(data: Record<string, unknown>) {
    if (!trip) return;
    const result = await completeTripAction(trip.id, data as unknown as CompleteTripFormData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Trip completed");
      reset();
      onOpenChange(false);
      router.refresh();
    }
  }

  if (!trip) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Trip</DialogTitle>
          <DialogDescription>
            {trip.source} → {trip.destination} ({trip.vehicle.vehicleName}, {trip.driver.name})
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Actual Distance (km)</Label>
              <Input type="number" {...register("actualDistance")} defaultValue={trip.plannedDistance} />
              {errors.actualDistance && <p className="text-xs text-destructive">{errors.actualDistance.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Fuel Consumed (liters)</Label>
              <Input type="number" step="0.1" {...register("fuelConsumed")} />
              {errors.fuelConsumed && <p className="text-xs text-destructive">{errors.fuelConsumed.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Completing..." : "Complete Trip"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
