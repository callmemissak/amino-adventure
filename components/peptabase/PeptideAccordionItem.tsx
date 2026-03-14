"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
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
    <div className="pb-fact-row">
      <div className="pb-fact-label">{label}</div>
      <strong>{value}</strong>
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
  const previewTags = [peptide.kind, ...keywordList.slice(0, 2)].filter(Boolean) as string[];
  const researchGoals = peptide.commonResearchGoals?.length ? peptide.commonResearchGoals : peptide.researchApplications ?? [];
  const stackSynergies = peptide.stackSynergies?.length ? peptide.stackSynergies : [];
  const references = peptide.references?.filter((reference) => reference.url) ?? [];
  const pubmedReferences = useMemo(
    () => references.filter((reference) => reference.url?.includes("pubmed.ncbi.nlm.nih.gov")),
    [references]
  );

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
            <span>
              <span className="pb-fact-label">Dose</span>
              <strong>{peptide.doseRange || "Pending"}</strong>
            </span>
            <span>
              <span className="pb-fact-label">Half-life</span>
              <strong>{peptide.halfLife || "Pending"}</strong>
            </span>
          </div>
          <span className="pb-accordion-toggle">{open ? "Collapse entry" : "Open entry"}</span>
        </div>
      </button>

      {open ? (
        <div id={`peptide-panel-${peptide.slug}`} className="pb-accordion-panel">
          <div className="pb-expanded-hero">
            <div className="pb-expanded-copy">
              <div className="pb-inline-link-list">
                <span className="pb-chip">{peptide.category || "Research peptide"}</span>
                {peptide.kind ? <span className="pb-pill">{peptide.kind}</span> : null}
                <span className="pb-pill">{peptide.evidenceLevel || evidenceLevel}</span>
              </div>
              <h3 className="pb-expanded-title">{peptide.name}</h3>
              <p className="pb-expanded-summary">{peptide.overview || peptide.mechanismSummary || peptide.mechanismOfAction || "Research summary coming soon."}</p>
              <div className="pb-section-nav">
                {["Overview", "Mechanism", "Dosing", "Evidence", "Studies"].map((label) => (
                  <span key={label} className="pb-section-chip">{label}</span>
                ))}
              </div>
            </div>

            <div className="pb-review-block">
              <div className="pb-review-block-head">
                <div>
                  <div className="pb-eyebrow">Research Review</div>
                  <h3 className="pb-card-title">Editorial credibility snapshot</h3>
                </div>
              </div>
              <div className="pb-review-block-grid">
                <StatCard label="Reviewed By" value={peptide.reviewedBy || "PeptaBase editorial review"} />
                <StatCard label="Review Date" value={peptide.reviewDate || lastReviewedDate} />
                <StatCard label="Evidence Level" value={peptide.evidenceLevel || evidenceLevel} />
                <StatCard label="Citation Count" value={peptide.citationCount ?? references.length} />
              </div>
              <div className="pb-review-block-notes">
                <div className="pb-fact-label">Revision Notes</div>
                <div className="pb-body">{peptide.revisionNotes || "No revision notes have been added for this entry yet."}</div>
              </div>
            </div>
          </div>

          <div className="pb-accordion-grid">
            <div className="pb-accordion-content">
              <div className="pb-section-grid">
                <SectionCard title="Overview">
                  <DetailBlock label="Aliases" value={aliases} />
                  <DetailBlock label="Research Applications" value={renderList(peptide.researchApplications)} />
                  <DetailBlock label="Common Research Goals" value={renderList(researchGoals)} />
                  <DetailBlock label="Keywords / Tags">
                    <div className="pb-tag-row">
                      {keywordList.length > 0 ? keywordList.map((keyword) => <span key={keyword} className="pb-preview-tag">{keyword}</span>) : "Not yet added"}
                    </div>
                  </DetailBlock>
                </SectionCard>

                <SectionCard title="Mechanism">
                  <DetailBlock label="Mechanism Summary" value={peptide.mechanismSummary || peptide.mechanismOfAction} />
                  <DetailBlock label="Primary Receptor" value={peptide.primaryReceptor} />
                  <DetailBlock label="Biological Pathway" value={peptide.biologicalPathway} />
                  <DetailBlock label="First Discovered Year" value={peptide.firstDiscoveredYear} />
                </SectionCard>
              </div>

              <div className="pb-section-grid">
                <SectionCard title="Dosing">
                  <DetailBlock label="Dose Range" value={peptide.doseRange} />
                  <DetailBlock label="Common Cycle Length" value={peptide.commonCycleLength} />
                  <DetailBlock label="Break Before Continuing" value={peptide.breakBeforeContinuing} />
                  <DetailBlock label="Administration" value={peptide.administration || peptide.administrationNotes} />
                </SectionCard>

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
              </div>

              <SectionCard title="Studies" className="pb-section-card-wide">
                <div className="pb-studies-header">
                  <p className="pb-body">
                    Direct source links and PubMed references stay visible here so each entry remains useful as a research record, not just a summary card.
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
              </SectionCard>

              <div className="pb-link-module-grid">
                <SectionCard title="Related Peptides">
                  <div className="pb-inline-link-list">
                    {relatedPeptides.length > 0 ? relatedPeptides.map((entry) => (
                      <Link key={entry.slug} href={`/peptides/${entry.slug}`} className="pb-inline-link">
                        {entry.name}
                      </Link>
                    )) : <span className="pb-body">No closely related entries are linked yet.</span>}
                  </div>
                </SectionCard>

                <SectionCard title="Compare + Tools">
                  <div className="pb-inline-link-list">
                    {comparisonLinks.length > 0 ? comparisonLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="pb-inline-link">
                        {link.label}
                      </Link>
                    )) : null}
                    <Link href={calculatorHref} className="pb-inline-link">Open matching calculator</Link>
                    <Link href="/saved-peptides" className="pb-inline-link">View saved peptides</Link>
                  </div>
                </SectionCard>
              </div>

              <SectionCard title="Stacks + Workflow">
                <div className="pb-inline-link-list">
                  {stacks.length > 0 ? stacks.map((stack) => (
                    <Link key={stack.name} href="/peptide-stacks" className="pb-inline-link">
                      {stack.name}: {stack.focus}
                    </Link>
                  )) : <span className="pb-body">No stack templates are tied to this peptide yet.</span>}
                </div>
                <div className="pb-inline-actions">
                  <button type="button" className="pb-button-secondary" onClick={handleCopyLink}>
                    {copied ? "Link copied" : "Copy peptide link"}
                  </button>
                  <SavedPeptideButton slug={peptide.slug} name={peptide.name} />
                  <Link href="/dashboard" className="pb-button-secondary">Open dashboard</Link>
                </div>
              </SectionCard>

              <div className="pb-warning-box">
                <strong>Educational &amp; Research Use Only.</strong>
                <div className="pb-body">
                  This website provides educational information regarding peptides and bioregulators for research purposes only. It does not constitute medical advice. Always consult a licensed physician for medical guidance. Personal use of research compounds outside supervised research carries unknown risks and benefits and is not advised.
                </div>
              </div>
            </div>

            <aside className="pb-accordion-aside">
              <div className="pb-quick-facts">
                <h3 className="pb-card-title">Quick Facts</h3>
                <div className="pb-link-list">
                  <div className="pb-fact-row">
                    <div className="pb-fact-label">Typical Dose</div>
                    <strong>{peptide.quickFacts?.typicalDose || peptide.doseRange || "Pending"}</strong>
                  </div>
                  <div className="pb-fact-row">
                    <div className="pb-fact-label">Cycle</div>
                    <strong>{peptide.quickFacts?.commonCycle || peptide.commonCycleLength || "Pending"}</strong>
                  </div>
                  <div className="pb-fact-row">
                    <div className="pb-fact-label">Half-life</div>
                    <strong>{peptide.halfLife || "Pending"}</strong>
                  </div>
                  <div className="pb-fact-row">
                    <div className="pb-fact-label">Administration</div>
                    <strong>{peptide.quickFacts?.administration || peptide.administration || "Pending"}</strong>
                  </div>
                  <div className="pb-fact-row">
                    <div className="pb-fact-label">FDA Status</div>
                    <strong>{peptide.quickFacts?.fdaStatus || peptide.fdaStatus || "Pending"}</strong>
                  </div>
                  <div className="pb-fact-row">
                    <div className="pb-fact-label">Development Stage</div>
                    <strong>{peptide.developmentStage || "Pending"}</strong>
                  </div>
                </div>
              </div>

              <LiveResearchFeed peptideName={peptide.pubmedQuery || peptide.name} compact />
            </aside>
          </div>
        </div>
      ) : null}
    </article>
  );
}
