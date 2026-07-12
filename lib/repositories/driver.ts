import { prisma } from "@/lib/prisma";
import { DriverStatus, Prisma } from "@prisma/client";

export const driverRepository = {
  findAll(params?: {
    search?: string;
    status?: DriverStatus;
    page?: number;
    pageSize?: number;
  }) {
    const { search, status, page = 1, pageSize = 20 } = params || {};
    const where: Prisma.DriverWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { licenseNumber: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;

    return prisma.driver.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });
  },

  count(params?: { search?: string; status?: DriverStatus }) {
    const { search, status } = params || {};
    const where: Prisma.DriverWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { licenseNumber: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;

    return prisma.driver.count({ where });
  },

  findById(id: string) {
    return prisma.driver.findUnique({ where: { id } });
  },

  findDispatchable() {
    return prisma.driver.findMany({
      where: {
        status: "AVAILABLE",
        expiryDate: { gt: new Date() },
      },
      orderBy: { name: "asc" },
    });
  },

  findExpiringLicenses(daysThreshold = 30) {
    const threshold = new Date();
    threshold.setDate(threshold.getDate() + daysThreshold);
    return prisma.driver.findMany({
      where: {
        expiryDate: { lte: threshold, gt: new Date() },
      },
      orderBy: { expiryDate: "asc" },
    });
  },

  create(data: Prisma.DriverCreateInput) {
    return prisma.driver.create({ data });
  },

  update(id: string, data: Prisma.DriverUpdateInput) {
    return prisma.driver.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.driver.delete({ where: { id } });
  },

  countByStatus() {
    return prisma.driver.groupBy({
      by: ["status"],
      _count: true,
    });
  },
};
