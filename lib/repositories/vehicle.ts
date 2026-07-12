import { prisma } from "@/lib/prisma";
import { VehicleStatus, Prisma } from "@prisma/client";

export const vehicleRepository = {
  findAll(params?: {
    search?: string;
    status?: VehicleStatus;
    type?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { search, status, type, page = 1, pageSize = 20 } = params || {};
    const where: Prisma.VehicleWhereInput = {};

    if (search) {
      where.OR = [
        { registrationNumber: { contains: search, mode: "insensitive" } },
        { vehicleName: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;
    if (type) where.vehicleType = type as Prisma.EnumVehicleTypeFilter;

    return prisma.vehicle.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });
  },

  count(params?: { search?: string; status?: VehicleStatus; type?: string }) {
    const { search, status, type } = params || {};
    const where: Prisma.VehicleWhereInput = {};

    if (search) {
      where.OR = [
        { registrationNumber: { contains: search, mode: "insensitive" } },
        { vehicleName: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;
    if (type) where.vehicleType = type as Prisma.EnumVehicleTypeFilter;

    return prisma.vehicle.count({ where });
  },

  findById(id: string) {
    return prisma.vehicle.findUnique({ where: { id } });
  },

  findByRegistration(registrationNumber: string) {
    return prisma.vehicle.findUnique({ where: { registrationNumber } });
  },

  findDispatchable() {
    return prisma.vehicle.findMany({
      where: { status: "AVAILABLE" },
      orderBy: { vehicleName: "asc" },
    });
  },

  create(data: Prisma.VehicleCreateInput) {
    return prisma.vehicle.create({ data });
  },

  update(id: string, data: Prisma.VehicleUpdateInput) {
    return prisma.vehicle.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.vehicle.delete({ where: { id } });
  },

  countByStatus() {
    return prisma.vehicle.groupBy({
      by: ["status"],
      _count: true,
    });
  },
};
