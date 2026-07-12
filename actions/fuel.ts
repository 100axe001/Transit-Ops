"use server";

import { fuelService } from "@/lib/services";
import { FuelLogFormData } from "@/lib/validations";
import { requirePermission } from "@/lib/auth/guard";
import { revalidatePath } from "next/cache";

export async function createFuelLogAction(data: FuelLogFormData) {
  try {
    await requirePermission("fuel:write");
    const log = await fuelService.create(data);
    revalidatePath("/fuel");
    revalidatePath("/dashboard");
    return { data: log };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create fuel log" };
  }
}

export async function deleteFuelLogAction(id: string) {
  try {
    await requirePermission("fuel:write");
    await fuelService.delete(id);
    revalidatePath("/fuel");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete fuel log" };
  }
}
