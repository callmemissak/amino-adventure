import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { findPeptideBySlug } from "@/lib/peptabase-data";

export async function GET(_request, { params }) {
  const { slug } = params;

  let records = [];
  try {
    records = await prisma.peptide.findMany();
  } catch {
    records = [];
  }

  const peptide = findPeptideBySlug(records, slug);

  if (!peptide) {
    return NextResponse.json({ error: "Peptide not found" }, { status: 404 });
  }

  return NextResponse.json(peptide);
}
