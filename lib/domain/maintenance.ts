import { MaintenanceStatus } from "@prisma/client";

export function canCloseMaintenance(status: MaintenanceStatus): { valid: boolean; error?: string } {
  if (status === "CLOSED") {
    return { valid: false, error: "Maintenance is already closed" };
  }
  return { valid: true };
}

export function canOpenMaintenance(vehicleStatus: string): { valid: boolean; error?: string } {
  if (vehicleStatus === "ON_TRIP") {
    return { valid: false, error: "Cannot open maintenance for a vehicle on trip" };
  }
  return { valid: true };
}
