"use server";

import { tripService } from "@/lib/services";
import { TripFormData, CompleteTripFormData } from "@/lib/validations";
import { requirePermission } from "@/lib/auth/guard";
import { revalidatePath } from "next/cache";

export async function createTripAction(data: TripFormData) {
  try {
    await requirePermission("trips:write");
    const trip = await tripService.create(data);
    revalidatePath("/trips");
    revalidatePath("/dashboard");
    return { data: trip };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create trip" };
  }
}

export async function dispatchTripAction(id: string) {
  try {
    await requirePermission("trips:write");
    const trip = await tripService.dispatch(id);
    revalidatePath("/trips");
    revalidatePath("/vehicles");
    revalidatePath("/drivers");
    revalidatePath("/dashboard");
    return { data: trip };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to dispatch trip" };
  }
}

export async function completeTripAction(id: string, data: CompleteTripFormData) {
  try {
    await requirePermission("trips:write");
    const trip = await tripService.complete(id, data);
    revalidatePath("/trips");
    revalidatePath("/vehicles");
    revalidatePath("/drivers");
    revalidatePath("/dashboard");
    return { data: trip };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to complete trip" };
  }
}

export async function cancelTripAction(id: string) {
  try {
    await requirePermission("trips:write");
    const trip = await tripService.cancel(id);
    revalidatePath("/trips");
    revalidatePath("/vehicles");
    revalidatePath("/drivers");
    revalidatePath("/dashboard");
    return { data: trip };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to cancel trip" };
  }
}
