import { z } from "zod";

export const tripSchema = z.object({
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  cargoWeight: z.coerce.number().positive("Cargo weight must be positive"),
  plannedDistance: z.coerce.number().positive("Distance must be positive"),
  revenue: z.coerce.number().min(0, "Revenue cannot be negative"),
  vehicleId: z.string().min(1, "Vehicle is required"),
  driverId: z.string().min(1, "Driver is required"),
});

export const completeTripSchema = z.object({
  actualDistance: z.coerce.number().positive("Actual distance must be positive"),
  fuelConsumed: z.coerce.number().positive("Fuel consumed must be positive"),
});

export type TripFormData = z.infer<typeof tripSchema>;
export type CompleteTripFormData = z.infer<typeof completeTripSchema>;
