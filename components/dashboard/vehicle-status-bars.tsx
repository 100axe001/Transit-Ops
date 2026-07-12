"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KPIData {
  vehicles: { total: number; available: number; onTrip: number; inShop: number; retired: number };
}

const ROWS = [
  { key: "available", label: "Available", color: "bg-green-500" },
  { key: "onTrip", label: "On Trip", color: "bg-blue-500" },
  { key: "inShop", label: "In Shop", color: "bg-orange-500" },
  { key: "retired", label: "Retired", color: "bg-rose-400" },
] as const;

export function VehicleStatusBars({ kpis }: { kpis: KPIData }) {
  const total = kpis.vehicles.total || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Vehicle Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ROWS.map((row) => {
          const value = kpis.vehicles[row.key];
          const pct = Math.round((value / total) * 100);
          return (
            <div key={row.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium tabular-nums">{value}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className={cn("h-2 rounded-full transition-all", row.color)}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
