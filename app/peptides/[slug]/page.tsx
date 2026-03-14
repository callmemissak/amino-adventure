import { notFound } from "next/navigation";
import PeptaBaseHome from "@/components/peptabase/PeptaBaseHome";
import StructuredData from "@/components/seo/StructuredData";
import { loadPeptides, loadPeptideBySlug, buildHomeViewModel } from "@/lib/peptide-server";
import { buildPeptideMetadata, breadcrumbStructuredData, peptideStructuredData } from "@/lib/seo";

export async function generateStaticParams() {
  const peptides = await loadPeptides();
  return peptides.map((entry: { slug: string }) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const peptide = await loadPeptideBySlug(params.slug);

  if (!peptide) {
    return { title: "Peptide Not Found | PeptaBase" };
  }

  return buildPeptideMetadata(peptide);
}

export default async function PeptideSlugPage({ params }: { params: { slug: string } }) {
  const peptides = await loadPeptides();
  const peptide = peptides.find((entry: { slug: string }) => entry.slug === params.slug);

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
      <PeptaBaseHome peptides={peptides} initialSlug={params.slug} {...viewModel} />
    </>
  );
}
