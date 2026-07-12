// Pure billing calculations — no DB, no side effects. (Rule B-02, appendix formula.)

export const LABOUR_PER_QUINTAL = 15; // ₹15 per quintal
export const GR_CHARGE = 30; // fixed ₹30 per bilty
export const KG_PER_QUINTAL = 100;

export interface BiltyChargeInput {
  actualWeight: number; // KG
  doorDelivery?: number | null;
  pfCharge?: number | null;
  serviceTax?: number | null;
}

export interface BiltyCharges {
  chargedWeight: number; // quintals
  labourCharge: number;
  grCharge: number;
  doorDelivery: number;
  pfCharge: number;
  serviceTax: number;
  total: number;
}

/**
 * Bilty charge pipeline (Rule B-02). The total is always computed here — it is
 * never accepted as user input, so it cannot be tampered with.
 */
export function calculateBiltyCharges(input: BiltyChargeInput): BiltyCharges {
  const chargedWeight = input.actualWeight / KG_PER_QUINTAL;
  const labourCharge = chargedWeight * LABOUR_PER_QUINTAL;
  const grCharge = GR_CHARGE;
  const doorDelivery = input.doorDelivery ?? 0;
  const pfCharge = input.pfCharge ?? 0;
  const serviceTax = input.serviceTax ?? 0;
  const total = labourCharge + grCharge + doorDelivery + pfCharge + serviceTax;
  return { chargedWeight, labourCharge, grCharge, doorDelivery, pfCharge, serviceTax, total };
}

/** Sequential bilty number: BLT-YYMMDD-XXXX (Rule B-01). */
export function formatBiltyNumber(date: Date, seq: number): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `BLT-${yy}${mm}${dd}-${String(seq).padStart(4, "0")}`;
}

/** Party outstanding = opening balance + total billed − total received (Rule P-01). */
export function calculateOutstanding(
  openingBalance: number,
  totalBilled: number,
  totalReceived: number
): number {
  return openingBalance + totalBilled - totalReceived;
}
