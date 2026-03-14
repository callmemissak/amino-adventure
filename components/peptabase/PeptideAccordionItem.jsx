"use client";

import LiveResearchFeed from "@/components/peptabase/LiveResearchFeed";

function renderList(items) {
  if (!items || items.length === 0) {
    return "Not yet added";
  }

  return items.join(", ");
}

function DetailBlock({ label, value, children }) {
  const content = children ?? value ?? "Not yet added";

  return (
    <div className="pb-detail-block">
      <div className="pb-fact-label">{label}</div>
      <div className="pb-body">{content}</div>
    </div>
  );
}

export default function PeptideAccordionItem({ peptide, open, onToggle }) {
  const aliases = peptide.aliases?.length ? peptide.aliases.join(" | ") : "Not yet added";
  const keywordList = peptide.keywords?.length ? peptide.keywords : [];
  const referenceLinks = peptide.references?.filter((reference) => reference.url) ?? [];

  return (
    <article className={`pb-accordion-item ${open ? "is-open" : ""}`}>
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
              <span className="pb-fact-label">Admin</span>
              <strong>{peptide.administration || "Pending"}</strong>
            </span>
          </div>
          <span className="pb-accordion-toggle">{open ? "Collapse" : "Expand"}</span>
        </div>
      </button>

      <div id={`peptide-panel-${peptide.slug}`} className="pb-accordion-panel" hidden={!open}>
        <div className="pb-accordion-grid">
          <div className="pb-accordion-content">
            <div className="pb-detail-grid pb-detail-grid-compact">
              <DetailBlock label="Overview" value={peptide.overview} />
              <DetailBlock label="Aliases" value={aliases} />
              <DetailBlock label="Mechanism of Action" value={peptide.mechanismOfAction} />
              <DetailBlock label="Research Applications" value={renderList(peptide.researchApplications)} />
              <DetailBlock label="Dose Range" value={peptide.doseRange} />
              <DetailBlock label="Common Cycle Length" value={peptide.commonCycleLength} />
              <DetailBlock label="Half-life" value={peptide.halfLife} />
              <DetailBlock label="Administration" value={peptide.administration} />
              <DetailBlock label="FDA Status" value={peptide.fdaStatus} />
              <DetailBlock label="Development Stage" value={peptide.developmentStage} />
            </div>

            <DetailBlock label="Keywords / Tags">
              <div className="pb-tag-row">
                {keywordList.length > 0 ? keywordList.map((keyword) => <span key={keyword} className="pb-pill">{keyword}</span>) : "Not yet added"}
              </div>
            </DetailBlock>

            {referenceLinks.length > 0 ? (
              <div className="pb-detail-block">
                <div className="pb-fact-label">Saved Research References</div>
                <div className="pb-reference-list">
                  {referenceLinks.map((reference, index) => (
                    <a
                      key={`${peptide.slug}-reference-${index}`}
                      href={reference.url}
                      target="_blank"
                      rel="noreferrer"
                      className="pb-reference-item"
                    >
                      <strong>{reference.title || reference.url}</strong>
                      <div className="pb-subtle">
                        {[reference.journal, reference.year].filter(Boolean).join(" | ") || "Open source"}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

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
            <LiveResearchFeed peptideName={peptide.pubmedQuery || peptide.name} compact />
          </aside>
        </div>
      </div>
    </article>
  );
}
