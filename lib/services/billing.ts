import { prisma } from "@/lib/prisma";
import { biltyRepository, counterRepository } from "@/lib/repositories";
import {
  biltySchema,
  BiltyFormData,
  paymentSchema,
  PaymentFormData,
} from "@/lib/validations";
import { calculateBiltyCharges, formatBiltyNumber } from "@/lib/domain/billing";

export const billingService = {
  async listBiltys(params?: { search?: string; page?: number; pageSize?: number }) {
    const [biltys, total] = await Promise.all([
      biltyRepository.findAll(params),
      biltyRepository.count(params),
    ]);
    return { biltys, total };
  },

  async getBilty(id: string) {
    const bilty = await biltyRepository.findById(id);
    if (!bilty) throw new Error("Bilty not found");
    return bilty;
  },

  /**
   * Create a Bilty. Charges are computed server-side (Rule B-02), the number is
   * generated sequentially per day (Rule B-01), and if the Bilty is linked to a
   * Trip its total is synced to Trip.revenue (Rule B-03) — all in one transaction.
   */
  async createBilty(data: BiltyFormData) {
    const parsed = biltySchema.parse(data);
    const charges = calculateBiltyCharges(parsed);
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    return prisma.$transaction(async (tx) => {
      const seq = await counterRepository.next(`bilty-${yy}${mm}${dd}`, tx);
      const bilty = await tx.bilty.create({
        data: {
          biltyNumber: formatBiltyNumber(now, seq),
          consignor: { connect: { id: parsed.consignorId } },
          consignee: { connect: { id: parsed.consigneeId } },
          fromLocation: parsed.fromLocation,
          toLocation: parsed.toLocation,
          goodsDesc: parsed.goodsDesc,
          packages: parsed.packages,
          packingMethod: parsed.packingMethod || null,
          actualWeight: parsed.actualWeight,
          chargedWeight: charges.chargedWeight,
          grNumber: parsed.grNumber || null,
          privateMark: parsed.privateMark || null,
          remarks: parsed.remarks || null,
          labourCharge: charges.labourCharge,
          grCharge: charges.grCharge,
          doorDelivery: parsed.doorDelivery ?? null,
          pfCharge: parsed.pfCharge ?? null,
          serviceTax: parsed.serviceTax ?? null,
          total: charges.total,
          status: "DRAFT",
          ...(parsed.tripId ? { trip: { connect: { id: parsed.tripId } } } : {}),
        },
      });

      if (parsed.tripId) {
        await tx.trip.update({
          where: { id: parsed.tripId },
          data: { revenue: charges.total },
        });
      }

      return bilty;
    });
  },

  async deleteBilty(id: string) {
    return prisma.bilty.delete({ where: { id } });
  },

  /** Record a party payment (Rule P-02 / P-04). */
  async recordPayment(data: PaymentFormData) {
    const parsed = paymentSchema.parse(data);
    return prisma.payment.create({
      data: {
        party: { connect: { id: parsed.partyId } },
        ...(parsed.biltyId ? { bilty: { connect: { id: parsed.biltyId } } } : {}),
        amount: parsed.amount,
        mode: parsed.mode,
        reference: parsed.reference || null,
        ...(parsed.date ? { date: parsed.date } : {}),
      },
    });
  },

  /** Dashboard billing KPIs: today's biltys/freight and total outstanding. */
  async getBillingKPIs() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const [biltysToday, freightToday, billed, received, opening] = await Promise.all([
      prisma.bilty.count({ where: { date: { gte: startOfToday } } }),
      prisma.bilty.aggregate({ where: { date: { gte: startOfToday } }, _sum: { total: true } }),
      prisma.bilty.aggregate({ _sum: { total: true } }),
      prisma.payment.aggregate({ _sum: { amount: true } }),
      prisma.party.aggregate({ _sum: { openingBalance: true } }),
    ]);
    const totalOutstanding =
      (opening._sum.openingBalance || 0) +
      (billed._sum.total || 0) -
      (received._sum.amount || 0);
    return {
      biltysToday,
      freightToday: freightToday._sum.total || 0,
      totalOutstanding,
    };
  },
};
