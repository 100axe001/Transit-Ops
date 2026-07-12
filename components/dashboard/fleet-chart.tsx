"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface KPIData {
  vehicles: { available: number; onTrip: number; inShop: number; retired: number };
}

const COLORS = ["#22c55e", "#3b82f6", "#f97316", "#6b7280"];

export function FleetChart({ kpis }: { kpis: KPIData }) {
  const data = [
    { name: "Available", value: kpis.vehicles.available },
    { name: "On Trip", value: kpis.vehicles.onTrip },
    { name: "In Shop", value: kpis.vehicles.inShop },
    { name: "Retired", value: kpis.vehicles.retired },
  ].filter((d) => d.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Fleet Status</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No vehicles yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
