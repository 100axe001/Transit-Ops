import { fuelService, vehicleService } from "@/lib/services";
import { FuelClient } from "@/components/fuel/fuel-client";

interface Props {
  searchParams: Promise<{ vehicleId?: string; page?: string }>;
}

export default async function FuelPage({ searchParams }: Props) {
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
