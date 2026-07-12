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
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Vehicles", href: "/vehicles", icon: Truck },
  { title: "Drivers", href: "/drivers", icon: Users },
  { title: "Trips", href: "/trips", icon: Route },
  { title: "Maintenance", href: "/maintenance", icon: Wrench },
  { title: "Fuel", href: "/fuel", icon: Fuel },
  { title: "Expenses", href: "/expenses", icon: Receipt },
  { title: "Reports", href: "/reports", icon: BarChart3 },
  { title: "Settings", href: "/settings", icon: Settings },
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

