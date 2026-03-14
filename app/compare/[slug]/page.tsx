import Link from "next/link";
import { notFound } from "next/navigation";
import UtilityPage from "@/components/peptabase/UtilityPage";
import StructuredData from "@/components/seo/StructuredData";
import { getComparisonPageDefinition, comparisonPageDefinitions } from "@/lib/comparison-pages";
import { loadPeptides } from "@/lib/peptide-server";
import { breadcrumbStructuredData, buildPageMetadata } from "@/lib/seo";

function buildStudyLinks(left: any, right: any) {
  const combined = [...(left.references || []), ...(right.references || [])]
    .filter((reference) => reference?.url)
    .filter((reference, index, list) => list.findIndex((item) => item.url === reference.url) === index);

  const pubmedFirst = combined
    .sort((a, b) => Number(Boolean(b.pmid)) - Number(Boolean(a.pmid)));

  return pubmedFirst.slice(0, 6);
}

export async function generateStaticParams() {
  return comparisonPageDefinitions.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const definition = getComparisonPageDefinition(params.slug);

  if (!definition) {
    return { title: "Comparison Not Found | PeptaBase" };
  }

  return buildPageMetadata({
    title: `${definition.title} | Compare Peptides | PeptaBase`,
    description: definition.overview,
    path: `/compare/${definition.slug}`
  });
}

export default async function ComparePage({ params }: { params: { slug: string } }) {
  const definition = getComparisonPageDefinition(params.slug);

  if (!definition) {
    notFound();
  }

  const peptides = await loadPeptides();
  const left = peptides.find((entry) => entry.slug === definition.leftSlug);
  const right = peptides.find((entry) => entry.slug === definition.rightSlug);

  if (!left || !right) {
    notFound();
  }

  const studies = buildStudyLinks(left, right);

  const rows = [
    ["Category", left.category, right.category],
    ["Mechanism Summary", left.mechanismSummary || left.mechanismOfAction, right.mechanismSummary || right.mechanismOfAction],
    ["Primary Receptor", left.primaryReceptor || "Pending", right.primaryReceptor || "Pending"],
    ["Biological Pathway", left.biologicalPathway || "Pending", right.biologicalPathway || "Pending"],
    ["Dose Range", left.doseRange || "Pending", right.doseRange || "Pending"],
    ["Half-life", left.halfLife || "Pending", right.halfLife || "Pending"],
    ["Evidence Level", left.evidenceLevel || "Pending", right.evidenceLevel || "Pending"],
    ["Development Stage", left.developmentStage || "Pending", right.developmentStage || "Pending"],
    ["FDA Status", left.fdaStatus || "Pending", right.fdaStatus || "Pending"]
  ];

  return (
    <>
      <StructuredData
        data={breadcrumbStructuredData([
          { name: "PeptaBase", path: "/" },
          { name: "Compare", path: "/peptide-comparisons" },
          { name: definition.title, path: `/compare/${definition.slug}` }
        ])}
      />
      <UtilityPage
        eyebrow="Structured Comparison"
        title={definition.title}
        description={definition.overview}
        links={[
          { href: `/peptides/${left.slug}`, label: left.name },
          { href: `/peptides/${right.slug}`, label: right.name },
          { href: "/peptide-comparisons", label: "All comparisons" },
          { href: "/calculator", label: "Calculator hub" }
        ]}
      >
        <div className="pb-card-grid">
          {definition.sections.map((section) => (
            <section key={section.heading} className="pb-card">
              <h2 className="pb-card-title">{section.heading}</h2>
              <p className="pb-body">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="pb-panel">
          <div className="pb-section-head">
            <div>
              <h2 className="pb-card-title">Structured Comparison Table</h2>
              <p className="pb-section-copy">This table is meant for fast scanning after the narrative sections above explain the practical differences.</p>
            </div>
          </div>
          <div className="pb-side-by-side-list">
            <div className="pb-side-by-side-row">
              <div className="pb-fact-label">Field</div>
              <strong>{left.name}</strong>
              <strong>{right.name}</strong>
            </div>
            {rows.map(([label, leftValue, rightValue]) => (
              <div key={label as string} className="pb-side-by-side-row">
                <div className="pb-fact-label">{label}</div>
                <div>{leftValue || "Pending"}</div>
                <div>{rightValue || "Pending"}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-card-grid">
          <div className="pb-card">
            <h2 className="pb-card-title">Open the Full Peptide Entries</h2>
            <p className="pb-body">Each peptide entry includes the full accordion research record, including mechanism, evidence, safety notes, editorial review, and live PubMed studies.</p>
            <div className="pb-inline-actions">
              <Link href={`/peptides/${left.slug}`} className="pb-button-secondary">Open {left.name}</Link>
              <Link href={`/peptides/${right.slug}`} className="pb-button-secondary">Open {right.name}</Link>
            </div>
          </div>

          <div className="pb-card">
            <h2 className="pb-card-title">Relevant Study Links</h2>
            <div className="pb-reference-list">
              {studies.length > 0 ? studies.map((reference, index) => (
                <a
                  key={`${definition.slug}-study-${index}`}
                  href={reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pb-reference-item"
                >
                  <strong>{reference.title || reference.url}</strong>
                  <div className="pb-subtle">
                    {reference.pmid ? `PMID ${reference.pmid}` : "Source link"}
                    {reference.journal ? ` | ${reference.journal}` : ""}
                    {reference.year ? ` | ${reference.year}` : ""}
                  </div>
                </a>
              )) : <div className="pb-empty">No curated study links are available yet for this comparison.</div>}
            </div>
          </div>
        </div>
      </UtilityPage>
    </>
  );
}
