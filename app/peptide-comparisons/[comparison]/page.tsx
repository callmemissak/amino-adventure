import Link from "next/link";
import { notFound } from "next/navigation";
import UtilityPage from "@/components/peptabase/UtilityPage";
import StructuredData from "@/components/seo/StructuredData";
import { findComparisonBySlug, getComparisonIndex, loadPeptides } from "@/lib/peptide-server";
import { breadcrumbStructuredData, buildPageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const peptides = await loadPeptides();
  return getComparisonIndex(peptides).map((entry: { slug: string }) => ({ comparison: entry.slug }));
}

export async function generateMetadata({ params }: { params: { comparison: string } }) {
  const peptides = await loadPeptides();
  const comparison = findComparisonBySlug(peptides, params.comparison);

  if (!comparison) {
    return { title: "Comparison Not Found | PeptaBase" };
  }

  return buildPageMetadata({
    title: `${comparison.title} | Peptide Comparison | PeptaBase`,
    description: comparison.description,
    path: comparison.href
  });
}

export default async function ComparisonDetailPage({ params }: { params: { comparison: string } }) {
  const peptides = await loadPeptides();
  const comparison = findComparisonBySlug(peptides, params.comparison);

  if (!comparison) {
    notFound();
  }

  const { left, right } = comparison;

  return (
    <>
      <StructuredData
        data={breadcrumbStructuredData([
          { name: "PeptaBase", path: "/" },
          { name: "Peptide Comparisons", path: "/peptide-comparisons" },
          { name: comparison.title, path: comparison.href }
        ])}
      />
      <UtilityPage
        eyebrow="Comparison Detail"
        title={comparison.title}
        description={comparison.description}
        links={[
          { href: `/peptides/${left.slug}`, label: left.name },
          { href: `/peptides/${right.slug}`, label: right.name },
          { href: "/peptide-comparisons", label: "All comparisons" }
        ]}
      >
        <div className="pb-side-by-side-list">
          {[
            ["Category", left.category, right.category],
            ["Mechanism", left.mechanismOfAction, right.mechanismOfAction],
            ["Dose range", left.doseRange, right.doseRange],
            ["Half-life", left.halfLife, right.halfLife],
            ["FDA status", left.fdaStatus, right.fdaStatus],
            ["Development stage", left.developmentStage, right.developmentStage]
          ].map(([label, leftValue, rightValue]) => (
            <div key={label as string} className="pb-side-by-side-row">
              <div className="pb-fact-label">{label}</div>
              <div>{leftValue || "Pending"}</div>
              <div>{rightValue || "Pending"}</div>
            </div>
          ))}
        </div>
        <div className="pb-inline-actions">
          <Link href={`/peptides/${left.slug}`} className="pb-button-secondary">Open {left.name}</Link>
          <Link href={`/peptides/${right.slug}`} className="pb-button-secondary">Open {right.name}</Link>
          <Link href="/calculator" className="pb-button-secondary">Open calculators</Link>
        </div>
      </UtilityPage>
    </>
  );
}
