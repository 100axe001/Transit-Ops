"use server";

import { expenseService } from "@/lib/services";
import { ExpenseFormData } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function createExpenseAction(data: ExpenseFormData) {
  try {
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
    await expenseService.delete(id);
    revalidatePath("/expenses");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete expense" };
  }
}
