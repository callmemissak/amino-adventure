import { notFound } from "next/navigation";
import PeptaBaseHome from "@/components/peptabase/PeptaBaseHome";
import StructuredData from "@/components/seo/StructuredData";
import { loadPeptides, loadPeptideBySlug, buildHomeViewModel } from "@/lib/peptide-server";
import { buildPeptideMetadata, breadcrumbStructuredData, peptideStructuredData } from "@/lib/seo";

export async function generateStaticParams() {
  const peptides = await loadPeptides();
  return peptides.map((entry: { slug: string }) => ({ slug: entry.slug }));
}

async function getSlug(params: any) {
  const resolved = await params;
  return resolved?.slug ?? "";
}

export async function generateMetadata({ params }: any) {
  const slug = await getSlug(params);
  const peptide = await loadPeptideBySlug(slug);

  if (!peptide) {
    return { title: "Peptide Not Found | PeptaBase" };
  }

  return buildPeptideMetadata(peptide);
}

export default async function PeptideSlugPage({ params }: any) {
  const slug = await getSlug(params);
  const peptides = await loadPeptides();
  const peptide = peptides.find((entry: { slug: string }) => entry.slug === slug);

  if (!peptide) {
    notFound();
  }

  const viewModel = buildHomeViewModel(peptides);

  return (
    <>
      <StructuredData
        data={[
          breadcrumbStructuredData([
            { name: "PeptaBase", path: "/" },
            { name: peptide.name, path: `/peptides/${peptide.slug}` }
          ]),
          peptideStructuredData(peptide)
        ]}
      />
      <PeptaBaseHome peptides={peptides} initialSlug={slug} {...viewModel} />
    </>
  );
}
