import prisma from "@/lib/db";
import PeptaBaseHome from "@/components/peptabase/PeptaBaseHome";
import { mergePeptideData } from "@/lib/peptabase-data";

async function loadPeptides() {
  try {
    const peptides = await prisma.peptide.findMany({
      orderBy: { name: "asc" }
    });
    return mergePeptideData(peptides);
  } catch {
    return mergePeptideData([]);
  }
}

export default async function Page() {
  const peptides = await loadPeptides();
  return <PeptaBaseHome peptides={peptides} />;
}
