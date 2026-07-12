import { UserRole } from "@prisma/client";
import { getPermissions, type Permission } from "@/lib/permissions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Eye, Minus } from "lucide-react";

const ROLES: { role: UserRole; label: string }[] = [
  { role: "FLEET_MANAGER", label: "Fleet Manager" },
  { role: "DISPATCHER", label: "Dispatcher" },
  { role: "SAFETY_OFFICER", label: "Safety Officer" },
  { role: "FINANCIAL_ANALYST", label: "Financial Analyst" },
];

const MODULES: { key: string; label: string }[] = [
  { key: "vehicles", label: "Fleet" },
  { key: "drivers", label: "Drivers" },
  { key: "trips", label: "Trips" },
  { key: "maintenance", label: "Maint." },
  { key: "fuel", label: "Fuel" },
  { key: "expenses", label: "Expenses" },
  { key: "billing", label: "Billing" },
  { key: "parties", label: "Parties" },
  { key: "reports", label: "Reports" },
];

function accessLevel(perms: Permission[], key: string): "manage" | "view" | "none" {
  if (perms.includes(`${key}:write` as Permission)) return "manage";
  if (perms.includes(`${key}:read` as Permission)) return "view";
  return "none";
}

export function RbacMatrix() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Role-Based Access (RBAC)</CardTitle>
        <CardDescription>
          What each role can view and manage — enforced on every server action.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-4 font-medium">Role</th>
              {MODULES.map((m) => (
                <th key={m.key} className="px-3 py-2 font-medium">
                  {m.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROLES.map(({ role, label }) => {
              const perms = getPermissions(role);
              return (
                <tr key={role} className="border-b last:border-0">
                  <td className="py-2.5 pr-4 font-medium whitespace-nowrap">
                    {label}
                  </td>
                  {MODULES.map((m) => {
                    const lvl = accessLevel(perms, m.key);
                    return (
                      <td key={m.key} className="px-3 py-2.5">
                        {lvl === "manage" ? (
                          <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-500">
                            <Check className="h-3.5 w-3.5" />
                            Manage
                          </span>
                        ) : lvl === "view" ? (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </span>
                        ) : (
                          <Minus className="h-3.5 w-3.5 text-muted-foreground/40" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
