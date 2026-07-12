import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const biltyRepository = {
  findAll(params?: { search?: string; page?: number; pageSize?: number }) {
    const { search, page = 1, pageSize = 20 } = params || {};
    const where: Prisma.BiltyWhereInput = {};
    if (search) {
      where.OR = [
        { biltyNumber: { contains: search, mode: "insensitive" } },
        { fromLocation: { contains: search, mode: "insensitive" } },
        { toLocation: { contains: search, mode: "insensitive" } },
        { goodsDesc: { contains: search, mode: "insensitive" } },
      ];
    }
    return prisma.bilty.findMany({
      where,
      include: { consignor: true, consignee: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { date: "desc" },
    });
  },

  count(params?: { search?: string }) {
    const { search } = params || {};
    const where: Prisma.BiltyWhereInput = {};
    if (search) {
      where.OR = [
        { biltyNumber: { contains: search, mode: "insensitive" } },
        { goodsDesc: { contains: search, mode: "insensitive" } },
      ];
    }
    return prisma.bilty.count({ where });
  },

  findById(id: string) {
    return prisma.bilty.findUnique({
      where: { id },
      include: { consignor: true, consignee: true, trip: true },
    });
  },
};
