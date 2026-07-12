import { analyticsService } from "@/lib/services";
import { tripRepository } from "@/lib/repositories";
import { driverRepository } from "@/lib/repositories";
import { maintenanceRepository } from "@/lib/repositories";
import { DashboardKPIs } from "@/components/dashboard/kpis";
import { RecentTrips } from "@/components/dashboard/recent-trips";
import { MaintenanceAlerts } from "@/components/dashboard/maintenance-alerts";
import { LicenseAlerts } from "@/components/dashboard/license-alerts";
import { FleetChart } from "@/components/dashboard/fleet-chart";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { requirePageAccess } from "@/lib/auth/guard";

export default async function DashboardPage() {
  await requirePageAccess("dashboard:read");
  const [kpis, recentTrips, openMaintenance, expiringLicenses, expenseBreakdown] =
    await Promise.all([
      analyticsService.getDashboardKPIs(),
      tripRepository.findRecent(5),
      maintenanceRepository.findOpen(),
      driverRepository.findExpiringLicenses(30),
      analyticsService.getExpenseBreakdown(),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Fleet operations overview</p>
      </div>
      <DashboardKPIs kpis={kpis} />
      <div className="grid gap-6 md:grid-cols-2">
        <FleetChart kpis={kpis} />
        <ExpenseChart data={expenseBreakdown} />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <RecentTrips trips={recentTrips} />
        <MaintenanceAlerts records={openMaintenance} />
        <LicenseAlerts drivers={expiringLicenses} />
      </div>
    </div>
  );
}
