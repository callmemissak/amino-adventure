"use client";

import { useEffect, useMemo, useState } from "react";
import { ReconstitutionCalculator } from "@/components/peptabase/Calculators";
import PeptideAccordionItem from "@/components/peptabase/PeptideAccordionItem";

const FILTER_GROUPS = [
  { id: "all", label: "All", matcher: () => true },
  { id: "healing", label: "Healing", matcher: (peptide) => peptide.category === "Healing & Recovery" },
  { id: "gh", label: "GH / Growth Hormone", matcher: (peptide) => peptide.category === "Growth Hormone Secretagogue" || peptide.category === "Growth Factor" },
  { id: "glp1", label: "GLP-1 / Metabolic", matcher: (peptide) => peptide.category === "Metabolic" },
  { id: "neuro", label: "Neuro", matcher: (peptide) => peptide.category === "Nootropic & Neuropeptide" },
  { id: "mitochondrial", label: "Mitochondrial", matcher: (peptide) => peptide.category === "Longevity & Mitochondrial" },
  { id: "bioregulator", label: "Bioregulator", matcher: (peptide) => peptide.category === "Bioregulator Peptide" },
  { id: "immune", label: "Immune", matcher: (peptide) => peptide.category === "Immune Modulation" }
];

function matchesSearch(peptide, query) {
  const haystack = [
    peptide.name,
    peptide.category,
    peptide.kind,
    peptide.mechanismOfAction,
    peptide.overview,
    peptide.pubmedQuery,
    ...(peptide.aliases ?? []),
    ...(peptide.keywords ?? [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function countVisible(filters, peptides, query) {
  return filters.reduce((counts, filter) => {
    counts[filter.id] = peptides.filter((peptide) => {
      const matchesGroup = filter.matcher(peptide);
      const searchMatches = !query || matchesSearch(peptide, query);
      return matchesGroup && searchMatches;
    }).length;
    return counts;
  }, {});
}

export default function PeptaBaseHome({ peptides }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [openSlug, setOpenSlug] = useState("");

  const normalizedSearch = search.trim().toLowerCase();
  const visibleCounts = useMemo(() => countVisible(FILTER_GROUPS, peptides, normalizedSearch), [normalizedSearch, peptides]);

  const filteredPeptides = useMemo(() => {
    const currentFilter = FILTER_GROUPS.find((filter) => filter.id === activeFilter) ?? FILTER_GROUPS[0];

    return peptides.filter((peptide) => {
      const matchesGroup = currentFilter.matcher(peptide);
      const searchMatches = !normalizedSearch || matchesSearch(peptide, normalizedSearch);
      return matchesGroup && searchMatches;
    });
  }, [activeFilter, normalizedSearch, peptides]);

  useEffect(() => {
    if (!filteredPeptides.some((peptide) => peptide.slug === openSlug)) {
      setOpenSlug(filteredPeptides[0]?.slug ?? "");
    }
  }, [filteredPeptides, openSlug]);

  return (
    <div className="pb-shell">
      <div className="pb-warning-banner">FOR EDUCATIONAL &amp; RESEARCH PURPOSES ONLY - NOT FOR HUMAN CONSUMPTION - NOT MEDICAL ADVICE</div>

      <header className="pb-header">
        <div className="pb-header-inner pb-header-database">
          <div className="pb-brand">
            <span className="pb-brand-mark">Peptide and bioregulator research database</span>
            <span className="pb-brand-name">PeptaBase</span>
          </div>
          <div className="pb-header-summary">
            <span>{peptides.length} searchable entries</span>
            <span>Inline PubMed studies</span>
            <span>One-page research workflow</span>
          </div>
        </div>
      </header>

      <main className="pb-main">
        <section className="pb-section pb-database-shell">
          <div className="pb-database-intro">
            <div>
              <div className="pb-eyebrow">Research Database</div>
              <h1 className="pb-database-title">Search peptides, scan details fast, and expand one record at a time.</h1>
              <p className="pb-section-copy">
                The full peptide database now stays on one page with compact rows, inline expansion, category filters, and peptide-level PubMed studies.
              </p>
            </div>
            <div className="pb-database-stats">
              <div className="pb-stat">
                <div className="pb-stat-number">{filteredPeptides.length}</div>
                <div className="pb-stat-label">Visible results</div>
              </div>
              <div className="pb-stat">
                <div className="pb-stat-number">{FILTER_GROUPS.length - 1}</div>
                <div className="pb-stat-label">Filter groups</div>
              </div>
              <div className="pb-stat">
                <div className="pb-stat-number">1</div>
                <div className="pb-stat-label">Open row at a time</div>
              </div>
            </div>
          </div>

          <div className="pb-database-toolbar">
            <div className="pb-search-frame">
              <label className="pb-toolbar-label" htmlFor="peptide-search">Sticky Search</label>
              <input
                id="peptide-search"
                className="pb-field pb-search-field"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, alias, category, mechanism, or keyword"
              />
            </div>
            <div className="pb-filter-row">
              {FILTER_GROUPS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={`pb-pill ${activeFilter === filter.id ? "active" : ""}`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                  <span className="pb-filter-count">{visibleCounts[filter.id] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pb-database-layout">
            <div className="pb-accordion-list">
              {filteredPeptides.map((peptide) => (
                <PeptideAccordionItem
                  key={peptide.slug}
                  peptide={peptide}
                  open={openSlug === peptide.slug}
                  onToggle={() => setOpenSlug((current) => (current === peptide.slug ? "" : peptide.slug))}
                />
              ))}
              {filteredPeptides.length === 0 ? (
                <div className="pb-panel pb-empty-state">
                  <div className="pb-eyebrow">No matches</div>
                  <h2 className="pb-card-title">No peptides matched that search.</h2>
                  <p className="pb-body">Try a broader keyword or switch back to the All filter to reopen the full database.</p>
                </div>
              ) : null}
            </div>

            <aside className="pb-database-rail">
              <div className="pb-panel">
                <div className="pb-eyebrow">How to use</div>
                <h2 className="pb-card-title">Built for scanning, not endless scrolling.</h2>
                <p className="pb-body">
                  Use search and filter chips to narrow the list, then open a peptide row to review structured details and live PubMed studies without leaving the page.
                </p>
              </div>
              <ReconstitutionCalculator />
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
