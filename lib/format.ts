// Centralized display formatting. Indian conventions by default:
// ₹ currency with lakh/crore digit grouping (en-IN), metric distance & volume.

const inr0 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const inr2 = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const safe = (value: number) => (Number.isFinite(value) ? value : 0);

/** ₹ amount with Indian grouping, e.g. formatCurrency(2450000) -> "₹24,50,000". */
export function formatCurrency(value: number, opts?: { decimals?: boolean }): string {
  return `₹${(opts?.decimals ? inr2 : inr0).format(safe(value))}`;
}

/** Plain number with Indian grouping, e.g. "24,50,000". */
export function formatNumber(value: number): string {
  return inr0.format(safe(value));
}

/** Distance in kilometers, e.g. "1,82,000 km". */
export function formatKm(value: number): string {
  return `${inr0.format(Math.round(safe(value)))} km`;
}

/** Volume in liters, e.g. "42.0 L". */
export function formatLiters(value: number): string {
  return `${safe(value).toFixed(1)} L`;
}
