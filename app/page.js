import PeptaBaseHome from "@/components/peptabase/PeptaBaseHome";
import { buildPageMetadata } from "@/lib/seo";
import { buildHomeViewModel, loadPeptides } from "@/lib/peptide-server";

export const metadata = buildPageMetadata({
  title: "PeptaBase | Peptide and Bioregulator Research Database",
  description:
    "Search peptides, review PubMed-linked research, compare compounds, and use peptide calculators in one scientific accordion database.",
  path: "/"
});

export default async function Page() {
  const peptides = await loadPeptides();
  const viewModel = buildHomeViewModel(peptides);

  return <PeptaBaseHome peptides={peptides} {...viewModel} />;
}
