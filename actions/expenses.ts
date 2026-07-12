"use server";

import { expenseService } from "@/lib/services";
import { ExpenseFormData } from "@/lib/validations";
import { requirePermission } from "@/lib/auth/guard";
import { revalidatePath } from "next/cache";

export async function createExpenseAction(data: ExpenseFormData) {
  try {
    await requirePermission("expenses:write");
    const expense = await expenseService.create(data);
    revalidatePath("/expenses");
    revalidatePath("/dashboard");
    return { data: expense };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to create expense" };
  }
}

export async function updateExpenseAction(id: string, data: Partial<ExpenseFormData>) {
  try {
    await requirePermission("expenses:write");
    const expense = await expenseService.update(id, data);
    revalidatePath("/expenses");
    revalidatePath("/dashboard");
    return { data: expense };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update expense" };
  }
}

export async function deleteExpenseAction(id: string) {
  try {
    await requirePermission("expenses:write");
    await expenseService.delete(id);
    revalidatePath("/expenses");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete expense" };
  }
}
