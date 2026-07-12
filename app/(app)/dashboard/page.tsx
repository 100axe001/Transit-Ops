import { analyticsService, billingService } from "@/lib/services";
import { tripRepository } from "@/lib/repositories";
import { driverRepository } from "@/lib/repositories";
import { maintenanceRepository } from "@/lib/repositories";
import { VehicleType, VehicleStatus } from "@prisma/client";
import { DashboardKPIs } from "@/components/dashboard/kpis";
import { BillingKPIs } from "@/components/dashboard/billing-kpis";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { VehicleStatusBars } from "@/components/dashboard/vehicle-status-bars";
import { CostOverview } from "@/components/dashboard/cost-overview";
import { RecentTrips } from "@/components/dashboard/recent-trips";
import { MaintenanceAlerts } from "@/components/dashboard/maintenance-alerts";
import { LicenseAlerts } from "@/components/dashboard/license-alerts";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { requirePageAccess } from "@/lib/auth/guard";

interface Props {
  searchParams: Promise<{ type?: string; status?: string; region?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  await requirePageAccess("dashboard:read");
  const params = await searchParams;
  const filters = {
    vehicleType: params.type as VehicleType | undefined,
    status: params.status as VehicleStatus | undefined,
    region: params.region,
  };

  const [kpis, billingKpis, regions, recentTrips, openMaintenance, expiringLicenses, expenseBreakdown] =
    await Promise.all([
      analyticsService.getDashboardKPIs(filters),
      billingService.getBillingKPIs(),
      analyticsService.getVehicleRegions(),
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

      <DashboardFilters regions={regions} />

      <DashboardKPIs kpis={kpis} />

      <BillingKPIs
        biltysToday={billingKpis.biltysToday}
        freightToday={billingKpis.freightToday}
        totalOutstanding={billingKpis.totalOutstanding}
      />

      <CostOverview costs={kpis.costs} revenue={kpis.revenue} />

      <div className="grid gap-6 md:grid-cols-2">
        <VehicleStatusBars kpis={kpis} />
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
