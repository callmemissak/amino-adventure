import Link from "next/link";

export default function PeptideCard({ peptide }) {
  return (
    <Link href={`/peptides/${peptide.slug}`} className="pb-card">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
        <span className="pb-chip">{peptide.category}</span>
        <span className="pb-tag">{peptide.kind === "bioregulator" ? "Bioregulator" : "Peptide"}</span>
      </div>
      <div>
        <h3 className="pb-card-title">{peptide.name}</h3>
        {peptide.aliases?.length ? <p className="pb-subtle">{peptide.aliases.join(", ")}</p> : null}
      </div>
      <p className="pb-body">{peptide.overview}</p>
      <div className="pb-link-list">
        <div className="pb-fact-row"><strong>Typical dose:</strong> {peptide.quickFacts.typicalDose}</div>
        <div className="pb-fact-row"><strong>Administration:</strong> {peptide.quickFacts.administration}</div>
        <div className="pb-fact-row"><strong>FDA status:</strong> {peptide.quickFacts.fdaStatus}</div>
      </div>
    </Link>
  );
}
