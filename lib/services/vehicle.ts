import { vehicleRepository } from "@/lib/repositories";
import { vehicleSchema, VehicleFormData } from "@/lib/validations";
import { VehicleStatus } from "@prisma/client";

export const vehicleService = {
  async list(params?: { search?: string; status?: VehicleStatus; type?: string; page?: number; pageSize?: number }) {
    const [vehicles, total] = await Promise.all([
      vehicleRepository.findAll(params),
      vehicleRepository.count(params),
    ]);
    return { vehicles, total };
  },

  async getById(id: string) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) throw new Error("Vehicle not found");
    return vehicle;
  },

  async create(data: VehicleFormData) {
    const parsed = vehicleSchema.parse(data);
    const existing = await vehicleRepository.findByRegistration(parsed.registrationNumber);
    if (existing) throw new Error("Registration number already exists");
    return vehicleRepository.create(parsed);
  },

  async update(id: string, data: Partial<VehicleFormData>) {
    const vehicle = await vehicleRepository.findById(id);
    if (!vehicle) throw new Error("Vehicle not found");

    if (data.registrationNumber && data.registrationNumber !== vehicle.registrationNumber) {
      const existing = await vehicleRepository.findByRegistration(data.registrationNumber);
      if (existing) throw new Error("Registration number already exists");
    }

    return vehicleRepository.update(id, data);
  },

  async delete(id: string) {
    return vehicleRepository.delete(id);
  },

  async getDispatchable() {
    return vehicleRepository.findDispatchable();
  },

  async getStatusCounts() {
    return vehicleRepository.countByStatus();
  },
};
