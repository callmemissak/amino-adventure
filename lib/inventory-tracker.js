export const INVENTORY_STORAGE_KEY = "peptabase.inventory";

export function toMg(value, unit) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return 0;
  return unit === "mcg" ? amount / 1000 : amount;
}

export function calculateInventoryMetrics(item) {
  const vialStrengthMg = Number(item.vialStrengthMg) || 0;
  const vialCount = Number(item.vialCount) || 0;
  const doseAmount = Number(item.doseAmount) || 0;
  const doseMg = toMg(doseAmount, item.doseUnit);
  const administrationsPerWeek = Number(item.administrationsPerWeek) || 0;
  const totalInventoryMg = vialStrengthMg * vialCount;
  const remainingDoses = doseMg > 0 ? totalInventoryMg / doseMg : 0;
  const cycleDays = administrationsPerWeek > 0 ? remainingDoses * (7 / administrationsPerWeek) : 0;

  return {
    totalInventoryMg,
    remainingDoses,
    cycleDays,
    cycleWeeks: cycleDays / 7
  };
}

export function readInventory() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeInventory(items) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("peptabase:inventory-updated", { detail: items }));
}
