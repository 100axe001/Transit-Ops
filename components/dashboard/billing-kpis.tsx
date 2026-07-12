"use client";

import { StatCard } from "@/components/shared/stat-card";
import { FileText, IndianRupee, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/format";

interface Props {
  biltysToday: number;
  freightToday: number;
  totalOutstanding: number;
}

export function BillingKPIs({ biltysToday, freightToday, totalOutstanding }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard title="Biltys Today" value={biltysToday} icon={FileText} description="Bookings created today" />
      <StatCard title="Freight Today" value={formatCurrency(freightToday)} icon={TrendingUp} description="Total booked value" />
      <StatCard title="Total Outstanding" value={formatCurrency(totalOutstanding)} icon={IndianRupee} description="Across all parties" />
    </div>
  );
}
