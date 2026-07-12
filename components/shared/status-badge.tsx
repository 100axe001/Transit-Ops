import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  AVAILABLE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  ON_TRIP: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  IN_SHOP: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  RETIRED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  OFF_DUTY: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  SUSPENDED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  DRAFT: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
  DISPATCHED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  OPEN: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  CLOSED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClass = statusColors[status] || "bg-gray-100 text-gray-800";
  return (
    <Badge variant="secondary" className={cn("font-medium", colorClass, className)}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
