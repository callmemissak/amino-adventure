import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import PeptideDetailView from "@/components/peptabase/PeptideDetailView";
import { findPeptideBySlug, mergePeptideData } from "@/lib/peptabase-data";

async function loadRecords() {
  try {
    return await prisma.peptide.findMany({
      orderBy: { name: "asc" }
    });
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const records = await loadRecords();
  return mergePeptideData(records).map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }) {
  const records = await loadRecords();
  const peptide = findPeptideBySlug(records, params.slug);

  if (!peptide) {
    return { title: "Peptide Not Found | PeptaBase" };
  }

  return {
    title: `${peptide.name} | PeptaBase`,
    description: peptide.overview
  };
}

export default async function PeptidePage({ params }) {
  const records = await loadRecords();
  const peptide = findPeptideBySlug(records, params.slug);

  if (!peptide) {
    notFound();
  }

  return <PeptideDetailView peptide={peptide} />;
}
