export const INJECTION_LOG_STORAGE_KEY = "peptabase.injection-logs";

export function readInjectionLogs() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(INJECTION_LOG_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeInjectionLogs(items) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(INJECTION_LOG_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("peptabase:injection-logs-updated", { detail: items }));
}
