import { partyRepository } from "@/lib/repositories";
import { partySchema, PartyFormData } from "@/lib/validations";
import { calculateOutstanding } from "@/lib/domain/billing";
import { Prisma } from "@prisma/client";

function toRecord(data: PartyFormData): Prisma.PartyCreateInput {
  return {
    name: data.name,
    type: data.type,
    gst: data.gst || null,
    phone: data.phone,
    email: data.email,
    address: data.address || null,
    openingBalance: data.openingBalance,
  };
}

export const partyService = {
  async list(params?: { search?: string; page?: number; pageSize?: number }) {
    const [parties, total] = await Promise.all([
      partyRepository.findAll(params),
      partyRepository.count(params),
    ]);
    return { parties, total };
  },

  async options() {
    return partyRepository.findAllSimple();
  },

  async getById(id: string) {
    const party = await partyRepository.findById(id);
    if (!party) throw new Error("Party not found");
    return party;
  },

  async create(data: PartyFormData) {
    const parsed = partySchema.parse(data);
    return partyRepository.create(toRecord(parsed));
  },

  async update(id: string, data: Partial<PartyFormData>) {
    const parsed = partySchema.partial().parse(data);
    const patch: Prisma.PartyUpdateInput = {};
    if (parsed.name !== undefined) patch.name = parsed.name;
    if (parsed.type !== undefined) patch.type = parsed.type;
    if (parsed.gst !== undefined) patch.gst = parsed.gst || null;
    if (parsed.phone !== undefined) patch.phone = parsed.phone;
    if (parsed.email !== undefined) patch.email = parsed.email;
    if (parsed.address !== undefined) patch.address = parsed.address || null;
    if (parsed.openingBalance !== undefined) patch.openingBalance = parsed.openingBalance;
    return partyRepository.update(id, patch);
  },

  async delete(id: string) {
    return partyRepository.delete(id);
  },

  async getLedger(id: string) {
    const { party, totalBilled, totalReceived } = await partyRepository.ledger(id);
    if (!party) throw new Error("Party not found");
    const outstanding = calculateOutstanding(party.openingBalance, totalBilled, totalReceived);
    return { party, totalBilled, totalReceived, outstanding };
  },
};
