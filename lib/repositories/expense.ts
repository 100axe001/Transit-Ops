import { prisma } from "@/lib/prisma";
import { ExpenseType, Prisma } from "@prisma/client";

export const expenseRepository = {
  findAll(params?: {
    vehicleId?: string;
    type?: ExpenseType;
    page?: number;
    pageSize?: number;
  }) {
    const { vehicleId, type, page = 1, pageSize = 20 } = params || {};
    const where: Prisma.ExpenseWhereInput = {};

    if (vehicleId) where.vehicleId = vehicleId;
    if (type) where.type = type;

    return prisma.expense.findMany({
      where,
      include: { vehicle: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { date: "desc" },
    });
  },

  count(params?: { vehicleId?: string; type?: ExpenseType }) {
    const where: Prisma.ExpenseWhereInput = {};
    if (params?.vehicleId) where.vehicleId = params.vehicleId;
    if (params?.type) where.type = params.type;
    return prisma.expense.count({ where });
  },

  findById(id: string) {
    return prisma.expense.findUnique({
      where: { id },
      include: { vehicle: true },
    });
  },

  create(data: Prisma.ExpenseCreateInput) {
    return prisma.expense.create({
      data,
      include: { vehicle: true },
    });
  },

  update(id: string, data: Prisma.ExpenseUpdateInput) {
    return prisma.expense.update({
      where: { id },
      data,
      include: { vehicle: true },
    });
  },

  delete(id: string) {
    return prisma.expense.delete({ where: { id } });
  },

  getTotalByType() {
    return prisma.expense.groupBy({
      by: ["type"],
      _sum: { amount: true },
    });
  },

  getTotal() {
    return prisma.expense.aggregate({
      _sum: { amount: true },
    });
  },
};
