import { driverService } from "@/lib/services";
import { DriverStatus } from "@prisma/client";
import { requirePageAccess } from "@/lib/auth/guard";
import { DriversClient } from "@/components/drivers/drivers-client";

interface Props {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}

export default async function DriversPage({ searchParams }: Props) {
  await requirePageAccess("drivers:read");
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { drivers, total } = await driverService.list({
    search: params.search,
    status: params.status as DriverStatus | undefined,
    page,
    pageSize: 20,
  });

  return <DriversClient drivers={drivers} total={total} page={page} />;
}
