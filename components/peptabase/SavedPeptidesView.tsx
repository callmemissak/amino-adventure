"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { readSavedPeptideSlugs } from "@/lib/saved-peptides";

type PeptideEntry = {
  slug: string;
  name: string;
  category?: string;
  overview?: string;
  evidenceLevel?: string;
  mechanismSummary?: string;
  reviewDate?: string;
};

export default function SavedPeptidesView({ peptides }: { peptides: PeptideEntry[] }) {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);

  useEffect(() => {
    function sync() {
      setSavedSlugs(readSavedPeptideSlugs());
    }

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("peptabase:saved-peptides-updated", sync as EventListener);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("peptabase:saved-peptides-updated", sync as EventListener);
    };
  }, []);

  const savedPeptides = useMemo(() => {
    const bySlug = new Map(peptides.map((peptide) => [peptide.slug, peptide]));
    return savedSlugs.map((slug) => bySlug.get(slug)).filter(Boolean) as PeptideEntry[];
  }, [peptides, savedSlugs]);

  if (savedPeptides.length === 0) {
    return (
      <div className="pb-panel">
        <div className="pb-eyebrow">Saved peptides</div>
        <h2 className="pb-card-title">No bookmarked peptides yet.</h2>
        <p className="pb-body">Use the save button inside any peptide accordion entry to build your personal list.</p>
        <Link href="/" className="pb-button-secondary">Open peptide database</Link>
      </div>
    );
  }

  return (
    <div className="pb-card-grid">
      {savedPeptides.map((peptide) => (
        <article key={peptide.slug} className="pb-card">
          <div className="pb-inline-link-list">
            {peptide.category ? <span className="pb-chip">{peptide.category}</span> : null}
            {peptide.evidenceLevel ? <span className="pb-pill">{peptide.evidenceLevel}</span> : null}
          </div>
          <h2 className="pb-card-title">{peptide.name}</h2>
          <p className="pb-body">{peptide.overview || peptide.mechanismSummary || "Saved for later review."}</p>
          <div className="pb-link-list">
            <div className="pb-fact-row pb-stat-card">
              <div className="pb-fact-label">Review date</div>
              <strong className="pb-stat-value">{peptide.reviewDate || "Pending"}</strong>
            </div>
          </div>
          <div className="pb-inline-actions">
            <Link href={`/peptides/${peptide.slug}`} className="pb-button-secondary">Open peptide entry</Link>
            <Link href="/" className="pb-button-secondary">Back to database</Link>
          </div>
        </article>
      ))}
    </div>
  );
}
