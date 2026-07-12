"use server";

import { maintenanceService } from "@/lib/services";
import { MaintenanceFormData } from "@/lib/validations";
import { requirePermission } from "@/lib/auth/guard";
import { revalidatePath } from "next/cache";

export async function createMaintenanceAction(data: MaintenanceFormData) {
  try {
    await requirePermission("maintenance:write");
    const record = await maintenanceService.create(data);
    revalidatePath("/maintenance");
    revalidatePath("/vehicles");
    revalidatePath("/dashboard");
    return { data: record };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create maintenance record" };
  }
}

export async function closeMaintenanceAction(id: string) {
  try {
    await requirePermission("maintenance:write");
    const record = await maintenanceService.close(id);
    revalidatePath("/maintenance");
    revalidatePath("/vehicles");
    revalidatePath("/dashboard");
    return { data: record };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to close maintenance" };
  }
}

export async function deleteMaintenanceAction(id: string) {
  try {
    await requirePermission("maintenance:write");
    await maintenanceService.delete(id);
    revalidatePath("/maintenance");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete maintenance record" };
  }
}
