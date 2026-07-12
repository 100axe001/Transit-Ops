import { fuelRepository, vehicleRepository } from "@/lib/repositories";
import { fuelLogSchema, FuelLogFormData } from "@/lib/validations";

export const fuelService = {
  async list(params?: { vehicleId?: string; page?: number; pageSize?: number }) {
    const [logs, total] = await Promise.all([
      fuelRepository.findAll(params),
      fuelRepository.count(params),
    ]);
    return { logs, total };
  },

  async getById(id: string) {
    const log = await fuelRepository.findById(id);
    if (!log) throw new Error("Fuel log not found");
    return log;
  },

  async create(data: FuelLogFormData) {
    const parsed = fuelLogSchema.parse(data);

    const vehicle = await vehicleRepository.findById(parsed.vehicleId);
    if (!vehicle) throw new Error("Vehicle not found");

    return fuelRepository.create({
      liters: parsed.liters,
      cost: parsed.cost,
      date: parsed.date,
      odometer: parsed.odometer,
      vehicle: { connect: { id: parsed.vehicleId } },
    });
  },

  async update(id: string, data: Partial<FuelLogFormData>) {
    return fuelRepository.update(id, data);
  },

  async delete(id: string) {
    return fuelRepository.delete(id);
  },

  async getTotalCost() {
    const result = await fuelRepository.getTotalCost();
    return { cost: result._sum.cost || 0, liters: result._sum.liters || 0 };
  },
};
