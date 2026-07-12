"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Fuel } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { FuelDialog } from "./fuel-dialog";
import { deleteFuelLogAction } from "@/actions/fuel";
import { toast } from "sonner";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { formatCurrency, formatKm, formatLiters } from "@/lib/format";
import type { FuelLog, Vehicle } from "@prisma/client";

type FuelLogWithVehicle = FuelLog & { vehicle: Vehicle };

interface Props {
  logs: FuelLogWithVehicle[];
  total: number;
  page: number;
  vehicles: Vehicle[];
}

export function FuelClient({ logs, total, page, vehicles }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / 20);

  function handleVehicleFilter(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set("vehicleId", value);
    else params.delete("vehicleId");
    params.delete("page");
    router.push(`/fuel?${params.toString()}`);
  }

  async function handleDelete(id: string) {
    const result = await deleteFuelLogAction(id);
    if (result.error) toast.error(result.error);
    else { toast.success("Fuel log deleted"); router.refresh(); }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Fuel Logs" description="Track fuel consumption across your fleet">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Log Fuel
        </Button>
      </PageHeader>

      <div className="flex items-center gap-4">
        <Select
          defaultValue={searchParams.get("vehicleId") || "all"}
          onValueChange={handleVehicleFilter}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All Vehicles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vehicles</SelectItem>
            {vehicles.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.vehicleName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {logs.length === 0 ? (
        <EmptyState icon={Fuel} title="No fuel logs" description="Start logging fuel to track consumption">
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Log Fuel
          </Button>
        </EmptyState>
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Liters</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Odometer</TableHead>
                  <TableHead>₹/L</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.vehicle.vehicleName}</TableCell>
                    <TableCell>{format(new Date(log.date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{formatLiters(log.liters)}</TableCell>
                    <TableCell>{formatCurrency(log.cost, { decimals: true })}</TableCell>
                    <TableCell>{formatKm(log.odometer)}</TableCell>
                    <TableCell>{formatCurrency(log.cost / log.liters, { decimals: true })}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(log.id)}>
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
              <p className="text-sm text-muted-foreground">{total} logs total</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1}
                  onClick={() => router.push(`/fuel?page=${page - 1}`)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages}
                  onClick={() => router.push(`/fuel?page=${page + 1}`)}>Next</Button>
              </div>
            </div>
          )}
        </div>
      )}

      <FuelDialog open={dialogOpen} onOpenChange={setDialogOpen} vehicles={vehicles} />
    </div>
  );
}
