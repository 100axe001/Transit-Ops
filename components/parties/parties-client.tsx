"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Building2, Pencil, Trash2, IndianRupee } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { PartyDialog } from "./party-dialog";
import { RecordPaymentDialog } from "./record-payment-dialog";
import { deletePartyAction } from "@/actions/parties";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";
import type { Party } from "@prisma/client";

interface Props {
  parties: Party[];
  total: number;
  page: number;
}

export function PartiesClient({ parties, total, page }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editParty, setEditParty] = useState<Party | null>(null);
  const [payParty, setPayParty] = useState<Party | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / 20);

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("search", value);
    else params.delete("search");
    params.delete("page");
    router.push(`/parties?${params.toString()}`);
  }

  async function handleDelete(id: string) {
    const result = await deletePartyAction(id);
    if (result.error) toast.error(result.error);
    else { toast.success("Party deleted"); router.refresh(); }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Parties" description="Consignors, consignees, and their ledgers">
        <Button onClick={() => { setEditParty(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Party
        </Button>
      </PageHeader>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search parties..."
            className="pl-9"
            defaultValue={searchParams.get("search") || ""}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {parties.length === 0 ? (
        <EmptyState icon={Building2} title="No parties found" description="Add a consignor or consignee to start booking biltys">
          <Button onClick={() => { setEditParty(null); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Party
          </Button>
        </EmptyState>
      ) : (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>GST</TableHead>
                  <TableHead>Opening Balance</TableHead>
                  <TableHead className="w-32"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parties.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell><Badge variant="secondary">{p.type}</Badge></TableCell>
                    <TableCell>
                      <div className="text-sm">{p.phone}</div>
                      <div className="text-xs text-muted-foreground">{p.email}</div>
                    </TableCell>
                    <TableCell className="text-sm">{p.gst || "—"}</TableCell>
                    <TableCell>{formatCurrency(p.openingBalance)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" title="Record payment" onClick={() => setPayParty(p)}>
                          <IndianRupee className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit" onClick={() => { setEditParty(p); setDialogOpen(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{total} parties total</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1}
                  onClick={() => router.push(`/parties?page=${page - 1}`)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages}
                  onClick={() => router.push(`/parties?page=${page + 1}`)}>Next</Button>
              </div>
            </div>
          )}
        </div>
      )}

      <PartyDialog key={editParty?.id ?? "new"} open={dialogOpen} onOpenChange={setDialogOpen} party={editParty} />
      <RecordPaymentDialog key={payParty?.id ?? "pay"} open={!!payParty} onOpenChange={(o) => !o && setPayParty(null)} party={payParty} />
    </div>
  );
}
