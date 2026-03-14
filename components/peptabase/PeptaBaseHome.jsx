"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PeptideCard from "@/components/peptabase/PeptideCard";
import { Glp1ConcentrationCalculator, ReconstitutionCalculator } from "@/components/peptabase/Calculators";
import {
  buildComparisonEntries,
  buildHomeSections,
  compareSuggestions,
  getCategories,
  peptideStacks
} from "@/lib/peptabase-data";

function sectionCards(title, copy, items) {
  return (
    <section className="pb-section">
      <div className="pb-section-head">
        <div>
          <h2 className="pb-section-title">{title}</h2>
          <p className="pb-section-copy">{copy}</p>
        </div>
      </div>
      <div className="pb-card-grid">
        {items.map((peptide) => <PeptideCard key={peptide.slug} peptide={peptide} />)}
      </div>
    </section>
  );
}

export default function PeptaBaseHome({ peptides }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = useMemo(() => getCategories(peptides), [peptides]);
  const sections = useMemo(() => buildHomeSections(peptides), [peptides]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return peptides.filter((peptide) => {
      const matchesCategory = category === "All" || peptide.category === category;
      const matchesSearch = !query || peptide.keywords.some((keyword) => String(keyword).toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [category, peptides, search]);

  const [leftSlug, rightSlug] = compareSuggestions[0];
  const [compareLeft, setCompareLeft] = useState(leftSlug);
  const [compareRight, setCompareRight] = useState(rightSlug);
  const comparison = useMemo(
    () => buildComparisonEntries(peptides, compareLeft, compareRight),
    [compareLeft, compareRight, peptides]
  );

  return (
    <div className="pb-shell">
      <div className="pb-warning-banner">FOR EDUCATIONAL &amp; RESEARCH PURPOSES ONLY - NOT FOR HUMAN CONSUMPTION - NOT MEDICAL ADVICE</div>
      <header className="pb-header">
        <div className="pb-header-inner">
          <Link href="/" className="pb-brand">
            <span className="pb-brand-mark">Unified peptide and bioregulator system</span>
            <span className="pb-brand-name">PeptaBase</span>
          </Link>
          <nav className="pb-nav">
            <a href="#database">Database</a>
            <a href="#research">Research</a>
            <a href="#calculators">Calculators</a>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/favorite-researchers">Favorite Researchers</Link>
          </nav>
        </div>
      </header>

      <main className="pb-main">
        <section className="pb-section pb-hero">
          <div>
            <div className="pb-eyebrow">Peptide and Bioregulator Research Database</div>
            <h1>PeptaBase</h1>
            <p>
              Search peptides, review scientific research, run peptide calculators and manage peptide inventory in one platform.
            </p>
            <div className="pb-actions">
              <a href="#database" className="pb-button">Search peptides</a>
              <a href="#calculators" className="pb-button-secondary">Open calculators</a>
              <Link href="/dashboard" className="pb-button-secondary">Open dashboard</Link>
            </div>
            <div className="pb-stats">
              <div className="pb-stat">
                <div className="pb-stat-number">{peptides.length}</div>
                <div className="pb-stat-label">Catalog entries</div>
              </div>
              <div className="pb-stat">
                <div className="pb-stat-number">{categories.length - 1}</div>
                <div className="pb-stat-label">Searchable categories</div>
              </div>
              <div className="pb-stat">
                <div className="pb-stat-number">5</div>
                <div className="pb-stat-label">Platform modes</div>
              </div>
            </div>
          </div>

          <div className="pb-panel pb-hero-panel">
            <div className="pb-eyebrow">Platform purpose</div>
            <div className="pb-link-list" style={{ marginTop: 16 }}>
              <div className="pb-fact-row">Peptide research database</div>
              <div className="pb-fact-row">Scientific research hub</div>
              <div className="pb-fact-row">Calculator toolkit</div>
              <div className="pb-fact-row">Personal peptide inventory manager</div>
              <div className="pb-fact-row">Injection tracking system</div>
            </div>
            <p className="pb-body" style={{ marginTop: 18 }}>
              The refactor keeps the existing Next.js structure but reorganizes it into reusable components and a shared data layer ready for Supabase-backed accounts, saved data, and future subscription controls.
            </p>
          </div>
        </section>

        <section id="database" className="pb-section">
          <div className="pb-section-head">
            <div>
              <h2 className="pb-section-title">Smart Search</h2>
              <p className="pb-section-copy">
                Search by peptide name, category, mechanism, or keywords. Results return quick-reference cards with direct links into structured peptide pages.
              </p>
            </div>
          </div>
          <div className="pb-panel">
            <div className="pb-search-row">
              <input
                className="pb-field"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search peptide name, category, mechanism, or keywords"
              />
              <select className="pb-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="pb-results-meta">{filtered.length} results</div>
            <div className="pb-card-grid">
              {filtered.slice(0, 12).map((peptide) => <PeptideCard key={peptide.slug} peptide={peptide} />)}
            </div>
          </div>
        </section>

        {sectionCards("Trending Peptides", "A launch-ready trending module using reference density and featured weighting now, with room for page views and saves after Supabase metrics are connected.", sections.trending)}
        {sectionCards("Featured Peptides", "High-priority entries ready for richer editorial content and linked calculators.", sections.featured)}
        {sectionCards("Latest Research", "Entries currently carrying the strongest reference footprint in the local catalog.", sections.latestResearch)}

        <section id="calculators" className="pb-section">
          <div className="pb-section-head">
            <div>
              <h2 className="pb-section-title">Calculator Tools</h2>
              <p className="pb-section-copy">
                Reconstitution and GLP-1 concentration tools can be reused on both the homepage and individual peptide pages.
              </p>
            </div>
          </div>
          <div className="pb-tool-grid">
            <ReconstitutionCalculator />
            <Glp1ConcentrationCalculator />
          </div>
        </section>

        <section className="pb-section">
          <div className="pb-section-head">
            <div>
              <h2 className="pb-section-title">Peptide Stacks</h2>
              <p className="pb-section-copy">Structured stack entries are ready for editorial expansion, inventory planning, and saved dashboard workflows.</p>
            </div>
          </div>
          <div className="pb-panel">
            {peptideStacks.map((stack) => (
              <div key={stack.name} className="pb-stack-row">
                <div>
                  <strong>{stack.name}</strong>
                  <div className="pb-subtle">{stack.peptides.join(" + ")}</div>
                </div>
                <div className="pb-subtle">{stack.focus}</div>
                <div className="pb-subtle">{stack.note}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-section">
          <div className="pb-section-head">
            <div>
              <h2 className="pb-section-title">Compare Peptides</h2>
              <p className="pb-section-copy">Side-by-side comparison cards support examples like Semaglutide vs Tirzepatide, BPC-157 vs TB-500, and CJC-1295 vs Ipamorelin.</p>
            </div>
          </div>
          <div className="pb-panel">
            <div className="pb-inline-grid">
              <label>
                <div className="pb-subtle">Left peptide</div>
                <select className="pb-select" value={compareLeft} onChange={(e) => setCompareLeft(e.target.value)}>
                  {peptides.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
              </label>
              <label>
                <div className="pb-subtle">Right peptide</div>
                <select className="pb-select" value={compareRight} onChange={(e) => setCompareRight(e.target.value)}>
                  {peptides.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
              </label>
            </div>
            {comparison ? (
              <div className="pb-side-by-side-list" style={{ marginTop: 18 }}>
                <div className="pb-side-by-side-row">
                  <div className="pb-fact-label">Field</div>
                  <strong>{comparison.left.name}</strong>
                  <strong>{comparison.right.name}</strong>
                </div>
                {comparison.rows.map(([label, left, right]) => (
                  <div key={label} className="pb-side-by-side-row">
                    <div className="pb-fact-label">{label}</div>
                    <div>{left}</div>
                    <div>{right}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {sectionCards("Recently Updated Peptides", "This panel is wired for future PubMed refresh automation and currently highlights entries already normalized into the new content model.", sections.recentlyUpdated)}

        <section id="research" className="pb-section">
          <div className="pb-section-head">
            <div>
              <h2 className="pb-section-title">Research Hub</h2>
              <p className="pb-section-copy">Live PubMed integration, personal research library, and Favorite Researchers are surfaced as dedicated product areas instead of being buried inside one page.</p>
            </div>
          </div>
          <div className="pb-card-grid">
            <div className="pb-card">
              <h3 className="pb-card-title">PubMed Research Feed</h3>
              <p className="pb-body">The app architecture now has a dedicated section ready for peptide-filtered PubMed feed results with title, journal, year, and study links.</p>
            </div>
            <div className="pb-card">
              <h3 className="pb-card-title">Personal Research Library</h3>
              <p className="pb-body">Saved peptides, inventory, injection logs, and bookmarked studies are grouped under the dashboard flow so future authentication and paywall rules can be layered cleanly.</p>
            </div>
            <div className="pb-card">
              <h3 className="pb-card-title">Favorite Researchers</h3>
              <p className="pb-body">A dedicated page is prepared for researcher photos, specialties, social links, and published work without mixing it into peptide detail pages.</p>
              <Link href="/favorite-researchers" className="pb-button-secondary">Open page</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="pb-footer">
        <div className="pb-footer-inner">
          <div>PeptaBase © 2026</div>
          <div>Built for readable research workflows, calculator access, and future Supabase-backed accounts.</div>
        </div>
      </footer>
    </div>
  );
}
