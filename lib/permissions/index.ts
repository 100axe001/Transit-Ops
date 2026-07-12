import { UserRole } from "@prisma/client";

type Permission =
  | "vehicles:read" | "vehicles:write"
  | "drivers:read" | "drivers:write"
  | "trips:read" | "trips:write"
  | "maintenance:read" | "maintenance:write"
  | "fuel:read" | "fuel:write"
  | "expenses:read" | "expenses:write"
  | "reports:read"
  | "dashboard:read"
  | "parties:read" | "parties:write"
  | "billing:read" | "billing:write"
  | "settings:read" | "settings:write";

const rolePermissions: Record<UserRole, Permission[]> = {
  FLEET_MANAGER: [
    "vehicles:read", "vehicles:write",
    "drivers:read", "drivers:write",
    "trips:read", "trips:write",
    "maintenance:read", "maintenance:write",
    "fuel:read", "fuel:write",
    "expenses:read", "expenses:write",
    "reports:read",
    "dashboard:read",
    "parties:read", "parties:write",
    "billing:read", "billing:write",
    "settings:read", "settings:write",
  ],
  DISPATCHER: [
    "vehicles:read",
    "drivers:read", "drivers:write",
    "trips:read", "trips:write",
    "maintenance:read",
    "fuel:read",
    "expenses:read",
    "dashboard:read",
    "reports:read",
    "parties:read",
    "billing:read", "billing:write",
  ],
  SAFETY_OFFICER: [
    "vehicles:read",
    "drivers:read", "drivers:write",
    "trips:read",
    "maintenance:read",
    "dashboard:read",
    "reports:read",
  ],
  FINANCIAL_ANALYST: [
    "vehicles:read",
    "drivers:read",
    "trips:read",
    "maintenance:read",
    "fuel:read", "fuel:write",
    "expenses:read", "expenses:write",
    "reports:read",
    "dashboard:read",
    "parties:read", "parties:write",
    "billing:read", "billing:write",
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function getPermissions(role: UserRole): Permission[] {
  return rolePermissions[role] ?? [];
}

export type { Permission };
