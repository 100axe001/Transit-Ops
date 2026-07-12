import { VehicleStatus } from "@prisma/client";

export function isVehicleDispatchable(status: VehicleStatus): boolean {
  return status === "AVAILABLE";
}

export function canVehicleBeDispatched(vehicle: {
  status: VehicleStatus;
}): { valid: boolean; error?: string } {
  if (vehicle.status === "RETIRED") {
    return { valid: false, error: "Retired vehicles cannot be dispatched" };
  }
  if (vehicle.status === "IN_SHOP") {
    return { valid: false, error: "Vehicles in maintenance cannot be dispatched" };
  }
  if (vehicle.status === "ON_TRIP") {
    return { valid: false, error: "Vehicle is already on a trip" };
  }
  if (vehicle.status !== "AVAILABLE") {
    return { valid: false, error: `Vehicle status '${vehicle.status}' is not dispatchable` };
  }
  return { valid: true };
}

export function canCarryLoad(
  vehicleCapacity: number,
  cargoWeight: number
): { valid: boolean; error?: string } {
  if (cargoWeight > vehicleCapacity) {
    return {
      valid: false,
      error: `Cargo weight (${cargoWeight} kg) exceeds vehicle capacity (${vehicleCapacity} kg)`,
    };
  }
  return { valid: true };
}

export function getVehicleStatusAfterDispatch(): VehicleStatus {
  return "ON_TRIP";
}

export function getVehicleStatusAfterTripComplete(): VehicleStatus {
  return "AVAILABLE";
}

export function getVehicleStatusAfterTripCancel(): VehicleStatus {
  return "AVAILABLE";
}

export function getVehicleStatusAfterMaintenanceOpen(): VehicleStatus {
  return "IN_SHOP";
}

export function getVehicleStatusAfterMaintenanceClose(
  currentStatus: VehicleStatus
): VehicleStatus {
  if (currentStatus === "RETIRED") return "RETIRED";
  return "AVAILABLE";
}

export function calculateVehicleROI(
  revenue: number,
  fuelCost: number,
  maintenanceCost: number,
  acquisitionCost: number
): number {
  if (acquisitionCost === 0) return 0;
  return ((revenue - fuelCost - maintenanceCost) / acquisitionCost) * 100;
}
