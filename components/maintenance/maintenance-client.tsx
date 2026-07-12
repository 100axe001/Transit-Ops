"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";
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

export function MaintenanceClient({ records, total, page, vehicles }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="space-y-6">
      <PageHeader title="Maintenance" description="Track vehicle maintenance records">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Record
        </Button>
      </PageHeader>

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
