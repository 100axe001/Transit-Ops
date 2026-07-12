import { driverRepository } from "@/lib/repositories";
import { driverSchema, DriverFormData } from "@/lib/validations";
import { DriverStatus } from "@prisma/client";

export const driverService = {
  async list(params?: { search?: string; status?: DriverStatus; page?: number; pageSize?: number }) {
    const [drivers, total] = await Promise.all([
      driverRepository.findAll(params),
      driverRepository.count(params),
    ]);
    return { drivers, total };
  },

  async getById(id: string) {
    const driver = await driverRepository.findById(id);
    if (!driver) throw new Error("Driver not found");
    return driver;
  },

  async create(data: DriverFormData) {
    const parsed = driverSchema.parse(data);
    return driverRepository.create(parsed);
  },

  async update(id: string, data: Partial<DriverFormData>) {
    const driver = await driverRepository.findById(id);
    if (!driver) throw new Error("Driver not found");
    return driverRepository.update(id, data);
  },

  async delete(id: string) {
    return driverRepository.delete(id);
  },

  async getDispatchable() {
    return driverRepository.findDispatchable();
  },

  async getExpiringLicenses(days = 30) {
    return driverRepository.findExpiringLicenses(days);
  },

  async getStatusCounts() {
    return driverRepository.countByStatus();
  },
};
