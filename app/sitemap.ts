import type { MetadataRoute } from "next";
import { getComparisonIndex, loadPeptides } from "@/lib/peptide-server";
import { absoluteUrl } from "@/lib/site-config";
import { categoryPageDefinitions } from "@/lib/category-pages";
import { comparisonPageDefinitions } from "@/lib/comparison-pages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const createEntry = (
    url: string,
    priority: number
  ): MetadataRoute.Sitemap[number] => ({
    url,
    changeFrequency: "weekly",
    priority
  });

  const peptides = await loadPeptides();
  const comparisons = getComparisonIndex(peptides);
  const staticRoutes = [
    "/",
    "/calculator",
    "/reconstitution-calculator",
    "/glp-1-dose-calculator",
    "/saved-peptides",
    ...categoryPageDefinitions.map((entry) => `/categories/${entry.slug}`),
    ...comparisonPageDefinitions.map((entry) => `/compare/${entry.slug}`),
    "/peptide-comparisons",
    "/peptide-stacks",
    "/research-glossary",
    "/dashboard",
    "/favorite-researchers"
  ];

  return [
    ...staticRoutes.map((path) => createEntry(absoluteUrl(path), path === "/" ? 1 : 0.7)),
    ...peptides.map((peptide: { slug: string }) => createEntry(absoluteUrl(`/peptides/${peptide.slug}`), 0.8)),
    ...comparisons.map((comparison) => createEntry(absoluteUrl(comparison.href), 0.72))
  ];
}
