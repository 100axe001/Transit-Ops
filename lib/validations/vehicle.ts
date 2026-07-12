import { z } from "zod";

export const vehicleSchema = z.object({
  registrationNumber: z.string().min(1, "Registration number is required").max(20),
  vehicleName: z.string().min(1, "Vehicle name is required").max(100),
  model: z.string().min(1, "Model is required").max(100),
  vehicleType: z.enum(["TRUCK", "VAN", "BUS", "SEDAN", "SUV"]),
  maximumLoadCapacity: z.coerce.number().positive("Capacity must be positive"),
  acquisitionCost: z.coerce.number().min(0, "Cost cannot be negative"),
  odometer: z.coerce.number().min(0).default(0),
  status: z.enum(["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"]).default("AVAILABLE"),
  region: z.string().optional(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
