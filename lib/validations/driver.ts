import { z } from "zod";

export const driverSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  licenseNumber: z.string().min(1, "License number is required").max(30),
  category: z.string().min(1, "Category is required"),
  expiryDate: z.coerce.date({ message: "Expiry date is required" }),
  phone: z.string().min(1, "Phone is required").max(20),
  safetyScore: z.coerce.number().min(0).max(100).default(100),
  status: z.enum(["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"]).default("AVAILABLE"),
});

export type DriverFormData = z.infer<typeof driverSchema>;
