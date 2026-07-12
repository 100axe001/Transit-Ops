import { analyticsService } from "@/lib/services";
import { requirePageAccess } from "@/lib/auth/guard";
import { ReportsClient } from "@/components/reports/reports-client";

export default async function ReportsPage() {
  await requirePageAccess("reports:read");
  const [fuelEfficiency, vehicleROI, tripTrends, expenseBreakdown] = await Promise.all([
    analyticsService.getFuelEfficiencyData(),
    analyticsService.getVehicleROI(),
    analyticsService.getTripTrends(),
    analyticsService.getExpenseBreakdown(),
  ]);

  return (
    <ReportsClient
      fuelEfficiency={fuelEfficiency}
      vehicleROI={vehicleROI}
      tripTrends={tripTrends}
      expenseBreakdown={expenseBreakdown}
    />
  );
}
