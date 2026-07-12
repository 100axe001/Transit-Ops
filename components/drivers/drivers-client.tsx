"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { DriverTable } from "./driver-table";
import { DriverDialog } from "./driver-dialog";
import { driverStatuses } from "@/lib/constants";
import type { Driver } from "@prisma/client";

interface Props {
  drivers: Driver[];
  total: number;
  page: number;
}

export function DriversClient({ drivers, total, page }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("search", value);
    else params.delete("search");
    params.delete("page");
    router.push(`/drivers?${params.toString()}`);
  }

  function handleStatusFilter(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set("status", value);
    else params.delete("status");
    params.delete("page");
    router.push(`/drivers?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Drivers" description="Manage your driver roster">
        <Button onClick={() => { setEditDriver(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Driver
        </Button>
      </PageHeader>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drivers..."
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
            {driverStatuses.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {drivers.length === 0 ? (
        <EmptyState icon={Users} title="No drivers found" description="Add your first driver to get started">
          <Button onClick={() => { setEditDriver(null); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Driver
          </Button>
        </EmptyState>
      ) : (
        <DriverTable
          drivers={drivers}
          total={total}
          page={page}
          onEdit={(d) => { setEditDriver(d); setDialogOpen(true); }}
        />
      )}

      <DriverDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        driver={editDriver}
      />
    </div>
  );
}
