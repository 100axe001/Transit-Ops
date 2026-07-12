import { tripService, vehicleService, driverService } from "@/lib/services";
import { TripStatus } from "@prisma/client";
import { requirePageAccess } from "@/lib/auth/guard";
import { TripsClient } from "@/components/trips/trips-client";

interface Props {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}

export default async function TripsPage({ searchParams }: Props) {
  await requirePageAccess("trips:read");
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const [tripData, availableVehicles, availableDrivers] = await Promise.all([
    tripService.list({
      search: params.search,
      status: params.status as TripStatus | undefined,
      page,
      pageSize: 20,
    }),
    vehicleService.getDispatchable(),
    driverService.getDispatchable(),
  ]);

  return (
    <TripsClient
      trips={tripData.trips}
      total={tripData.total}
      page={page}
      availableVehicles={availableVehicles}
      availableDrivers={availableDrivers}
    />
  );
}
