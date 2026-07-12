"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Receipt, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ExpenseDialog } from "./expense-dialog";
import { deleteExpenseAction } from "@/actions/expenses";
import { expenseTypes } from "@/lib/constants";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Expense, Vehicle } from "@prisma/client";

type ExpenseWithVehicle = Expense & { vehicle: Vehicle };

interface Props {
  expenses: ExpenseWithVehicle[];
  total: number;
  page: number;
  vehicles: Vehicle[];
}

export function ExpensesClient({ expenses, total, page, vehicles }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / 20);

  function handleTypeFilter(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set("type", value);
    else params.delete("type");
    params.delete("page");
    router.push(`/expenses?${params.toString()}`);
  }

  async function handleDelete(id: string) {
    const result = await deleteExpenseAction(id);
    if (result.error) toast.error(result.error);
    else { toast.success("Expense deleted"); router.refresh(); }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Expenses" description="Track operational expenses">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Expense
        </Button>
      </PageHeader>

      <div className="flex items-center gap-4">
        <Select defaultValue={searchParams.get("type") || "all"} onValueChange={handleTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {expenseTypes.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {expenses.length === 0 ? (
        <EmptyState icon={Receipt} title="No expenses found" description="Record expenses to track costs">
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Expense
          </Button>
        </EmptyState>
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.vehicle.vehicleName}</TableCell>
                    <TableCell>{expense.type}</TableCell>
                    <TableCell>${expense.amount.toFixed(2)}</TableCell>
                    <TableCell>{expense.description || "—"}</TableCell>
                    <TableCell>{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{total} expenses total</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1}
                  onClick={() => router.push(`/expenses?page=${page - 1}`)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages}
                  onClick={() => router.push(`/expenses?page=${page + 1}`)}>Next</Button>
              </div>
            </div>
          )}
        </div>
      )}

      <ExpenseDialog open={dialogOpen} onOpenChange={setDialogOpen} vehicles={vehicles} />
    </div>
  );
}
