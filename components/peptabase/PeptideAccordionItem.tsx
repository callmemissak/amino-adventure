"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import SavedPeptideButton from "@/components/peptabase/SavedPeptideButton";

const LiveResearchFeed = dynamic(() => import("@/components/peptabase/LiveResearchFeed"), {
  loading: () => <div className="pb-empty">Loading PubMed studies...</div>
});

type ReferenceEntry = {
  id?: string;
  pmid?: string;
  title?: string;
  journal?: string;
  year?: string;
  url?: string;
};

type LinkEntry = {
  href: string;
  label: string;
};

type StackEntry = {
  name: string;
  focus: string;
};

type PeptideEntry = {
  slug: string;
  name: string;
  aliases?: string[];
  category?: string;
  kind?: string;
  overview?: string;
  mechanismOfAction?: string;
  researchApplications?: string[];
  doseRange?: string;
  commonCycleLength?: string;
  breakBeforeContinuing?: string;
  administrationNotes?: string;
  mechanismSummary?: string;
  primaryReceptor?: string;
  biologicalPathway?: string;
  clinicalTrialsCount?: number | null;
  animalStudiesCount?: number | null;
  mechanisticStudiesCount?: number | null;
  evidenceLevel?: string;
  firstDiscoveredYear?: string;
  commonResearchGoals?: string[];
  stackSynergies?: string[];
  knownLimitations?: string;
  safetyNotes?: string;
  reviewedBy?: string;
  reviewDate?: string;
  revisionNotes?: string;
  citationCount?: number | null;
  administration?: string;
  halfLife?: string;
  fdaStatus?: string;
  developmentStage?: string;
  keywords?: string[];
  references?: ReferenceEntry[];
  pubmedQuery?: string;
  quickFacts?: {
    typicalDose?: string;
    commonCycle?: string;
    breakDuration?: string;
    administration?: string;
    fdaStatus?: string;
  };
};

function renderList(items?: string[]) {
  if (!items || items.length === 0) {
    return "Not yet added";
  }

  return items.join(", ");
}

function DetailBlock({ label, value, children }: { label: string; value?: string; children?: ReactNode }) {
  const content = children ?? value ?? "Not yet added";

  return (
    <div className="pb-detail-block">
      <div className="pb-fact-label">{label}</div>
      <div className="pb-body">{content}</div>
    </div>
  );
}

function CitationCard({ reference }: { reference: ReferenceEntry }) {
  return (
    <a href={reference.url} target="_blank" rel="noopener noreferrer" className="pb-reference-item">
      <strong>{reference.title || reference.url}</strong>
      <div className="pb-subtle">
        {reference.pmid ? `PMID ${reference.pmid}` : "Source link"}
        {reference.journal ? ` | ${reference.journal}` : ""}
        {reference.year ? ` | ${reference.year}` : ""}
      </div>
    </a>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="pb-fact-row pb-stat-card">
      <div className="pb-fact-label">{label}</div>
      <strong className="pb-stat-value" title={String(value)}>
        {value}
      </strong>
    </div>
  );
}

function SectionCard({
  title,
  children,
  className = ""
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`pb-section-card ${className}`.trim()}>
      <div className="pb-section-card-head">
        <div className="pb-section-block-title">{title}</div>
      </div>
      <div className="pb-section-card-grid">{children}</div>
    </section>
  );
}

function SecondaryDisclosure({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="pb-secondary-disclosure">
      <summary className="pb-secondary-summary">
        <span>{title}</span>
        <span className="pb-secondary-summary-note">Optional details</span>
      </summary>
      <div className="pb-secondary-body">{children}</div>
    </details>
  );
}

function SectionDisclosure({
  title,
  children,
  defaultOpen = false
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="pb-section-disclosure" open={defaultOpen}>
      <summary className="pb-section-disclosure-summary">
        <span>{title}</span>
      </summary>
      <div className="pb-section-disclosure-body">{children}</div>
    </details>
  );
}

export default function PeptideAccordionItem({
  peptide,
  open,
  onToggle,
  relatedPeptides,
  comparisonLinks,
  stacks,
  evidenceLevel,
  lastReviewedDate,
  calculatorHref
}: {
  peptide: PeptideEntry;
  open: boolean;
  onToggle: () => void;
  relatedPeptides: PeptideEntry[];
  comparisonLinks: LinkEntry[];
  stacks: StackEntry[];
  evidenceLevel: string;
  lastReviewedDate: string;
  calculatorHref: string;
}) {
  const [copied, setCopied] = useState(false);
  const aliases = peptide.aliases?.length ? peptide.aliases.join(" | ") : "Not yet added";
  const keywordList = peptide.keywords?.length ? peptide.keywords : [];
  const previewTags = [peptide.kind, ...keywordList.slice(0, 1)].filter(Boolean) as string[];
  const researchGoals = peptide.commonResearchGoals?.length ? peptide.commonResearchGoals : peptide.researchApplications ?? [];
  const references = peptide.references?.filter((reference) => reference.url) ?? [];

  async function handleCopyLink() {
    if (typeof window === "undefined" || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(`${window.location.origin}/peptides/${peptide.slug}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <article className={`pb-accordion-item ${open ? "is-open" : ""}`} id={`peptide-${peptide.slug}`}>
      <button
        type="button"
        className="pb-accordion-trigger"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`peptide-panel-${peptide.slug}`}
      >
        <div className="pb-accordion-main">
          <div className="pb-accordion-heading">
            <div className="pb-accordion-title-row">
              <h2 className="pb-accordion-title">{peptide.name}</h2>
              <span className="pb-chip">{peptide.category || "Uncategorized"}</span>
            </div>
            <p className="pb-accordion-summary">{peptide.overview || peptide.mechanismSummary || peptide.mechanismOfAction || "Research summary coming soon."}</p>
            <div className="pb-accordion-meta">
              {previewTags.map((tag) => (
                <span key={tag} className="pb-preview-tag">{tag}</span>
              ))}
              <span className="pb-preview-tag">Evidence: {evidenceLevel}</span>
            </div>
          </div>
        </div>

        <div className="pb-accordion-side">
          <div className="pb-accordion-quick">
            <div className="pb-fact-row pb-stat-card pb-stat-card-compact">
              <span className="pb-fact-label">Dose</span>
              <strong className="pb-stat-value" title={peptide.doseRange || "Pending"}>
                {peptide.doseRange || "Pending"}
              </strong>
            </div>
            <div className="pb-fact-row pb-stat-card pb-stat-card-compact">
              <span className="pb-fact-label">Half-life</span>
              <strong className="pb-stat-value" title={peptide.halfLife || "Pending"}>
                {peptide.halfLife || "Pending"}
              </strong>
            </div>
          </div>
          <span className="pb-accordion-toggle">{open ? "Collapse entry" : "Open entry"}</span>
        </div>
      </button>

      {open ? (
        <div id={`peptide-panel-${peptide.slug}`} className="pb-accordion-panel">
          <div className="pb-expanded-hero">
            <div className="pb-expanded-copy">
              <h3 className="pb-expanded-title">{peptide.name}</h3>
              <p className="pb-expanded-summary">{peptide.overview || peptide.mechanismSummary || peptide.mechanismOfAction || "Research summary coming soon."}</p>
              <div className="pb-expanded-meta">
                <span>{peptide.category || "Research peptide"}</span>
                <span>{peptide.evidenceLevel || evidenceLevel}</span>
                <span>Reviewed {peptide.reviewDate || lastReviewedDate}</span>
              </div>
            </div>
          </div>

          <div className="pb-reading-strip">
            <StatCard label="Dose Range" value={peptide.doseRange || "Pending"} />
            <StatCard label="Half-life" value={peptide.halfLife || "Pending"} />
            <StatCard label="Evidence Level" value={peptide.evidenceLevel || evidenceLevel} />
          </div>

          <div className="pb-accordion-content pb-reading-flow">
            <SectionDisclosure title="Overview" defaultOpen>
              <SectionCard title="Overview">
                <DetailBlock label="Aliases" value={aliases} />
                <DetailBlock label="Administration" value={peptide.administration || peptide.administrationNotes} />
                <DetailBlock label="Common Cycle Length" value={peptide.commonCycleLength} />
                <DetailBlock label="Break Before Continuing" value={peptide.breakBeforeContinuing} />
              </SectionCard>
            </SectionDisclosure>

            <SectionDisclosure title="Mechanism">
              <SectionCard title="Mechanism">
                <DetailBlock label="Mechanism Summary" value={peptide.mechanismSummary || peptide.mechanismOfAction} />
                <DetailBlock label="Primary Receptor" value={peptide.primaryReceptor} />
                <DetailBlock label="Biological Pathway" value={peptide.biologicalPathway} />
                <DetailBlock label="First Discovered Year" value={peptide.firstDiscoveredYear} />
              </SectionCard>
            </SectionDisclosure>

            <SectionDisclosure title="Evidence">
              <SectionCard title="Evidence">
                <div className="pb-evidence-stats">
                  <StatCard label="Evidence Level" value={peptide.evidenceLevel || evidenceLevel} />
                  <StatCard label="Clinical Trials" value={peptide.clinicalTrialsCount ?? "0"} />
                  <StatCard label="Animal Studies" value={peptide.animalStudiesCount ?? "0"} />
                  <StatCard label="Mechanistic Studies" value={peptide.mechanisticStudiesCount ?? "0"} />
                </div>
                <DetailBlock label="Known Limitations" value={peptide.knownLimitations} />
                <DetailBlock label="Safety Notes" value={peptide.safetyNotes} />
              </SectionCard>
            </SectionDisclosure>

            <SectionDisclosure title="Research Applications">
              <SectionCard title="Research Applications">
                <DetailBlock label="Research Applications" value={renderList(peptide.researchApplications)} />
                <DetailBlock label="Common Research Goals" value={renderList(researchGoals)} />
              </SectionCard>
            </SectionDisclosure>

            <SectionDisclosure title="Studies">
              <SectionCard title="Studies" className="pb-section-card-wide">
                <div className="pb-studies-header">
                  <p className="pb-body">
                    Direct source links and PubMed references stay visible here so each entry reads like a useful research record.
                  </p>
                </div>
                {references.length > 0 ? (
                  <div className="pb-reference-list">
                    {references.map((reference, index) => (
                      <CitationCard key={`${peptide.slug}-reference-${index}`} reference={reference} />
                    ))}
                  </div>
                ) : (
                  <div className="pb-empty">No direct source links are attached to this entry yet.</div>
                )}
                <div className="pb-live-feed-block">
                  <div className="pb-section-block-title">Live PubMed Feed</div>
                  <LiveResearchFeed peptideName={peptide.pubmedQuery || peptide.name} compact />
                </div>
              </SectionCard>
            </SectionDisclosure>

            <SecondaryDisclosure title="Editorial review, quick facts, and related tools">
              <div className="pb-secondary-grid">
                <div className="pb-review-block pb-review-block-compact">
                  <div className="pb-review-block-grid">
                    <StatCard label="Reviewed By" value={peptide.reviewedBy || "PeptaBase editorial review"} />
                    <StatCard label="Evidence Level" value={peptide.evidenceLevel || evidenceLevel} />
                    <StatCard label="Citation Count" value={peptide.citationCount ?? references.length} />
                  </div>
                  {peptide.revisionNotes ? (
                    <div className="pb-review-block-notes">
                      <div className="pb-fact-label">Revision Notes</div>
                      <div className="pb-body">{peptide.revisionNotes}</div>
                    </div>
                  ) : null}
                </div>

                <div className="pb-quick-facts">
                  <h3 className="pb-card-title">Quick Facts</h3>
                  <div className="pb-link-list">
                    <div className="pb-fact-row pb-stat-card">
                      <div className="pb-fact-label">Typical Dose</div>
                      <strong className="pb-stat-value" title={peptide.quickFacts?.typicalDose || peptide.doseRange || "Pending"}>
                        {peptide.quickFacts?.typicalDose || peptide.doseRange || "Pending"}
                      </strong>
                    </div>
                    <div className="pb-fact-row pb-stat-card">
                      <div className="pb-fact-label">Cycle</div>
                      <strong className="pb-stat-value" title={peptide.quickFacts?.commonCycle || peptide.commonCycleLength || "Pending"}>
                        {peptide.quickFacts?.commonCycle || peptide.commonCycleLength || "Pending"}
                      </strong>
                    </div>
                    <div className="pb-fact-row pb-stat-card">
                      <div className="pb-fact-label">Administration</div>
                      <strong className="pb-stat-value" title={peptide.quickFacts?.administration || peptide.administration || "Pending"}>
                        {peptide.quickFacts?.administration || peptide.administration || "Pending"}
                      </strong>
                    </div>
                    <div className="pb-fact-row pb-stat-card">
                      <div className="pb-fact-label">FDA Status</div>
                      <strong className="pb-stat-value" title={peptide.quickFacts?.fdaStatus || peptide.fdaStatus || "Pending"}>
                        {peptide.quickFacts?.fdaStatus || peptide.fdaStatus || "Pending"}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pb-secondary-grid">
                <SectionCard title="Keywords + Related Peptides">
                  <div className="pb-tag-row">
                    {keywordList.length > 0 ? keywordList.map((keyword) => <span key={keyword} className="pb-preview-tag">{keyword}</span>) : <span className="pb-body">No keywords added yet.</span>}
                  </div>
                  <div className="pb-inline-link-list">
                    {relatedPeptides.length > 0 ? relatedPeptides.map((entry) => (
                      <Link key={entry.slug} href={`/peptides/${entry.slug}`} className="pb-inline-link">
                        {entry.name}
                      </Link>
                    )) : <span className="pb-body">No closely related entries are linked yet.</span>}
                  </div>
                </SectionCard>

                <SectionCard title="Compare + Workflow">
                  <div className="pb-inline-link-list">
                    {comparisonLinks.length > 0 ? comparisonLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="pb-inline-link">
                        {link.label}
                      </Link>
                    )) : null}
                    {stacks.length > 0 ? stacks.map((stack) => (
                      <Link key={stack.name} href="/peptide-stacks" className="pb-inline-link">
                        {stack.name}
                      </Link>
                    )) : null}
                    <Link href={calculatorHref} className="pb-inline-link">Open matching calculator</Link>
                  </div>
                  <div className="pb-inline-actions">
                    <button type="button" className="pb-button-secondary" onClick={handleCopyLink}>
                      {copied ? "Link copied" : "Copy peptide link"}
                    </button>
                    <SavedPeptideButton slug={peptide.slug} name={peptide.name} />
                    <Link href="/dashboard" className="pb-button-secondary">Open dashboard</Link>
                  </div>
                </SectionCard>
              </div>
            </SecondaryDisclosure>

            <div className="pb-warning-box">
              <strong>Educational &amp; Research Use Only.</strong>
              <div className="pb-body">
                This website provides educational information regarding peptides and bioregulators for research purposes only. It does not constitute medical advice. Always consult a licensed physician for medical guidance. Personal use of research compounds outside supervised research carries unknown risks and benefits and is not advised.
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
