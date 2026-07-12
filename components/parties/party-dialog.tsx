"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { partySchema, PartyFormData } from "@/lib/validations";
import { createPartyAction, updatePartyAction } from "@/actions/parties";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { partyTypes } from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Party, PartyType } from "@prisma/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  party?: Party | null;
}

export function PartyDialog({ open, onOpenChange, party }: Props) {
  const router = useRouter();
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(partySchema),
    defaultValues: party
      ? {
          name: party.name,
          type: party.type,
          gst: party.gst ?? "",
          phone: party.phone,
          email: party.email,
          address: party.address ?? "",
          openingBalance: party.openingBalance,
        }
      : { type: "BOTH" as PartyType, openingBalance: 0 },
  });

  async function onSubmit(data: Record<string, unknown>) {
    const payload = data as unknown as PartyFormData;
    const result = party
      ? await updatePartyAction(party.id, payload)
      : await createPartyAction(payload);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(party ? "Party updated" : "Party created");
      reset();
      onOpenChange(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{party ? "Edit Party" : "Add Party"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...register("name")} placeholder="Party name" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                defaultValue={party?.type ?? "BOTH"}
                onValueChange={(v: string | null) => v && setValue("type", v as PartyType)}
              >
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {partyTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input {...register("phone")} placeholder="Contact number" />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" {...register("email")} placeholder="For alerts & invoices" />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>GST</Label>
              <Input {...register("gst")} placeholder="Optional" />
            </div>
            <div className="space-y-2">
              <Label>Opening Balance (₹)</Label>
              <Input type="number" step="0.01" {...register("openingBalance")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input {...register("address")} placeholder="Optional" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : party ? "Save Changes" : "Add Party"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
