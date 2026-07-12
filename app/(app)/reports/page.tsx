import { analyticsService } from "@/lib/services";
import { requirePageAccess } from "@/lib/auth/guard";
import { ReportsClient } from "@/components/reports/reports-client";

export default async function ReportsPage() {
  await requirePageAccess("reports:read");
  const [kpis, fuelEfficiency, vehicleROI, tripTrends, expenseBreakdown] = await Promise.all([
    analyticsService.getDashboardKPIs(),
    analyticsService.getFuelEfficiencyData(),
    analyticsService.getVehicleROI(),
    analyticsService.getTripTrends(),
    analyticsService.getExpenseBreakdown(),
  ]);

  return (
    <ReportsClient
      fleetUtilization={kpis.fleetUtilization}
      operationalCost={kpis.costs.total}
      fuelEfficiency={fuelEfficiency}
      vehicleROI={vehicleROI}
      tripTrends={tripTrends}
      expenseBreakdown={expenseBreakdown}
    />
  );
}
