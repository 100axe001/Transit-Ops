"use client";

import { StatCard } from "@/components/shared/stat-card";
import { Truck, CheckCircle, Wrench, Route, Clock, Users, Activity } from "lucide-react";

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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      <StatCard
        title="Active Vehicles"
        value={kpis.vehicles.active}
        icon={Truck}
        description="Available + on trip"
      />
      <StatCard
        title="Available Vehicles"
        value={kpis.vehicles.available}
        icon={CheckCircle}
        description="Ready to dispatch"
      />
      <StatCard
        title="In Maintenance"
        value={kpis.vehicles.inShop}
        icon={Wrench}
        description={`${kpis.vehicles.retired} retired`}
      />
      <StatCard
        title="Active Trips"
        value={kpis.trips.dispatched}
        icon={Route}
        description="Currently dispatched"
      />
      <StatCard
        title="Pending Trips"
        value={kpis.trips.draft}
        icon={Clock}
        description="Draft, awaiting dispatch"
      />
      <StatCard
        title="Drivers On Duty"
        value={kpis.drivers.available + kpis.drivers.onTrip}
        icon={Users}
        description={`${kpis.drivers.onTrip} on trip`}
      />
      <StatCard
        title="Fleet Utilization"
        value={`${kpis.fleetUtilization.toFixed(1)}%`}
        icon={Activity}
        description="On trip vs. fleet"
      />
    </div>
  );
}
