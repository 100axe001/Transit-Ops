import { expenseRepository, vehicleRepository } from "@/lib/repositories";
import { expenseSchema, ExpenseFormData } from "@/lib/validations";
import { ExpenseType } from "@prisma/client";

export const expenseService = {
  async list(params?: { vehicleId?: string; type?: ExpenseType; page?: number; pageSize?: number }) {
    const [expenses, total] = await Promise.all([
      expenseRepository.findAll(params),
      expenseRepository.count(params),
    ]);
    return { expenses, total };
  },

  async getById(id: string) {
    const expense = await expenseRepository.findById(id);
    if (!expense) throw new Error("Expense not found");
    return expense;
  },

  async create(data: ExpenseFormData) {
    const parsed = expenseSchema.parse(data);

    const vehicle = await vehicleRepository.findById(parsed.vehicleId);
    if (!vehicle) throw new Error("Vehicle not found");

    return expenseRepository.create({
      type: parsed.type,
      amount: parsed.amount,
      description: parsed.description,
      date: parsed.date,
      vehicle: { connect: { id: parsed.vehicleId } },
    });
  },

  async update(id: string, data: Partial<ExpenseFormData>) {
    return expenseRepository.update(id, data);
  },

  async delete(id: string) {
    return expenseRepository.delete(id);
  },

  async getTotalByType() {
    return expenseRepository.getTotalByType();
  },

  async getTotal() {
    const result = await expenseRepository.getTotal();
    return result._sum.amount || 0;
  },
};
