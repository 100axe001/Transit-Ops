"use server";

import { billingService } from "@/lib/services";
import { BiltyFormData, PaymentFormData } from "@/lib/validations";
import { requirePermission } from "@/lib/auth/guard";
import { revalidatePath } from "next/cache";

export async function createBiltyAction(data: BiltyFormData) {
  try {
    await requirePermission("billing:write");
    const bilty = await billingService.createBilty(data);
    revalidatePath("/billing");
    revalidatePath("/dashboard");
    return { data: bilty };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create bilty" };
  }
}

export async function deleteBiltyAction(id: string) {
  try {
    await requirePermission("billing:write");
    await billingService.deleteBilty(id);
    revalidatePath("/billing");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete bilty" };
  }
}

export async function recordPaymentAction(data: PaymentFormData) {
  try {
    await requirePermission("billing:write");
    const payment = await billingService.recordPayment(data);
    revalidatePath("/parties");
    revalidatePath("/billing");
    revalidatePath("/dashboard");
    return { data: payment };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to record payment" };
  }
}
