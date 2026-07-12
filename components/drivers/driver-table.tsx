"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { deleteDriverAction } from "@/actions/drivers";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { isLicenseExpired, isLicenseExpiringSoon } from "@/lib/domain/driver";
import type { Driver } from "@prisma/client";

interface Props {
  drivers: Driver[];
  total: number;
  page: number;
  onEdit: (driver: Driver) => void;
}

export function DriverTable({ drivers, total, page, onEdit }: Props) {
  const router = useRouter();
  const totalPages = Math.ceil(total / 20);

  async function handleDelete(id: string) {
    const result = await deleteDriverAction(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Driver deleted");
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>License Expiry</TableHead>
              <TableHead>Safety Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => {
              const expired = isLicenseExpired(driver.expiryDate);
              const expiring = isLicenseExpiringSoon(driver.expiryDate);
              return (
                <TableRow key={driver.id}>
                  <TableCell className="font-medium">{driver.name}</TableCell>
                  <TableCell>{driver.licenseNumber}</TableCell>
                  <TableCell>{driver.category}</TableCell>
                  <TableCell>{driver.phone}</TableCell>
                  <TableCell>
                    <span className={expired ? "text-destructive font-medium" : expiring ? "text-orange-500 font-medium" : ""}>
                      {format(new Date(driver.expiryDate), "MMM d, yyyy")}
                      {expired && " (Expired)"}
                      {expiring && !expired && " (Expiring)"}
                    </span>
                  </TableCell>
                  <TableCell>{driver.safetyScore}/100</TableCell>
                  <TableCell><StatusBadge status={driver.status} /></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md h-8 w-8 hover:bg-muted">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(driver)}>
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(driver.id)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{total} drivers total</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1}
              onClick={() => router.push(`/drivers?page=${page - 1}`)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages}
              onClick={() => router.push(`/drivers?page=${page + 1}`)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}
