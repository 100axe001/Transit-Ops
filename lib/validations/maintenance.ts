import { z } from "zod";

export const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  cost: z.coerce.number().min(0, "Cost cannot be negative"),
});

export type MaintenanceFormData = z.infer<typeof maintenanceSchema>;
