import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import PeptideDetail from "./PeptideDetail";

export async function generateStaticParams() {
  const peptides = await prisma.peptide.findMany({
    select: { slug: true },
  });
  return peptides.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const peptide = await prisma.peptide.findUnique({ where: { slug } });
  if (!peptide) return { title: "Peptide Not Found" };

  return {
    title: `${peptide.name} — Peptide Atlas`,
    description: `Research data for ${peptide.name}: ${peptide.mechanism_of_action.slice(0, 150)}...`,
  };
}

export default async function PeptidePage({ params }) {
  const { slug } = params;

  const peptide = await prisma.peptide.findUnique({ where: { slug } });
  if (!peptide) notFound();

  const parsed = {
    ...peptide,
    aliases: JSON.parse(peptide.aliases || "[]"),
    research_applications: JSON.parse(peptide.research_applications || "[]"),
    pubmed_links: JSON.parse(peptide.pubmed_links || "[]"),
    createdAt: peptide.createdAt.toISOString(),
    updatedAt: peptide.updatedAt.toISOString(),
  };

  return <PeptideDetail peptide={parsed} />;
}
