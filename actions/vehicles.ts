"use server";

import { vehicleService } from "@/lib/services";
import { VehicleFormData } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createVehicleAction(data: VehicleFormData) {
  try {
    const vehicle = await vehicleService.create(data);
    revalidatePath("/vehicles");
    revalidatePath("/dashboard");
    return { data: vehicle };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create vehicle" };
  }
}

export async function updateVehicleAction(id: string, data: Partial<VehicleFormData>) {
  try {
    const vehicle = await vehicleService.update(id, data);
    revalidatePath("/vehicles");
    revalidatePath("/dashboard");
    return { data: vehicle };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update vehicle" };
  }
}

export async function deleteVehicleAction(id: string) {
  try {
    await vehicleService.delete(id);
    revalidatePath("/vehicles");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete vehicle" };
  }
}
