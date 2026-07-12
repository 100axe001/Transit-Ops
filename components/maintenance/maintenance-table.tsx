"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { CheckCircle } from "lucide-react";
import { closeMaintenanceAction } from "@/actions/maintenance";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import type { Maintenance, Vehicle } from "@prisma/client";

type MaintenanceWithVehicle = Maintenance & { vehicle: Vehicle };

interface Props {
  records: MaintenanceWithVehicle[];
  total: number;
  page: number;
}

export function MaintenanceTable({ records, total, page }: Props) {
  const router = useRouter();
  const totalPages = Math.ceil(total / 20);

  async function handleClose(id: string) {
    const result = await closeMaintenanceAction(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Maintenance closed - vehicle available");
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Opened</TableHead>
              <TableHead>Closed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.title}</TableCell>
                <TableCell>{record.vehicle.vehicleName} ({record.vehicle.registrationNumber})</TableCell>
                <TableCell>${record.cost.toLocaleString()}</TableCell>
                <TableCell>{format(new Date(record.openedAt), "MMM d, yyyy")}</TableCell>
                <TableCell>{record.closedAt ? format(new Date(record.closedAt), "MMM d, yyyy") : "—"}</TableCell>
                <TableCell><StatusBadge status={record.status} /></TableCell>
                <TableCell>
                  {record.status === "OPEN" && (
                    <Button size="sm" variant="outline" onClick={() => handleClose(record.id)}>
                      <CheckCircle className="h-3 w-3 mr-1" /> Close
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{total} records total</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1}
              onClick={() => router.push(`/maintenance?page=${page - 1}`)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages}
              onClick={() => router.push(`/maintenance?page=${page + 1}`)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
