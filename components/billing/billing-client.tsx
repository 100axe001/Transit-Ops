"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { BiltyDialog } from "./bilty-dialog";
import { deleteBiltyAction } from "@/actions/billing";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Bilty, Party } from "@prisma/client";

type BiltyRow = Bilty & { consignor: Party; consignee: Party };

interface Props {
  biltys: BiltyRow[];
  total: number;
  page: number;
  parties: Party[];
}

export function BillingClient({ biltys, total, page, parties }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / 20);

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("search", value);
    else params.delete("search");
    params.delete("page");
    router.push(`/billing?${params.toString()}`);
  }

  async function handleDelete(id: string) {
    const result = await deleteBiltyAction(id);
    if (result.error) toast.error(result.error);
    else { toast.success("Bilty deleted"); router.refresh(); }
  }

  const canCreate = parties.length >= 1;

  return (
    <div className="space-y-6">
      <PageHeader title="Billing" description="Bilty (LR) bookings and freight charges">
        <Button onClick={() => setDialogOpen(true)} disabled={!canCreate}>
          <Plus className="h-4 w-4 mr-2" /> New Bilty
        </Button>
      </PageHeader>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search biltys..."
            className="pl-9"
            defaultValue={searchParams.get("search") || ""}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {!canCreate && (
        <p className="text-sm text-muted-foreground">
          Add a party first — every bilty needs a consignor and consignee.
        </p>
      )}

      {biltys.length === 0 ? (
        <EmptyState icon={FileText} title="No biltys yet" description="Create your first booking to auto-calculate freight charges">
          {canCreate && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> New Bilty
            </Button>
          )}
        </EmptyState>
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bilty No.</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Consignor</TableHead>
                  <TableHead>Goods</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {biltys.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.biltyNumber}</TableCell>
                    <TableCell>{format(new Date(b.date), "dd MMM yyyy")}</TableCell>
                    <TableCell className="text-sm">{b.fromLocation} → {b.toLocation}</TableCell>
                    <TableCell className="text-sm">{b.consignor.name}</TableCell>
                    <TableCell className="text-sm">{b.goodsDesc}</TableCell>
                    <TableCell>{b.actualWeight.toLocaleString("en-IN")} kg</TableCell>
                    <TableCell className="font-medium">{formatCurrency(b.total)}</TableCell>
                    <TableCell><Badge variant="secondary">{b.status}</Badge></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{total} biltys total</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1}
                  onClick={() => router.push(`/billing?page=${page - 1}`)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages}
                  onClick={() => router.push(`/billing?page=${page + 1}`)}>Next</Button>
              </div>
            </div>
          )}
        </div>
      )}

      <BiltyDialog open={dialogOpen} onOpenChange={setDialogOpen} parties={parties} />
    </div>
  );
}
