"use server";

import { driverService } from "@/lib/services";
import { DriverFormData } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createDriverAction(data: DriverFormData) {
  try {
    const driver = await driverService.create(data);
    revalidatePath("/drivers");
    revalidatePath("/dashboard");
    return { data: driver };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create driver" };
  }
}

export async function updateDriverAction(id: string, data: Partial<DriverFormData>) {
  try {
    const driver = await driverService.update(id, data);
    revalidatePath("/drivers");
    revalidatePath("/dashboard");
    return { data: driver };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update driver" };
  }
}

export async function deleteDriverAction(id: string) {
  try {
    await driverService.delete(id);
    revalidatePath("/drivers");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete driver" };
  }
}
