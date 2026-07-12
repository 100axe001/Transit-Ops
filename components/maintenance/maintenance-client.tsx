"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Wrench, Search } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { MaintenanceTable } from "./maintenance-table";
import { MaintenanceDialog } from "./maintenance-dialog";
import type { Maintenance, Vehicle } from "@prisma/client";

type MaintenanceWithVehicle = Maintenance & { vehicle: Vehicle };

interface Props {
  records: MaintenanceWithVehicle[];
  total: number;
  page: number;
  vehicles: Vehicle[];
}

const maintenanceStatuses = [
  { value: "OPEN", label: "Open" },
  { value: "CLOSED", label: "Closed" },
];

export function MaintenanceClient({ records, total, page, vehicles }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("search", value);
    else params.delete("search");
    params.delete("page");
    router.push(`/maintenance?${params.toString()}`);
  }

  function handleStatusFilter(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set("status", value);
    else params.delete("status");
    params.delete("page");
    router.push(`/maintenance?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Maintenance" description="Track vehicle maintenance records">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Record
        </Button>
      </PageHeader>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search maintenance..."
            className="pl-9"
            defaultValue={searchParams.get("search") || ""}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select
          defaultValue={searchParams.get("status") || "all"}
          onValueChange={handleStatusFilter}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {maintenanceStatuses.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {records.length === 0 ? (
        <EmptyState icon={Wrench} title="No maintenance records" description="Create a maintenance record when a vehicle needs service">
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Record
          </Button>
        </EmptyState>
      ) : (
        <MaintenanceTable records={records} total={total} page={page} />
      )}

      <MaintenanceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehicles={vehicles.filter(v => v.status !== "ON_TRIP")}
      />
    </div>
  );
}
