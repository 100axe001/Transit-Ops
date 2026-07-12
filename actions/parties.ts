"use server";

import { partyService } from "@/lib/services";
import { PartyFormData } from "@/lib/validations";
import { requirePermission } from "@/lib/auth/guard";
import { revalidatePath } from "next/cache";

export async function createPartyAction(data: PartyFormData) {
  try {
    await requirePermission("parties:write");
    const party = await partyService.create(data);
    revalidatePath("/parties");
    return { data: party };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create party" };
  }
}

export async function updatePartyAction(id: string, data: Partial<PartyFormData>) {
  try {
    await requirePermission("parties:write");
    const party = await partyService.update(id, data);
    revalidatePath("/parties");
    return { data: party };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update party" };
  }
}

export async function deletePartyAction(id: string) {
  try {
    await requirePermission("parties:write");
    await partyService.delete(id);
    revalidatePath("/parties");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete party" };
  }
}
