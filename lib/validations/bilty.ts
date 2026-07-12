import { z } from "zod";

// Note: charge fields (labour, gr, total, chargedWeight) are NOT here — they are
// computed server-side from actualWeight and the optional add-ons (Rule B-02).
export const biltySchema = z.object({
  consignorId: z.string().min(1, "Consignor is required"),
  consigneeId: z.string().min(1, "Consignee is required"),
  fromLocation: z.string().min(1, "Origin is required").max(100),
  toLocation: z.string().min(1, "Destination is required").max(100),
  goodsDesc: z.string().min(1, "Goods description is required").max(200),
  packages: z.coerce.number().int().positive("Packages must be positive"),
  packingMethod: z.string().max(50).optional().or(z.literal("")),
  actualWeight: z.coerce.number().positive("Weight must be positive"),
  grNumber: z.string().max(50).optional().or(z.literal("")),
  privateMark: z.string().max(50).optional().or(z.literal("")),
  remarks: z.string().max(300).optional().or(z.literal("")),
  doorDelivery: z.coerce.number().min(0).optional(),
  pfCharge: z.coerce.number().min(0).optional(),
  serviceTax: z.coerce.number().min(0).optional(),
  tripId: z.string().optional(),
});

export type BiltyFormData = z.infer<typeof biltySchema>;
