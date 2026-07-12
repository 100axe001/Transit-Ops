// Trip domain business rules
import { TripStatus } from "@prisma/client";

export function canDispatchTrip(tripStatus: TripStatus): { valid: boolean; error?: string } {
  if (tripStatus !== "DRAFT") {
    return { valid: false, error: "Only draft trips can be dispatched" };
  }
  return { valid: true };
}

export function canCompleteTrip(tripStatus: TripStatus): { valid: boolean; error?: string } {
  if (tripStatus !== "DISPATCHED") {
    return { valid: false, error: "Only dispatched trips can be completed" };
  }
  return { valid: true };
}

export function canCancelTrip(tripStatus: TripStatus): { valid: boolean; error?: string } {
  if (tripStatus === "COMPLETED") {
    return { valid: false, error: "Completed trips cannot be cancelled" };
  }
  if (tripStatus === "CANCELLED") {
    return { valid: false, error: "Trip is already cancelled" };
  }
  return { valid: true };
}

export function calculateFuelEfficiency(
  distance: number,
  fuelConsumed: number
): number {
  if (fuelConsumed === 0) return 0;
  return distance / fuelConsumed;
}

export function calculateCostPerKm(
  totalCost: number,
  distance: number
): number {
  if (distance === 0) return 0;
  return totalCost / distance;
}
