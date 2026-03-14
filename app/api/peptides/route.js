import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { mergePeptideData } from "@/lib/peptabase-data";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search")?.toLowerCase() || "";

  let records = [];
  try {
    records = await prisma.peptide.findMany({
      orderBy: { name: "asc" }
    });
  } catch {
    records = [];
  }

  const peptides = mergePeptideData(records).filter((entry) => {
    const matchCategory = !category || category === "All" || entry.category === category;
    const matchSearch = !search || entry.keywords.some((keyword) => String(keyword).toLowerCase().includes(search));
    return matchCategory && matchSearch;
  });

  return NextResponse.json(peptides);
}
