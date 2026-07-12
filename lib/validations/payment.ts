import { z } from "zod";

export const paymentSchema = z.object({
  partyId: z.string().min(1, "Party is required"),
  biltyId: z.string().optional(),
  amount: z.coerce.number().positive("Amount must be positive"),
  mode: z.enum(["CASH", "UPI", "BANK_TRANSFER"]),
  reference: z.string().max(100).optional().or(z.literal("")),
  date: z.coerce.date().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
