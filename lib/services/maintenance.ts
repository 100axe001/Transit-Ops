import { maintenanceRepository, vehicleRepository } from "@/lib/repositories";
import { maintenanceSchema, MaintenanceFormData } from "@/lib/validations";
import { canCloseMaintenance, canOpenMaintenance } from "@/lib/domain/maintenance";
import { getVehicleStatusAfterMaintenanceOpen, getVehicleStatusAfterMaintenanceClose } from "@/lib/domain/vehicle";
import { MaintenanceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const maintenanceService = {
  async list(params?: { search?: string; status?: MaintenanceStatus; page?: number; pageSize?: number }) {
    const [records, total] = await Promise.all([
      maintenanceRepository.findAll(params),
      maintenanceRepository.count(params),
    ]);
    return { records, total };
  },

  async getById(id: string) {
    const record = await maintenanceRepository.findById(id);
    if (!record) throw new Error("Maintenance record not found");
    return record;
  },

  async getOpen() {
    return maintenanceRepository.findOpen();
  },

  async create(data: MaintenanceFormData) {
    const parsed = maintenanceSchema.parse(data);

    const vehicle = await vehicleRepository.findById(parsed.vehicleId);
    if (!vehicle) throw new Error("Vehicle not found");

    const check = canOpenMaintenance(vehicle.status);
    if (!check.valid) throw new Error(check.error);

    return prisma.$transaction(async (tx) => {
      await tx.vehicle.update({
        where: { id: parsed.vehicleId },
        data: { status: getVehicleStatusAfterMaintenanceOpen() },
      });
      return tx.maintenance.create({
        data: {
          title: parsed.title,
          description: parsed.description,
          cost: parsed.cost,
          vehicle: { connect: { id: parsed.vehicleId } },
        },
        include: { vehicle: true },
      });
    });
  },

  async close(id: string) {
    const record = await maintenanceRepository.findById(id);
    if (!record) throw new Error("Maintenance record not found");

    const check = canCloseMaintenance(record.status);
    if (!check.valid) throw new Error(check.error);

    const vehicle = await vehicleRepository.findById(record.vehicleId);
    if (!vehicle) throw new Error("Vehicle not found");

    return prisma.$transaction(async (tx) => {
      await tx.vehicle.update({
        where: { id: record.vehicleId },
        data: { status: getVehicleStatusAfterMaintenanceClose(vehicle.status) },
      });
      return tx.maintenance.update({
        where: { id },
        data: { status: "CLOSED", closedAt: new Date() },
        include: { vehicle: true },
      });
    });
  },

  async delete(id: string) {
    return maintenanceRepository.delete(id);
  },

  async getTotalCost() {
    const result = await maintenanceRepository.getTotalCost();
    return result._sum.cost || 0;
  },
};
