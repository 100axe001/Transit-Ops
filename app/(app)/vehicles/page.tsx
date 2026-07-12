import { vehicleService } from "@/lib/services";
import { VehicleStatus } from "@prisma/client";
import { VehiclesClient } from "@/components/vehicles/vehicles-client";

interface Props {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}

export default async function VehiclesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { vehicles, total } = await vehicleService.list({
    search: params.search,
    status: params.status as VehicleStatus | undefined,
    page,
    pageSize: 20,
  });

  return <VehiclesClient vehicles={vehicles} total={total} page={page} />;
}
