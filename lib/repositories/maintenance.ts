import { prisma } from "@/lib/prisma";
import { MaintenanceStatus, Prisma } from "@prisma/client";

export const maintenanceRepository = {
  findAll(params?: {
    search?: string;
    status?: MaintenanceStatus;
    page?: number;
    pageSize?: number;
  }) {
    const { search, status, page = 1, pageSize = 20 } = params || {};
    const where: Prisma.MaintenanceWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;

    return prisma.maintenance.findMany({
      where,
      include: { vehicle: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });
  },

  count(params?: { search?: string; status?: MaintenanceStatus }) {
    const { search, status } = params || {};
    const where: Prisma.MaintenanceWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;

    return prisma.maintenance.count({ where });
  },

  findById(id: string) {
    return prisma.maintenance.findUnique({
      where: { id },
      include: { vehicle: true },
    });
  },

  findOpenByVehicle(vehicleId: string) {
    return prisma.maintenance.findMany({
      where: { vehicleId, status: "OPEN" },
      include: { vehicle: true },
    });
  },

  findOpen() {
    return prisma.maintenance.findMany({
      where: { status: "OPEN" },
      include: { vehicle: true },
      orderBy: { openedAt: "desc" },
    });
  },

  create(data: Prisma.MaintenanceCreateInput) {
    return prisma.maintenance.create({
      data,
      include: { vehicle: true },
    });
  },

  update(id: string, data: Prisma.MaintenanceUpdateInput) {
    return prisma.maintenance.update({
      where: { id },
      data,
      include: { vehicle: true },
    });
  },

  delete(id: string) {
    return prisma.maintenance.delete({ where: { id } });
  },

  getTotalCost() {
    return prisma.maintenance.aggregate({
      _sum: { cost: true },
    });
  },
};
