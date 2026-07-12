"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fuel, Wrench, Receipt, DollarSign, TrendingUp } from "lucide-react";

interface Props {
  costs: { fuel: number; maintenance: number; expenses: number; total: number };
  revenue: number;
}

const fmt = (n: number) => `$${n.toLocaleString()}`;

export function CostOverview({ costs, revenue }: Props) {
  const items = [
    { label: "Fuel", value: costs.fuel, Icon: Fuel },
    { label: "Maintenance", value: costs.maintenance, Icon: Wrench },
    { label: "Other Expenses", value: costs.expenses, Icon: Receipt },
    { label: "Operational Cost", value: costs.total, Icon: DollarSign, emphasize: true },
    { label: "Revenue", value: revenue, Icon: TrendingUp },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cost Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          {items.map(({ label, value, Icon, emphasize }) => (
            <div key={label} className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
              <p
                className={
                  "text-lg font-semibold tabular-nums" +
                  (emphasize ? " text-primary" : "")
                }
              >
                {fmt(value)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
