import { getComparisonIndex, loadPeptides } from "@/lib/peptide-server";
import { absoluteUrl } from "@/lib/site-config";

export default async function sitemap() {
  const peptides = await loadPeptides();
  const comparisons = getComparisonIndex(peptides);
  const staticRoutes = [
    "/",
    "/calculator",
    "/reconstitution-calculator",
    "/glp-1-dose-calculator",
    "/peptide-comparisons",
    "/peptide-stacks",
    "/research-glossary",
    "/dashboard",
    "/favorite-researchers"
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "weekly",
      priority: path === "/" ? 1 : 0.7
    })),
    ...peptides.map((peptide: { slug: string }) => ({
      url: absoluteUrl(`/peptides/${peptide.slug}`),
      changeFrequency: "weekly",
      priority: 0.8
    })),
    ...comparisons.map((comparison) => ({
      url: absoluteUrl(comparison.href),
      changeFrequency: "weekly",
      priority: 0.72
    }))
  ];
}
