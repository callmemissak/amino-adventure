import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const where = {};

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { aliases: { contains: search } },
      { category: { contains: search } },
      { mechanism_of_action: { contains: search } },
      { research_applications: { contains: search } },
    ];
  }

  const peptides = await prisma.peptide.findMany({
    where,
    orderBy: { name: "asc" },
  });

  // Parse JSON string fields for the response
  const parsed = peptides.map((p) => ({
    ...p,
    aliases: JSON.parse(p.aliases || "[]"),
    research_applications: JSON.parse(p.research_applications || "[]"),
    pubmed_links: JSON.parse(p.pubmed_links || "[]"),
  }));

  return NextResponse.json(parsed);
}
