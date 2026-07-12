"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Truck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { VehicleTable } from "./vehicle-table";
import { VehicleDialog } from "./vehicle-dialog";
import { vehicleStatuses } from "@/lib/constants";
import type { Vehicle } from "@prisma/client";

interface Props {
  vehicles: Vehicle[];
  total: number;
  page: number;
}

export function VehiclesClient({ vehicles, total, page }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("search", value);
    else params.delete("search");
    params.delete("page");
    router.push(`/vehicles?${params.toString()}`);
  }

  function handleStatusFilter(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set("status", value);
    else params.delete("status");
    params.delete("page");
    router.push(`/vehicles?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Vehicles" description="Manage your fleet vehicles">
        <Button onClick={() => { setEditVehicle(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Vehicle
        </Button>
      </PageHeader>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vehicles..."
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
            {vehicleStatuses.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {vehicles.length === 0 ? (
        <EmptyState icon={Truck} title="No vehicles found" description="Add your first vehicle to get started">
          <Button onClick={() => { setEditVehicle(null); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Vehicle
          </Button>
        </EmptyState>
      ) : (
        <VehicleTable
          vehicles={vehicles}
          total={total}
          page={page}
          onEdit={(v) => { setEditVehicle(v); setDialogOpen(true); }}
        />
      )}

      <VehicleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehicle={editVehicle}
      />
    </div>
  );
}
