import { z } from "zod";

export const partySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  type: z.enum(["CONSIGNOR", "CONSIGNEE", "BOTH"]).default("BOTH"),
  gst: z.string().max(20).optional().or(z.literal("")),
  phone: z.string().min(1, "Phone is required").max(20),
  email: z.string().email("A valid email is required"),
  address: z.string().max(300).optional().or(z.literal("")),
  openingBalance: z.coerce.number().default(0),
});

export type PartyFormData = z.infer<typeof partySchema>;
