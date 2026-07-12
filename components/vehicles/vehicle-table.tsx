"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { deleteVehicleAction } from "@/actions/vehicles";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Vehicle } from "@prisma/client";

interface Props {
  vehicles: Vehicle[];
  total: number;
  page: number;
  onEdit: (vehicle: Vehicle) => void;
}

export function VehicleTable({ vehicles, total, page, onEdit }: Props) {
  const router = useRouter();
  const totalPages = Math.ceil(total / 20);

  async function handleDelete(id: string) {
    const result = await deleteVehicleAction(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Vehicle deleted");
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Capacity (kg)</TableHead>
              <TableHead>Odometer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.registrationNumber}</TableCell>
                <TableCell>{vehicle.vehicleName}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.vehicleType}</TableCell>
                <TableCell>{vehicle.maximumLoadCapacity}</TableCell>
                <TableCell>{vehicle.odometer.toLocaleString()} km</TableCell>
                <TableCell><StatusBadge status={vehicle.status} /></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-8 w-8 hover:bg-muted">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(vehicle)}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(vehicle.id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{total} vehicles total</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1}
              onClick={() => router.push(`/vehicles?page=${page - 1}`)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages}
              onClick={() => router.push(`/vehicles?page=${page + 1}`)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
