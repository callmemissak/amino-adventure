"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ReconstitutionCalculator } from "@/components/peptabase/Calculators";
import PeptideAccordionItem from "@/components/peptabase/PeptideAccordionItem";

type PeptideEntry = {
  slug: string;
  name: string;
  aliases?: string[];
  category?: string;
  kind?: string;
  overview?: string;
  mechanismOfAction?: string;
  keywords?: string[];
};

type ComparisonEntry = {
  slug: string;
  title: string;
  href: string;
  left: PeptideEntry;
  right: PeptideEntry;
};

type StackEntry = {
  name: string;
  peptides: string[];
  focus: string;
};

type HomeProps = {
  peptides: PeptideEntry[];
  initialSlug?: string;
  comparisonIndex?: ComparisonEntry[];
  stackIndex?: StackEntry[];
  evidenceBySlug?: Record<string, string>;
  reviewedBySlug?: Record<string, string>;
  relatedBySlug?: Record<string, PeptideEntry[]>;
};

const FILTER_GROUPS = [
  { id: "all", label: "All", matcher: () => true },
  { id: "healing", label: "Healing", matcher: (peptide: PeptideEntry) => peptide.category === "Healing & Recovery" },
  { id: "gh", label: "GH / Growth Hormone", matcher: (peptide: PeptideEntry) => peptide.category === "Growth Hormone Secretagogue" || peptide.category === "Growth Factor" },
  { id: "glp1", label: "GLP-1 / Metabolic", matcher: (peptide: PeptideEntry) => peptide.category === "Metabolic" },
  { id: "neuro", label: "Neuro", matcher: (peptide: PeptideEntry) => peptide.category === "Nootropic & Neuropeptide" },
  { id: "mitochondrial", label: "Mitochondrial", matcher: (peptide: PeptideEntry) => peptide.category === "Longevity & Mitochondrial" },
  { id: "bioregulator", label: "Bioregulator", matcher: (peptide: PeptideEntry) => peptide.category === "Bioregulator Peptide" },
  { id: "immune", label: "Immune", matcher: (peptide: PeptideEntry) => peptide.category === "Immune Modulation" }
];

const utilityLinks = [
  { href: "/calculator", label: "Calculator hub" },
  { href: "/peptide-comparisons", label: "Compare peptides" },
  { href: "/peptide-stacks", label: "Peptide stacks" },
  { href: "/research-glossary", label: "Research glossary" },
  { href: "/saved-peptides", label: "Saved peptides" },
  { href: "/categories/healing", label: "Healing" },
  { href: "/categories/glp-1", label: "GLP-1" },
  { href: "/categories/gh-secretagogues", label: "GH secretagogues" }
];

function matchesSearch(peptide: PeptideEntry, query: string) {
  const haystack = [
    peptide.name,
    peptide.category,
    peptide.kind,
    peptide.mechanismOfAction,
    peptide.overview,
    ...(peptide.aliases ?? []),
    ...(peptide.keywords ?? [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function countVisible(filters: typeof FILTER_GROUPS, peptides: PeptideEntry[], query: string) {
  return filters.reduce((counts, filter) => {
    counts[filter.id] = peptides.filter((peptide) => filter.matcher(peptide) && (!query || matchesSearch(peptide, query))).length;
    return counts;
  }, {} as Record<string, number>);
}

function calculatorHrefFor(peptide: PeptideEntry) {
  return peptide.category === "Metabolic" ? "/glp-1-dose-calculator" : "/reconstitution-calculator";
}

function updateChromeOffsets() {
  const header = document.querySelector(".pb-header");
  const toolbar = document.querySelector(".pb-database-toolbar");
  const headerHeight = header instanceof HTMLElement ? header.offsetHeight : 0;
  const toolbarHeight = toolbar instanceof HTMLElement ? toolbar.offsetHeight : 0;
  const breathingRoom = window.innerWidth <= 720 ? 18 : 22;

  document.documentElement.style.setProperty("--pb-header-height", `${headerHeight}px`);
  document.documentElement.style.setProperty("--pb-toolbar-height", `${toolbarHeight}px`);
  document.documentElement.style.setProperty("--pb-scroll-offset", `${headerHeight + toolbarHeight + breathingRoom}px`);
}

export default function PeptaBaseHome({
  peptides,
  initialSlug = "",
  comparisonIndex = [],
  stackIndex = [],
  evidenceBySlug = {},
  reviewedBySlug = {},
  relatedBySlug = {}
}: HomeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const initialOpen = initialSlug || peptides[0]?.slug || "";
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [openSlug, setOpenSlug] = useState(initialOpen);
  const [isCondensed, setIsCondensed] = useState(false);
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  useEffect(() => {
    const syncChrome = () => {
      const nextCondensed = window.scrollY > 52;
      setIsCondensed((current) => (current === nextCondensed ? current : nextCondensed));
      updateChromeOffsets();
    };

    syncChrome();
    window.addEventListener("resize", syncChrome);
    window.addEventListener("scroll", syncChrome, { passive: true });

    return () => {
      window.removeEventListener("resize", syncChrome);
      window.removeEventListener("scroll", syncChrome);
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => updateChromeOffsets());
    return () => window.cancelAnimationFrame(frame);
  }, [isCondensed, filteredLength(activeFilter, deferredSearch, peptides)]);

  const visibleCounts = useMemo(() => countVisible(FILTER_GROUPS, peptides, deferredSearch), [deferredSearch, peptides]);

  const filteredPeptides = useMemo(() => {
    const currentFilter = FILTER_GROUPS.find((filter) => filter.id === activeFilter) ?? FILTER_GROUPS[0];
    return peptides.filter((peptide) => currentFilter.matcher(peptide) && (!deferredSearch || matchesSearch(peptide, deferredSearch)));
  }, [activeFilter, deferredSearch, peptides]);

  useEffect(() => {
    if (pathname?.startsWith("/peptides/")) {
      const slug = pathname.split("/").filter(Boolean).pop() ?? "";
      setOpenSlug(slug);
      return;
    }

    if (pathname === "/" && initialSlug) {
      setOpenSlug(initialSlug);
    }
  }, [initialSlug, pathname]);

  useEffect(() => {
    if (openSlug && !filteredPeptides.some((peptide) => peptide.slug === openSlug)) {
      setOpenSlug(filteredPeptides[0]?.slug ?? "");
    }
  }, [filteredPeptides, openSlug]);

  useEffect(() => {
    if (!openSlug) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(`peptide-${openSlug}`);
      if (!target) {
        return;
      }

      const targetTop = target.getBoundingClientRect().top + window.scrollY - Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue("--pb-scroll-offset"), 10);
      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: "smooth"
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [openSlug]);

  function handleToggle(slug: string) {
    const nextSlug = openSlug === slug ? "" : slug;
    setOpenSlug(nextSlug);

    if (!nextSlug) {
      router.push("/", { scroll: false });
      return;
    }

    router.push(`/peptides/${nextSlug}`, { scroll: false });
  }

  return (
    <div className="pb-shell">
      <div className="pb-warning-banner">FOR EDUCATIONAL &amp; RESEARCH PURPOSES ONLY - NOT FOR HUMAN CONSUMPTION - NOT MEDICAL ADVICE</div>

      <header className={`pb-header ${isCondensed ? "is-condensed" : ""}`}>
        <div className="pb-header-inner pb-header-database">
          <div className="pb-brand">
            <span className="pb-brand-mark">Peptide and bioregulator research database</span>
            <span className="pb-brand-name">PeptaBase</span>
          </div>
          <div className="pb-header-summary">
            <span className="pb-header-summary-pill">{filteredPeptides.length} visible</span>
            <span className="pb-header-summary-pill">{peptides.length} total entries</span>
            <span className="pb-header-summary-pill">Inline PubMed studies</span>
          </div>
        </div>
      </header>

      <main className="pb-main">
        <section className="pb-section pb-database-shell">
          <div className="pb-database-intro">
            <div className="pb-database-copy">
              <div className="pb-eyebrow">Research Database</div>
              <h1 className="pb-database-title">A cleaner peptide database built for scanning, trust, and depth.</h1>
              <p className="pb-section-copy">
                Search by peptide, alias, category, mechanism, or keyword, then open one elegant inline record at a time without losing your place in the database.
              </p>
              <div className="pb-inline-link-list pb-top-links">
                {utilityLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="pb-inline-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="pb-database-stats">
              <div className="pb-stat pb-stat-soft">
                <div className="pb-stat-number">{filteredPeptides.length}</div>
                <div className="pb-stat-label">Visible entries</div>
              </div>
              <div className="pb-stat pb-stat-soft">
                <div className="pb-stat-number">{comparisonIndex.length}</div>
                <div className="pb-stat-label">Comparison pages</div>
              </div>
            </div>
          </div>

          <div className={`pb-database-toolbar ${isCondensed ? "is-condensed" : ""}`}>
            <div className="pb-toolbar-top">
              <div className="pb-search-frame">
                <label className="pb-toolbar-label" htmlFor="peptide-search">Search Peptides</label>
                <input
                  id="peptide-search"
                  className="pb-field pb-search-field"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, alias, category, mechanism, or keyword"
                />
              </div>
              <div className="pb-toolbar-meta">
                <span className="pb-results-pill">{filteredPeptides.length} results</span>
                <Link href="/saved-peptides" className="pb-inline-link">Saved list</Link>
              </div>
            </div>
            <div className={`pb-filter-row ${isCondensed ? "is-condensed" : ""}`}>
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
              <div className="pb-results-meta">
                Showing <strong>{filteredPeptides.length}</strong> peptide entries in a single searchable research view.
              </div>

              {filteredPeptides.map((peptide) => {
                const comparisons = comparisonIndex
                  .filter((entry) => entry.left.slug === peptide.slug || entry.right.slug === peptide.slug)
                  .map((entry) => ({ href: entry.href, label: entry.title }));
                const stacks = stackIndex
                  .filter((stack) => stack.peptides.some((name) => name.toLowerCase() === peptide.name.toLowerCase()))
                  .map((stack) => ({ name: stack.name, focus: stack.focus }));

                return (
                  <PeptideAccordionItem
                    key={peptide.slug}
                    peptide={peptide}
                    open={openSlug === peptide.slug}
                    onToggle={() => handleToggle(peptide.slug)}
                    relatedPeptides={relatedBySlug[peptide.slug] ?? []}
                    comparisonLinks={comparisons}
                    stacks={stacks}
                    evidenceLevel={evidenceBySlug[peptide.slug] ?? "Limited"}
                    lastReviewedDate={reviewedBySlug[peptide.slug] ?? "Mar 14, 2026"}
                    calculatorHref={calculatorHrefFor(peptide)}
                  />
                );
              })}

              {filteredPeptides.length === 0 ? (
                <div className="pb-panel pb-empty-state">
                  <div className="pb-eyebrow">No matches</div>
                  <h2 className="pb-card-title">No peptides matched that search.</h2>
                  <p className="pb-body">Try a broader keyword, change the category filter, or use one of the linked comparison and glossary routes above.</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="pb-database-support">
            <div className="pb-panel pb-panel-soft">
              <div className="pb-eyebrow">Reading mode</div>
              <h2 className="pb-card-title">The peptide entries stay first.</h2>
              <p className="pb-body">
                Search, scan, and read the peptide records inline. Supporting tools stay available below without crowding the main reading flow.
              </p>
            </div>

            <ReconstitutionCalculator />

            <div className="pb-panel pb-panel-soft">
              <div className="pb-eyebrow">Premium workflows</div>
              <h2 className="pb-card-title">Saved tracking, inventory, and protocol tools.</h2>
              <p className="pb-body">
                Dashboard features remain available as optional secondary tools instead of competing with the peptide content.
              </p>
              <div className="pb-inline-actions">
                <Link href="/dashboard" className="pb-button-secondary">Open dashboard</Link>
                <Link href="/saved-peptides" className="pb-button-secondary">Saved peptides</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function filteredLength(activeFilter: string, query: string, peptides: PeptideEntry[]) {
  const currentFilter = FILTER_GROUPS.find((filter) => filter.id === activeFilter) ?? FILTER_GROUPS[0];
  return peptides.filter((peptide) => currentFilter.matcher(peptide) && (!query || matchesSearch(peptide, query))).length;
}
