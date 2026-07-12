import { expenseService, vehicleService } from "@/lib/services";
import { ExpenseType } from "@prisma/client";
import { ExpensesClient } from "@/components/expenses/expenses-client";

interface Props {
  searchParams: Promise<{ type?: string; page?: string }>;
}

export default async function ExpensesPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const [expenseData, vehicleData] = await Promise.all([
    expenseService.list({ type: params.type as ExpenseType | undefined, page, pageSize: 20 }),
    vehicleService.list({ pageSize: 100 }),
  ]);

  return (
    <ExpensesClient
      expenses={expenseData.expenses}
      total={expenseData.total}
      page={page}
      vehicles={vehicleData.vehicles}
    />
  );
}
