"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import { MoreHorizontal, Play, CheckCircle, XCircle } from "lucide-react";
import { dispatchTripAction, cancelTripAction } from "@/actions/trips";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/format";
import type { Trip, Vehicle, Driver } from "@prisma/client";

type TripWithRelations = Trip & { vehicle: Vehicle; driver: Driver };

interface Props {
  trips: TripWithRelations[];
  total: number;
  page: number;
  onComplete: (trip: TripWithRelations) => void;
}

export function TripTable({ trips, total, page, onComplete }: Props) {
  const router = useRouter();
  const totalPages = Math.ceil(total / 20);

  async function handleDispatch(id: string) {
    const result = await dispatchTripAction(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Trip dispatched");
      router.refresh();
    }
  }

  async function handleCancel(id: string) {
    const result = await cancelTripAction(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Trip cancelled");
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Cargo (kg)</TableHead>
              <TableHead>Distance (km)</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((trip) => (
              <TableRow key={trip.id}>
                <TableCell className="font-medium">
                  {trip.source} → {trip.destination}
                </TableCell>
                <TableCell>{trip.vehicle.vehicleName}</TableCell>
                <TableCell>{trip.driver.name}</TableCell>
                <TableCell>{trip.cargoWeight}</TableCell>
                <TableCell>{trip.actualDistance || trip.plannedDistance}</TableCell>
                <TableCell>{formatCurrency(trip.revenue)}</TableCell>
                <TableCell><StatusBadge status={trip.status} /></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-8 w-8 hover:bg-muted">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {trip.status === "DRAFT" && (
                        <DropdownMenuItem onClick={() => handleDispatch(trip.id)}>
                          <Play className="h-4 w-4 mr-2" /> Dispatch
                        </DropdownMenuItem>
                      )}
                      {trip.status === "DISPATCHED" && (
                        <DropdownMenuItem onClick={() => onComplete(trip)}>
                          <CheckCircle className="h-4 w-4 mr-2" /> Complete
                        </DropdownMenuItem>
                      )}
                      {(trip.status === "DRAFT" || trip.status === "DISPATCHED") && (
                        <DropdownMenuItem className="text-destructive" onClick={() => handleCancel(trip.id)}>
                          <XCircle className="h-4 w-4 mr-2" /> Cancel
                        </DropdownMenuItem>
                      )}
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
          <p className="text-sm text-muted-foreground">{total} trips total</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1}
              onClick={() => router.push(`/trips?page=${page - 1}`)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages}
              onClick={() => router.push(`/trips?page=${page + 1}`)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
