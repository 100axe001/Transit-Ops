import { z } from "zod";

export const expenseSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  type: z.enum(["TOLL", "REPAIR", "INSURANCE", "PARKING", "MAINTENANCE", "OTHER"]),
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().optional(),
  date: z.coerce.date({ message: "Date is required" }),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
