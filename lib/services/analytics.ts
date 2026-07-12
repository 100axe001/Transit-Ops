// Analytics service - aggregates data for dashboard KPIs
import { prisma } from "@/lib/prisma";
import { VehicleType, VehicleStatus, Prisma } from "@prisma/client";
import { calculateVehicleROI } from "@/lib/domain/vehicle";
import { calculateFuelEfficiency } from "@/lib/domain/trip";

export interface DashboardFilters {
  vehicleType?: VehicleType;
  status?: VehicleStatus;
  region?: string;
}

export const analyticsService = {
  // Distinct, non-empty regions for the dashboard region filter.
  async getVehicleRegions() {
    const rows = await prisma.vehicle.findMany({
      where: { region: { not: null } },
      distinct: ["region"],
      select: { region: true },
      orderBy: { region: "asc" },
    });
    return rows
      .map((r) => r.region)
      .filter((r): r is string => Boolean(r));
  },

  async getDashboardKPIs(filters: DashboardFilters = {}) {
    // Vehicle-centric filters (type / status / region) narrow the fleet KPIs.
    const vehicleWhere: Prisma.VehicleWhereInput = {
      ...(filters.vehicleType ? { vehicleType: filters.vehicleType } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.region ? { region: filters.region } : {}),
    };

    const [
      vehicleStatusCounts,
      driverStatusCounts,
      tripStatusCounts,
      totalFuel,
      totalMaintenance,
      totalExpenses,
      totalRevenue,
      totalVehicles,
    ] = await Promise.all([
      prisma.vehicle.groupBy({ by: ["status"], where: vehicleWhere, _count: true }),
      prisma.driver.groupBy({ by: ["status"], _count: true }),
      prisma.trip.groupBy({ by: ["status"], _count: true }),
      prisma.fuelLog.aggregate({ _sum: { cost: true } }),
      prisma.maintenance.aggregate({ _sum: { cost: true } }),
      prisma.expense.aggregate({ _sum: { amount: true } }),
      prisma.trip.aggregate({ where: { status: "COMPLETED" }, _sum: { revenue: true } }),
      prisma.vehicle.count({ where: vehicleWhere }),
    ]);

    const vehicleCounts = Object.fromEntries(
      vehicleStatusCounts.map((v) => [v.status, v._count])
    );
    const driverCounts = Object.fromEntries(
      driverStatusCounts.map((d) => [d.status, d._count])
    );
    const tripCounts = Object.fromEntries(
      tripStatusCounts.map((t) => [t.status, t._count])
    );

    const activeVehicles = (vehicleCounts["AVAILABLE"] || 0) + (vehicleCounts["ON_TRIP"] || 0);
    const fleetUtilization = totalVehicles > 0
      ? ((vehicleCounts["ON_TRIP"] || 0) / totalVehicles) * 100
      : 0;

    return {
      vehicles: {
        total: totalVehicles,
        available: vehicleCounts["AVAILABLE"] || 0,
        onTrip: vehicleCounts["ON_TRIP"] || 0,
        inShop: vehicleCounts["IN_SHOP"] || 0,
        retired: vehicleCounts["RETIRED"] || 0,
        active: activeVehicles,
      },
      drivers: {
        available: driverCounts["AVAILABLE"] || 0,
        onTrip: driverCounts["ON_TRIP"] || 0,
        offDuty: driverCounts["OFF_DUTY"] || 0,
        suspended: driverCounts["SUSPENDED"] || 0,
      },
      trips: {
        draft: tripCounts["DRAFT"] || 0,
        dispatched: tripCounts["DISPATCHED"] || 0,
        completed: tripCounts["COMPLETED"] || 0,
        cancelled: tripCounts["CANCELLED"] || 0,
      },
      costs: {
        fuel: totalFuel._sum.cost || 0,
        maintenance: totalMaintenance._sum.cost || 0,
        expenses: totalExpenses._sum.amount || 0,
        total: (totalFuel._sum.cost || 0) + (totalMaintenance._sum.cost || 0) + (totalExpenses._sum.amount || 0),
      },
      revenue: totalRevenue._sum.revenue || 0,
      fleetUtilization,
    };
  },

  async getFuelEfficiencyData() {
    const trips = await prisma.trip.findMany({
      where: { status: "COMPLETED", fuelConsumed: { gt: 0 } },
      include: { vehicle: true },
      orderBy: { endTime: "desc" },
      take: 20,
    });

    return trips.map((trip) => ({
      id: trip.id,
      vehicle: trip.vehicle.vehicleName,
      distance: trip.actualDistance || 0,
      fuel: trip.fuelConsumed || 0,
      efficiency: calculateFuelEfficiency(trip.actualDistance || 0, trip.fuelConsumed || 0),
    }));
  },

  async getVehicleROI() {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        trips: { where: { status: "COMPLETED" } },
        fuelLogs: true,
        maintenance: true,
      },
    });

    return vehicles.map((v) => {
      const revenue = v.trips.reduce((sum, t) => sum + t.revenue, 0);
      const fuelCost = v.fuelLogs.reduce((sum, f) => sum + f.cost, 0);
      const maintenanceCost = v.maintenance.reduce((sum, m) => sum + m.cost, 0);
      const roi = calculateVehicleROI(revenue, fuelCost, maintenanceCost, v.acquisitionCost);

      return {
        id: v.id,
        name: v.vehicleName,
        registration: v.registrationNumber,
        revenue,
        fuelCost,
        maintenanceCost,
        acquisitionCost: v.acquisitionCost,
        roi,
      };
    });
  },

  async getTripTrends() {
    const trips = await prisma.trip.findMany({
      where: { status: "COMPLETED" },
      orderBy: { endTime: "asc" },
    });

    const monthly: Record<string, { count: number; revenue: number }> = {};
    trips.forEach((trip) => {
      const month = trip.endTime
        ? `${trip.endTime.getFullYear()}-${String(trip.endTime.getMonth() + 1).padStart(2, "0")}`
        : "unknown";
      if (!monthly[month]) monthly[month] = { count: 0, revenue: 0 };
      monthly[month].count++;
      monthly[month].revenue += trip.revenue;
    });

    return Object.entries(monthly).map(([month, data]) => ({
      month,
      trips: data.count,
      revenue: data.revenue,
    }));
  },

  async getExpenseBreakdown() {
    const byType = await prisma.expense.groupBy({
      by: ["type"],
      _sum: { amount: true },
    });

    const fuelTotal = await prisma.fuelLog.aggregate({ _sum: { cost: true } });
    const maintenanceTotal = await prisma.maintenance.aggregate({ _sum: { cost: true } });

    return [
      { name: "Fuel", value: fuelTotal._sum.cost || 0 },
      { name: "Maintenance", value: maintenanceTotal._sum.cost || 0 },
      ...byType.map((e) => ({ name: e.type, value: e._sum.amount || 0 })),
    ];
  },
};
