"use client";

import Link from "next/link";
import { ReconstitutionCalculator } from "@/components/peptabase/Calculators";
import LiveResearchFeed from "@/components/peptabase/LiveResearchFeed";

function ReferenceList({ references }) {
  if (!references.length) {
    return <div className="pb-empty">Research references will appear here as verified links are added.</div>;
  }

  return (
    <div className="pb-reference-list">
      {references.map((reference) => (
        <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer" className="pb-reference-item">
          <strong>{reference.title}</strong>
          <div className="pb-subtle">
            {[reference.journal, reference.year].filter(Boolean).join(" · ") || "PubMed link"}
          </div>
        </a>
      ))}
    </div>
  );
}

export default function PeptideDetailView({ peptide }) {
  return (
    <div className="pb-shell">
      <div className="pb-warning-banner">⚠ FOR EDUCATIONAL &amp; RESEARCH PURPOSES ONLY — NOT FOR HUMAN CONSUMPTION — NOT MEDICAL ADVICE</div>
      <header className="pb-header">
        <div className="pb-header-inner">
          <Link href="/" className="pb-brand">
            <span className="pb-brand-mark">Peptide and bioregulator research platform</span>
            <span className="pb-brand-name">PeptaBase</span>
          </Link>
          <nav className="pb-nav">
            <Link href="/">Home</Link>
            <Link href="/#database">Database</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/favorite-researchers">Favorite Researchers</Link>
          </nav>
        </div>
      </header>

      <main className="pb-main">
        <section className="pb-section">
          <div className="pb-section-head">
            <div>
              <div className="pb-eyebrow">{peptide.category}</div>
              <h1 className="pb-detail-title">{peptide.name}</h1>
              {peptide.aliases.length ? <p className="pb-section-copy">Also known as {peptide.aliases.join(", ")}</p> : null}
            </div>
            <Link href="/#database" className="pb-button-secondary">Back to database</Link>
          </div>

          <div className="pb-detail-layout">
            <div className="pb-link-list">
              <section className="pb-detail-section">
                <h2>Overview</h2>
                <p className="pb-body">{peptide.overview}</p>
              </section>
              <section className="pb-detail-section">
                <h2>Mechanism of Action</h2>
                <p className="pb-body">{peptide.mechanismOfAction}</p>
              </section>
              <section className="pb-detail-section">
                <h2>Research Applications</h2>
                <div className="pb-link-list">
                  {peptide.researchApplications.map((item) => (
                    <div key={item} className="pb-fact-row">{item}</div>
                  ))}
                </div>
              </section>
              <section className="pb-detail-section">
                <h2>Dose Range</h2>
                <p className="pb-body">{peptide.doseRange}</p>
              </section>
              <section className="pb-detail-section">
                <h2>Common Cycle Length</h2>
                <p className="pb-body">{peptide.commonCycleLength}</p>
              </section>
              <section className="pb-detail-section">
                <h2>Break Before Continuing</h2>
                <p className="pb-body">{peptide.breakBeforeContinuing}</p>
              </section>
              <section className="pb-detail-section">
                <h2>Administration Notes</h2>
                <p className="pb-body">{peptide.administrationNotes}</p>
              </section>
              <section className="pb-detail-section">
                <h2>FDA Approval Status or Development Stage</h2>
                <div className="pb-link-list">
                  <div className="pb-fact-row"><strong>FDA Status:</strong> {peptide.fdaStatus}</div>
                  <div className="pb-fact-row"><strong>Development Stage:</strong> {peptide.developmentStage}</div>
                </div>
              </section>
              <section className="pb-detail-section">
                <h2>Research References</h2>
                <ReferenceList references={peptide.references} />
              </section>
              <LiveResearchFeed peptideName={peptide.name} compact />
              <section className="pb-detail-section">
                <h2>Warning Section</h2>
                <div className="pb-warning-box" style={{ whiteSpace: "pre-line" }}>{peptide.warning}</div>
              </section>
              <section className="pb-detail-section">
                <h2>Submit Notes to Developer</h2>
                <p className="pb-body">
                  Researchers can submit corrections, observations, or research insights through the dashboard once Supabase is connected. The schema and UI hooks are prepared for administrator review of these submissions.
                </p>
              </section>
            </div>

            <div className="pb-link-list">
              <aside className="pb-quick-facts">
                <h2>Quick Facts</h2>
                <div className="pb-facts-grid">
                  <div className="pb-fact-row"><div className="pb-fact-label">Category</div><div>{peptide.quickFacts.category}</div></div>
                  <div className="pb-fact-row"><div className="pb-fact-label">Typical Dose</div><div>{peptide.quickFacts.typicalDose}</div></div>
                  <div className="pb-fact-row"><div className="pb-fact-label">Common Cycle</div><div>{peptide.quickFacts.commonCycle}</div></div>
                  <div className="pb-fact-row"><div className="pb-fact-label">Break Duration</div><div>{peptide.quickFacts.breakDuration}</div></div>
                  <div className="pb-fact-row"><div className="pb-fact-label">Administration</div><div>{peptide.quickFacts.administration}</div></div>
                  <div className="pb-fact-row"><div className="pb-fact-label">FDA Status</div><div>{peptide.quickFacts.fdaStatus}</div></div>
                </div>
                <div className="pb-link-list" style={{ marginTop: 16 }}>
                  <div className="pb-fact-row"><div className="pb-fact-label">Development Stage</div><div>{peptide.developmentStage}</div></div>
                  <div className="pb-fact-row"><div className="pb-fact-label">Half-Life</div><div>{peptide.halfLife}</div></div>
                  <div className="pb-fact-row"><div className="pb-fact-label">Last Updated</div><div>{peptide.updatedLabel}</div></div>
                </div>
              </aside>
              <ReconstitutionCalculator />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
