import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const fuelRepository = {
  findAll(params?: {
    vehicleId?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { vehicleId, page = 1, pageSize = 20 } = params || {};
    const where: Prisma.FuelLogWhereInput = {};

    if (vehicleId) where.vehicleId = vehicleId;

    return prisma.fuelLog.findMany({
      where,
      include: { vehicle: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { date: "desc" },
    });
  },

  count(params?: { vehicleId?: string }) {
    const where: Prisma.FuelLogWhereInput = {};
    if (params?.vehicleId) where.vehicleId = params.vehicleId;
    return prisma.fuelLog.count({ where });
  },

  findById(id: string) {
    return prisma.fuelLog.findUnique({
      where: { id },
      include: { vehicle: true },
    });
  },

  create(data: Prisma.FuelLogCreateInput) {
    return prisma.fuelLog.create({
      data,
      include: { vehicle: true },
    });
  },

  update(id: string, data: Prisma.FuelLogUpdateInput) {
    return prisma.fuelLog.update({
      where: { id },
      data,
      include: { vehicle: true },
    });
  },

  delete(id: string) {
    return prisma.fuelLog.delete({ where: { id } });
  },

  getTotalCost() {
    return prisma.fuelLog.aggregate({
      _sum: { cost: true, liters: true },
    });
  },

  getCostByVehicle(vehicleId: string) {
    return prisma.fuelLog.aggregate({
      where: { vehicleId },
      _sum: { cost: true, liters: true },
    });
  },
};
