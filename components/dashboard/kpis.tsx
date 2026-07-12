"use client";

import { StatCard } from "@/components/shared/stat-card";
import { Truck, Users, Route, Wrench, Fuel, DollarSign, Activity, AlertTriangle } from "lucide-react";

interface KPIData {
  vehicles: { total: number; available: number; onTrip: number; inShop: number; retired: number; active: number };
  drivers: { available: number; onTrip: number; offDuty: number; suspended: number };
  trips: { draft: number; dispatched: number; completed: number; cancelled: number };
  costs: { fuel: number; maintenance: number; expenses: number; total: number };
  revenue: number;
  fleetUtilization: number;
}

export function DashboardKPIs({ kpis }: { kpis: KPIData }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Vehicles"
        value={kpis.vehicles.active}
        icon={Truck}
        description={`${kpis.vehicles.available} available, ${kpis.vehicles.onTrip} on trip`}
      />
      <StatCard
        title="Vehicles In Shop"
        value={kpis.vehicles.inShop}
        icon={Wrench}
        description={`${kpis.vehicles.retired} retired`}
      />
      <StatCard
        title="Active Drivers"
        value={kpis.drivers.available + kpis.drivers.onTrip}
        icon={Users}
        description={`${kpis.drivers.onTrip} on trip, ${kpis.drivers.available} available`}
      />
      <StatCard
        title="Fleet Utilization"
        value={`${kpis.fleetUtilization.toFixed(1)}%`}
        icon={Activity}
        description="Vehicles currently on trips"
      />
      <StatCard
        title="Active Trips"
        value={kpis.trips.dispatched}
        icon={Route}
        description={`${kpis.trips.draft} pending, ${kpis.trips.completed} completed`}
      />
      <StatCard
        title="Fuel Cost"
        value={`$${kpis.costs.fuel.toLocaleString()}`}
        icon={Fuel}
      />
      <StatCard
        title="Maintenance Cost"
        value={`$${kpis.costs.maintenance.toLocaleString()}`}
        icon={AlertTriangle}
      />
      <StatCard
        title="Total Operational Cost"
        value={`$${kpis.costs.total.toLocaleString()}`}
        icon={DollarSign}
        description={`Revenue: $${kpis.revenue.toLocaleString()}`}
      />
    </div>
  );
}
