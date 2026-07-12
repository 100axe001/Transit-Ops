import { fuelService, vehicleService } from "@/lib/services";
import { requirePageAccess } from "@/lib/auth/guard";
import { FuelClient } from "@/components/fuel/fuel-client";

interface Props {
  searchParams: Promise<{ vehicleId?: string; page?: string }>;
}

export default async function FuelPage({ searchParams }: Props) {
  await requirePageAccess("fuel:read");
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const [fuelData, vehicleData] = await Promise.all([
    fuelService.list({ vehicleId: params.vehicleId, page, pageSize: 20 }),
    vehicleService.list({ pageSize: 100 }),
  ]);

  return (
    <FuelClient
      logs={fuelData.logs}
      total={fuelData.total}
      page={page}
      vehicles={vehicleData.vehicles}
    />
  );
}
