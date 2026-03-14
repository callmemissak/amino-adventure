"use client";

import { useEffect, useState } from "react";
import { readSavedPeptideSlugs, toggleSavedPeptide } from "@/lib/saved-peptides";

export default function SavedPeptideButton({
  slug,
  name,
  className = "pb-button-secondary"
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    function sync() {
      setSaved(readSavedPeptideSlugs().includes(slug));
    }

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("peptabase:saved-peptides-updated", sync as EventListener);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("peptabase:saved-peptides-updated", sync as EventListener);
    };
  }, [slug]);

  function handleClick() {
    const next = toggleSavedPeptide(slug);
    setSaved(next.includes(slug));
  }

  return (
    <button type="button" className={className} onClick={handleClick} aria-pressed={saved} aria-label={`${saved ? "Remove" : "Save"} ${name}`}>
      {saved ? "Saved peptide" : "Save peptide"}
    </button>
  );
}
