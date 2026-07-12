"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { driverSchema, DriverFormData } from "@/lib/validations";
import { createDriverAction, updateDriverAction } from "@/actions/drivers";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Driver } from "@prisma/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: Driver | null;
}

export function DriverDialog({ open, onOpenChange, driver }: Props) {
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(driverSchema),
  });

  useEffect(() => {
    if (driver) {
      reset({
        name: driver.name,
        licenseNumber: driver.licenseNumber,
        category: driver.category,
        expiryDate: new Date(driver.expiryDate),
        phone: driver.phone,
        safetyScore: driver.safetyScore,
      });
    } else {
      reset({
        name: "",
        licenseNumber: "",
        category: "",
        expiryDate: undefined as unknown as Date,
        phone: "",
        safetyScore: 100,
      });
    }
  }, [driver, reset]);

  async function onSubmit(data: Record<string, unknown>) {
    const typedData = data as unknown as DriverFormData;
    const result = driver
      ? await updateDriverAction(driver.id, typedData)
      : await createDriverAction(typedData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(driver ? "Driver updated" : "Driver created");
      onOpenChange(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{driver ? "Edit Driver" : "Add Driver"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>License Number</Label>
              <Input {...register("licenseNumber")} />
              {errors.licenseNumber && <p className="text-xs text-destructive">{errors.licenseNumber.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Input {...register("category")} placeholder="e.g. Heavy, Light" />
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input {...register("phone")} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>License Expiry Date</Label>
              <Input type="date" {...register("expiryDate")} />
              {errors.expiryDate && <p className="text-xs text-destructive">{errors.expiryDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Safety Score (0-100)</Label>
              <Input type="number" {...register("safetyScore")} />
              {errors.safetyScore && <p className="text-xs text-destructive">{errors.safetyScore.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : driver ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
