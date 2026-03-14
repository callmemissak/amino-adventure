export const SAVED_PEPTIDES_STORAGE_KEY = "peptabase.saved-peptides";

export function readSavedPeptideSlugs() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(SAVED_PEPTIDES_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function writeSavedPeptideSlugs(slugs) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SAVED_PEPTIDES_STORAGE_KEY, JSON.stringify(slugs));
  window.dispatchEvent(new CustomEvent("peptabase:saved-peptides-updated", { detail: slugs }));
}

export function toggleSavedPeptide(slug) {
  const current = readSavedPeptideSlugs();
  const next = current.includes(slug)
    ? current.filter((item) => item !== slug)
    : [slug, ...current];

  writeSavedPeptideSlugs(next);
  return next;
}
