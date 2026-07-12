import { DriverStatus } from "@prisma/client";

export function isDriverDispatchable(driver: {
  status: DriverStatus;
  expiryDate: Date;
}): { valid: boolean; error?: string } {
  if (driver.status === "SUSPENDED") {
    return { valid: false, error: "Suspended drivers cannot be assigned" };
  }
  if (driver.status === "ON_TRIP") {
    return { valid: false, error: "Driver is already on a trip" };
  }
  if (driver.status === "OFF_DUTY") {
    return { valid: false, error: "Driver is off duty" };
  }
  if (driver.status !== "AVAILABLE") {
    return { valid: false, error: `Driver status '${driver.status}' is not dispatchable` };
  }
  if (isLicenseExpired(driver.expiryDate)) {
    return { valid: false, error: "Driver's license has expired" };
  }
  return { valid: true };
}

export function isLicenseExpired(expiryDate: Date): boolean {
  return new Date(expiryDate) < new Date();
}

export function isLicenseExpiringSoon(expiryDate: Date, daysThreshold = 30): boolean {
  const now = new Date();
  const threshold = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);
  const expiry = new Date(expiryDate);
  return expiry <= threshold && expiry > now;
}

export function getDriverStatusAfterDispatch(): DriverStatus {
  return "ON_TRIP";
}

export function getDriverStatusAfterTripComplete(): DriverStatus {
  return "AVAILABLE";
}

export function getDriverStatusAfterTripCancel(): DriverStatus {
  return "AVAILABLE";
}
