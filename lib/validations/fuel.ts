import { z } from "zod";

export const fuelLogSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  liters: z.coerce.number().positive("Liters must be positive"),
  cost: z.coerce.number().positive("Cost must be positive"),
  date: z.coerce.date({ message: "Date is required" }),
  odometer: z.coerce.number().min(0, "Odometer must be non-negative"),
});

export type FuelLogFormData = z.infer<typeof fuelLogSchema>;
