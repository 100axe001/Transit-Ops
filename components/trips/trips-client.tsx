"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Route } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { TripTable } from "./trip-table";
import { TripDialog } from "./trip-dialog";
import { CompleteTripDialog } from "./complete-trip-dialog";
import { tripStatuses } from "@/lib/constants";
import type { Trip, Vehicle, Driver } from "@prisma/client";

type TripWithRelations = Trip & { vehicle: Vehicle; driver: Driver };

interface Props {
  trips: TripWithRelations[];
  total: number;
  page: number;
  availableVehicles: Vehicle[];
  availableDrivers: Driver[];
}

export function TripsClient({ trips, total, page, availableVehicles, availableDrivers }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripWithRelations | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("search", value);
    else params.delete("search");
    params.delete("page");
    router.push(`/trips?${params.toString()}`);
  }

  function handleStatusFilter(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set("status", value);
    else params.delete("status");
    params.delete("page");
    router.push(`/trips?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Trips" description="Manage dispatch and trip operations">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create Trip
        </Button>
      </PageHeader>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trips..."
            className="pl-9"
            defaultValue={searchParams.get("search") || ""}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select defaultValue={searchParams.get("status") || "all"} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {tripStatuses.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {trips.length === 0 ? (
        <EmptyState icon={Route} title="No trips found" description="Create your first trip to dispatch vehicles">
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Trip
          </Button>
        </EmptyState>
      ) : (
        <TripTable
          trips={trips}
          total={total}
          page={page}
          onComplete={(trip) => { setSelectedTrip(trip); setCompleteDialogOpen(true); }}
        />
      )}

      <TripDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehicles={availableVehicles}
        drivers={availableDrivers}
      />

      <CompleteTripDialog
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        trip={selectedTrip}
      />
    </div>
  );
}
