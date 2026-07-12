import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const partyRepository = {
  findAll(params?: { search?: string; page?: number; pageSize?: number }) {
    const { search, page = 1, pageSize = 20 } = params || {};
    const where: Prisma.PartyWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { gst: { contains: search, mode: "insensitive" } },
      ];
    }
    return prisma.party.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { name: "asc" },
    });
  },

  count(params?: { search?: string }) {
    const { search } = params || {};
    const where: Prisma.PartyWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }
    return prisma.party.count({ where });
  },

  findById(id: string) {
    return prisma.party.findUnique({ where: { id } });
  },

  findAllSimple() {
    return prisma.party.findMany({ orderBy: { name: "asc" } });
  },

  create(data: Prisma.PartyCreateInput) {
    return prisma.party.create({ data });
  },

  update(id: string, data: Prisma.PartyUpdateInput) {
    return prisma.party.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.party.delete({ where: { id } });
  },

  async ledger(id: string) {
    const [party, billed, received] = await Promise.all([
      prisma.party.findUnique({ where: { id } }),
      prisma.bilty.aggregate({ where: { consignorId: id }, _sum: { total: true } }),
      prisma.payment.aggregate({ where: { partyId: id }, _sum: { amount: true } }),
    ]);
    return {
      party,
      totalBilled: billed._sum.total || 0,
      totalReceived: received._sum.amount || 0,
    };
  },
};
