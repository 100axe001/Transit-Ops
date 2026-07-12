import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  Receipt,
  BarChart3,
  Settings,
  FileText,
  Building2,
  LucideIcon,
} from "lucide-react";
import type { Permission } from "@/lib/permissions";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission: Permission;
}

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard:read" },
  { title: "Vehicles", href: "/vehicles", icon: Truck, permission: "vehicles:read" },
  { title: "Drivers", href: "/drivers", icon: Users, permission: "drivers:read" },
  { title: "Trips", href: "/trips", icon: Route, permission: "trips:read" },
  { title: "Maintenance", href: "/maintenance", icon: Wrench, permission: "maintenance:read" },
  { title: "Fuel", href: "/fuel", icon: Fuel, permission: "fuel:read" },
  { title: "Expenses", href: "/expenses", icon: Receipt, permission: "expenses:read" },
  { title: "Billing", href: "/billing", icon: FileText, permission: "billing:read" },
  { title: "Parties", href: "/parties", icon: Building2, permission: "parties:read" },
  { title: "Reports", href: "/reports", icon: BarChart3, permission: "reports:read" },
  { title: "Settings", href: "/settings", icon: Settings, permission: "settings:read" },
];

export const vehicleTypes = [
  { value: "TRUCK", label: "Truck" },
  { value: "VAN", label: "Van" },
  { value: "BUS", label: "Bus" },
  { value: "SEDAN", label: "Sedan" },
  { value: "SUV", label: "SUV" },
];

export const vehicleStatuses = [
  { value: "AVAILABLE", label: "Available" },
  { value: "ON_TRIP", label: "On Trip" },
  { value: "IN_SHOP", label: "In Shop" },
  { value: "RETIRED", label: "Retired" },
];

export const driverStatuses = [
  { value: "AVAILABLE", label: "Available" },
  { value: "ON_TRIP", label: "On Trip" },
  { value: "OFF_DUTY", label: "Off Duty" },
  { value: "SUSPENDED", label: "Suspended" },
];

export const tripStatuses = [
  { value: "DRAFT", label: "Draft" },
  { value: "DISPATCHED", label: "Dispatched" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const expenseTypes = [
  { value: "TOLL", label: "Toll" },
  { value: "REPAIR", label: "Repair" },
  { value: "INSURANCE", label: "Insurance" },
  { value: "PARKING", label: "Parking" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "OTHER", label: "Other" },
];

export const partyTypes = [
  { value: "CONSIGNOR", label: "Consignor" },
  { value: "CONSIGNEE", label: "Consignee" },
  { value: "BOTH", label: "Both" },
];

export const paymentModes = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
];

