import Link from "next/link";
import { notFound } from "next/navigation";
import UtilityPage from "@/components/peptabase/UtilityPage";
import StructuredData from "@/components/seo/StructuredData";
import { getCategoryPage, getPeptidesForCategoryPage, categoryPageDefinitions } from "@/lib/category-pages";
import { getComparisonIndex, loadPeptides } from "@/lib/peptide-server";
import { breadcrumbStructuredData, buildPageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return categoryPageDefinitions.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = getCategoryPage(params.slug);

  if (!category) {
    return { title: "Category Not Found | PeptaBase" };
  }

  return buildPageMetadata({
    title: `${category.title} | Peptide Category | PeptaBase`,
    description: category.overview,
    path: `/categories/${category.slug}`
  });
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategoryPage(params.slug);

  if (!category) {
    notFound();
  }

  const peptides = await loadPeptides();
  const categoryPeptides = getPeptidesForCategoryPage(peptides, params.slug);
  const comparisons = getComparisonIndex(peptides).filter(
    (entry) =>
      categoryPeptides.some((peptide) => peptide.slug === entry.left.slug) ||
      categoryPeptides.some((peptide) => peptide.slug === entry.right.slug)
  );

  return (
    <>
      <StructuredData
        data={breadcrumbStructuredData([
          { name: "PeptaBase", path: "/" },
          { name: "Categories", path: "/" },
          { name: category.title, path: `/categories/${category.slug}` }
        ])}
      />
      <UtilityPage
        eyebrow="Category Research"
        title={category.title}
        description={category.overview}
        links={[
          { href: "/", label: "Back to database" },
          { href: "/peptide-comparisons", label: "Peptide comparisons" },
          { href: "/research-glossary", label: "Research glossary" }
        ]}
      >
        <div className="pb-card-grid">
          {categoryPeptides.map((peptide) => (
            <article key={peptide.slug} className="pb-card">
              <div className="pb-inline-link-list">
                <span className="pb-chip">{peptide.category}</span>
                {peptide.evidenceLevel ? <span className="pb-pill">{peptide.evidenceLevel}</span> : null}
              </div>
              <h2 className="pb-card-title">{peptide.name}</h2>
              <p className="pb-body">{peptide.overview || peptide.mechanismSummary || peptide.mechanismOfAction}</p>
              <div className="pb-link-list">
                <div className="pb-fact-row">
                  <div className="pb-fact-label">Mechanism</div>
                  <strong>{peptide.mechanismSummary || peptide.mechanismOfAction || "Pending"}</strong>
                </div>
                <div className="pb-fact-row">
                  <div className="pb-fact-label">Typical Dose</div>
                  <strong>{peptide.doseRange || "Pending"}</strong>
                </div>
                <div className="pb-fact-row">
                  <div className="pb-fact-label">Evidence</div>
                  <strong>{peptide.evidenceLevel || "Pending"}</strong>
                </div>
              </div>
              <div className="pb-inline-actions">
                <Link href={`/peptides/${peptide.slug}`} className="pb-button-secondary">Open peptide entry</Link>
                <Link href="/" className="pb-button-secondary">Search full database</Link>
              </div>
            </article>
          ))}
        </div>

        <div className="pb-card-grid">
          <div className="pb-card">
            <h2 className="pb-card-title">Related Research Links</h2>
            <div className="pb-inline-link-list">
              {category.relatedResearchLinks.map((link) => (
                <Link key={link.href} href={link.href} className="pb-inline-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="pb-card">
            <h2 className="pb-card-title">Relevant Comparison Pages</h2>
            <div className="pb-inline-link-list">
              {comparisons.length > 0 ? comparisons.slice(0, 4).map((comparison) => (
                <Link key={comparison.href} href={comparison.href} className="pb-inline-link">
                  {comparison.title}
                </Link>
              )) : (
                <span className="pb-body">Comparison routes for this category are still being expanded.</span>
              )}
            </div>
          </div>
        </div>
      </UtilityPage>
    </>
  );
}
