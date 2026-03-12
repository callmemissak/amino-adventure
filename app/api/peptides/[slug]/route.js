import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request, { params }) {
  const { slug } = params;

  const peptide = await prisma.peptide.findUnique({
    where: { slug },
  });

  if (!peptide) {
    return NextResponse.json({ error: "Peptide not found" }, { status: 404 });
  }

  const parsed = {
    ...peptide,
    aliases: JSON.parse(peptide.aliases || "[]"),
    research_applications: JSON.parse(peptide.research_applications || "[]"),
    pubmed_links: JSON.parse(peptide.pubmed_links || "[]"),
  };

  return NextResponse.json(parsed);
}
