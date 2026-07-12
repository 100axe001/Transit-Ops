import { prisma } from "@/lib/prisma";
import { TripStatus, Prisma } from "@prisma/client";

export const tripRepository = {
  findAll(params?: {
    search?: string;
    status?: TripStatus;
    page?: number;
    pageSize?: number;
  }) {
    const { search, status, page = 1, pageSize = 20 } = params || {};
    const where: Prisma.TripWhereInput = {};

    if (search) {
      where.OR = [
        { source: { contains: search, mode: "insensitive" } },
        { destination: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;

    return prisma.trip.findMany({
      where,
      include: { vehicle: true, driver: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });
  },

  count(params?: { search?: string; status?: TripStatus }) {
    const { search, status } = params || {};
    const where: Prisma.TripWhereInput = {};

    if (search) {
      where.OR = [
        { source: { contains: search, mode: "insensitive" } },
        { destination: { contains: search, mode: "insensitive" } },
      ];
    }
    if (status) where.status = status;

    return prisma.trip.count({ where });
  },

  findById(id: string) {
    return prisma.trip.findUnique({
      where: { id },
      include: { vehicle: true, driver: true },
    });
  },

  findRecent(limit = 5) {
    return prisma.trip.findMany({
      include: { vehicle: true, driver: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  create(data: Prisma.TripCreateInput) {
    return prisma.trip.create({
      data,
      include: { vehicle: true, driver: true },
    });
  },

  update(id: string, data: Prisma.TripUpdateInput) {
    return prisma.trip.update({
      where: { id },
      data,
      include: { vehicle: true, driver: true },
    });
  },

  delete(id: string) {
    return prisma.trip.delete({ where: { id } });
  },

  countByStatus() {
    return prisma.trip.groupBy({
      by: ["status"],
      _count: true,
    });
  },

  getTotalRevenue() {
    return prisma.trip.aggregate({
      where: { status: "COMPLETED" },
      _sum: { revenue: true },
    });
  },
};
