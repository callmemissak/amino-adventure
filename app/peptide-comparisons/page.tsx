import Link from "next/link";
import UtilityPage from "@/components/peptabase/UtilityPage";
import { buildPageMetadata } from "@/lib/seo";
import { comparisonPageDefinitions } from "@/lib/comparison-pages";

export const metadata = buildPageMetadata({
  title: "Peptide Comparisons | PeptaBase",
  description:
    "Compare commonly researched peptides side by side with structured comparison pages for mechanism, dose patterns, development stage, and research context.",
  path: "/peptide-comparisons"
});

export default async function PeptideComparisonsPage() {
  const comparisons = comparisonPageDefinitions.map((definition) => ({
    slug: definition.slug,
    title: definition.title,
    description: definition.overview,
    href: `/compare/${definition.slug}`
  }));

  return (
    <UtilityPage
      eyebrow="Comparisons"
      title="High-intent peptide comparison pages"
      description="Comparison pages strengthen internal linking, support search intent like peptide A vs peptide B, and give users clearer next steps into the database and calculators."
      links={[
        { href: "/", label: "Back to database" },
        { href: "/peptide-stacks", label: "Peptide stacks" },
        { href: "/research-glossary", label: "Research glossary" }
      ]}
    >
      <div className="pb-card-grid">
        {comparisons.map((comparison) => (
          <div key={comparison.slug} className="pb-card">
            <h2 className="pb-card-title">{comparison.title}</h2>
            <p className="pb-body">{comparison.description}</p>
            <Link href={comparison.href} className="pb-button-secondary">Open comparison</Link>
          </div>
        ))}
      </div>
    </UtilityPage>
  );
}
