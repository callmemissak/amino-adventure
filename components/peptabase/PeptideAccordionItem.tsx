"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

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

function SectionBlock({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="pb-section-block">
      <div className="pb-section-block-title">{title}</div>
      <div className="pb-section-block-grid">{children}</div>
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
  const researchGoals = peptide.commonResearchGoals?.length ? peptide.commonResearchGoals : peptide.researchApplications ?? [];
  const stackSynergies = peptide.stackSynergies?.length ? peptide.stackSynergies : [];
  const references = peptide.references?.filter((reference) => reference.url) ?? [];
  const pubmedReferences = useMemo(
    () => references.filter((reference) => reference.url?.includes("pubmed.ncbi.nlm.nih.gov")),
    [references]
  );

  async function handleCopyLink() {
    if (typeof window === "undefined") {
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
            <h2 className="pb-accordion-title">{peptide.name}</h2>
            <div className="pb-accordion-meta">
              <span className="pb-chip">{peptide.category || "Uncategorized"}</span>
              {peptide.kind ? <span className="pb-pill">{peptide.kind}</span> : null}
              <span className="pb-pill">Evidence: {evidenceLevel}</span>
            </div>
          </div>
          <p className="pb-accordion-summary">{peptide.overview || peptide.mechanismOfAction || "Research summary coming soon."}</p>
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
            <span>
              <span className="pb-fact-label">Reviewed</span>
              <strong>{lastReviewedDate}</strong>
            </span>
          </div>
          <span className="pb-accordion-toggle">{open ? "Collapse" : "Expand"}</span>
        </div>
      </button>

      {open ? (
        <div id={`peptide-panel-${peptide.slug}`} className="pb-accordion-panel">
          <div className="pb-accordion-grid">
            <div className="pb-accordion-content">
              <SectionBlock title="Mechanism">
                <DetailBlock label="Overview" value={peptide.overview} />
                <DetailBlock label="Mechanism Summary" value={peptide.mechanismSummary || peptide.mechanismOfAction} />
                <DetailBlock label="Primary Receptor" value={peptide.primaryReceptor} />
                <DetailBlock label="Mechanism of Action" value={peptide.mechanismOfAction} />
              </SectionBlock>

              <SectionBlock title="Biological Pathway">
                <DetailBlock label="Biological Pathway" value={peptide.biologicalPathway} />
                <DetailBlock label="Administration" value={peptide.administration} />
                <DetailBlock label="Half-life" value={peptide.halfLife} />
                <DetailBlock label="First Discovered Year" value={peptide.firstDiscoveredYear} />
              </SectionBlock>

              <SectionBlock title="Evidence">
                <div className="pb-evidence-stats">
                  <StatCard label="Evidence Level" value={peptide.evidenceLevel || evidenceLevel} />
                  <StatCard label="Citation Count" value={peptide.citationCount ?? references.length} />
                  <StatCard label="Clinical Trials" value={peptide.clinicalTrialsCount ?? "0"} />
                  <StatCard label="Animal Studies" value={peptide.animalStudiesCount ?? "0"} />
                  <StatCard label="Mechanistic Studies" value={peptide.mechanisticStudiesCount ?? "0"} />
                  <StatCard label="PubMed Links" value={pubmedReferences.length} />
                </div>
              </SectionBlock>

              <SectionBlock title="Research Goals">
                <DetailBlock label="Common Research Goals" value={renderList(researchGoals)} />
                <DetailBlock label="Stack Synergies" value={renderList(stackSynergies)} />
                <DetailBlock label="Research Applications" value={renderList(peptide.researchApplications)} />
                <DetailBlock label="Aliases" value={aliases} />
              </SectionBlock>

              <SectionBlock title="Limitations">
                <DetailBlock label="Known Limitations" value={peptide.knownLimitations} />
                <DetailBlock label="Dose Range" value={peptide.doseRange} />
                <DetailBlock label="Common Cycle Length" value={peptide.commonCycleLength} />
                <DetailBlock label="Administration Notes" value={peptide.administrationNotes} />
              </SectionBlock>

              <SectionBlock title="Safety Notes">
                <DetailBlock label="Safety Notes" value={peptide.safetyNotes} />
                <DetailBlock label="FDA Status" value={peptide.fdaStatus} />
                <DetailBlock label="Development Stage" value={peptide.developmentStage} />
                <DetailBlock label="Break Before Continuing" value={peptide.breakBeforeContinuing} />
              </SectionBlock>

              <SectionBlock title="Editorial Review">
                <DetailBlock label="Reviewed By" value={peptide.reviewedBy} />
                <DetailBlock label="Review Date" value={peptide.reviewDate || lastReviewedDate} />
                <DetailBlock label="Revision Notes" value={peptide.revisionNotes} />
                <DetailBlock label="Keywords / Tags">
                  <div className="pb-tag-row">
                    {keywordList.length > 0 ? keywordList.map((keyword) => <span key={keyword} className="pb-pill">{keyword}</span>) : "Not yet added"}
                  </div>
                </DetailBlock>
              </SectionBlock>

              <div className="pb-detail-block pb-citation-block">
                <div className="pb-fact-label">Citation Snapshot</div>
                <div className="pb-link-list">
                  <StatCard label="Last reviewed" value={peptide.reviewDate || lastReviewedDate} />
                  <StatCard label="Evidence level" value={peptide.evidenceLevel || evidenceLevel} />
                  <StatCard label="Source links" value={references.length} />
                  <StatCard label="PubMed links" value={pubmedReferences.length} />
                </div>
              </div>

              {references.length > 0 ? (
                <div className="pb-detail-block">
                  <div className="pb-fact-label">Source Links</div>
                  <div className="pb-reference-list">
                    {references.map((reference, index) => (
                      <CitationCard key={`${peptide.slug}-reference-${index}`} reference={reference} />
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="pb-link-module-grid">
                <div className="pb-detail-block">
                  <div className="pb-fact-label">Related Peptides</div>
                  <div className="pb-inline-link-list">
                    {relatedPeptides.map((entry) => (
                      <Link key={entry.slug} href={`/peptides/${entry.slug}`} className="pb-inline-link">
                        {entry.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pb-detail-block">
                  <div className="pb-fact-label">Compare Peptides</div>
                  <div className="pb-inline-link-list">
                    {comparisonLinks.length > 0 ? comparisonLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="pb-inline-link">
                        {link.label}
                      </Link>
                    )) : <span className="pb-body">Comparison module coming soon.</span>}
                  </div>
                </div>
              </div>

              <div className="pb-link-module-grid">
                <div className="pb-detail-block">
                  <div className="pb-fact-label">Common Stacks</div>
                  <div className="pb-inline-link-list">
                    {stacks.length > 0 ? stacks.map((stack) => (
                      <Link key={stack.name} href="/peptide-stacks" className="pb-inline-link">
                        {stack.name}: {stack.focus}
                      </Link>
                    )) : <span className="pb-body">No stack templates are tied to this peptide yet.</span>}
                  </div>
                </div>

                <div className="pb-detail-block">
                  <div className="pb-fact-label">Calculator + Save Tools</div>
                  <div className="pb-inline-link-list">
                    <Link href={calculatorHref} className="pb-inline-link">Open matching calculator</Link>
                    <Link href="/dashboard" className="pb-inline-link">Save to My Library</Link>
                    <Link href="/dashboard" className="pb-inline-link">Bookmark or favorite</Link>
                  </div>
                </div>
              </div>

              <div className="pb-inline-actions">
                <button type="button" className="pb-button-secondary" onClick={handleCopyLink}>
                  {copied ? "Link copied" : "Copy peptide link"}
                </button>
                <Link href="/dashboard" className="pb-button-secondary">Save in dashboard</Link>
                <Link href="/calculator" className="pb-button-secondary">Browse calculators</Link>
              </div>

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
                    <div className="pb-fact-label">Category</div>
                    <strong>{peptide.category || "Pending"}</strong>
                  </div>
                  <div className="pb-fact-row">
                    <div className="pb-fact-label">Typical Dose</div>
                    <strong>{peptide.quickFacts?.typicalDose || peptide.doseRange || "Pending"}</strong>
                  </div>
                  <div className="pb-fact-row">
                    <div className="pb-fact-label">Common Cycle</div>
                    <strong>{peptide.quickFacts?.commonCycle || peptide.commonCycleLength || "Pending"}</strong>
                  </div>
                  <div className="pb-fact-row">
                    <div className="pb-fact-label">Break Duration</div>
                    <strong>{peptide.quickFacts?.breakDuration || peptide.breakBeforeContinuing || "Pending"}</strong>
                  </div>
                  <div className="pb-fact-row">
                    <div className="pb-fact-label">Administration</div>
                    <strong>{peptide.quickFacts?.administration || peptide.administration || "Pending"}</strong>
                  </div>
                  <div className="pb-fact-row">
                    <div className="pb-fact-label">FDA Status</div>
                    <strong>{peptide.quickFacts?.fdaStatus || peptide.fdaStatus || "Pending"}</strong>
                  </div>
                </div>
              </div>

              <div className="pb-panel">
                <div className="pb-eyebrow">Premium workflows</div>
                <h3 className="pb-card-title">Unlock saved protocols and advanced tracking.</h3>
                <p className="pb-body">
                  Future paid tools can layer in saved inventory, injection logs, advanced protocol tracking, and deeper research collections without changing this database experience.
                </p>
                <Link href="/dashboard" className="pb-button-secondary">Open account tools</Link>
              </div>

              <LiveResearchFeed peptideName={peptide.pubmedQuery || peptide.name} compact />
            </aside>
          </div>
        </div>
      ) : null}
    </article>
  );
}
