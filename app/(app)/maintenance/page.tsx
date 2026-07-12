import { maintenanceService, vehicleService } from "@/lib/services";
import { MaintenanceStatus } from "@prisma/client";
import { requirePageAccess } from "@/lib/auth/guard";
import { MaintenanceClient } from "@/components/maintenance/maintenance-client";

interface Props {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}

export default async function MaintenancePage({ searchParams }: Props) {
  await requirePageAccess("maintenance:read");
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const [maintenanceData, vehicles] = await Promise.all([
    maintenanceService.list({
      search: params.search,
      status: params.status as MaintenanceStatus | undefined,
      page,
      pageSize: 20,
    }),
    vehicleService.list({ pageSize: 100 }),
  ]);

  return (
    <MaintenanceClient
      records={maintenanceData.records}
      total={maintenanceData.total}
      page={page}
      vehicles={vehicles.vehicles}
    />
  );
}
