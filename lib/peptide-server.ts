import { cache } from "react";
import prisma from "@/lib/db";
import {
  compareSuggestions,
  mergePeptideData,
  peptideStacks
} from "@/lib/peptabase-data";

function safeText(value: unknown) {
  return typeof value === "string" ? value : "";
}

export const loadPeptides = cache(async () => {
  try {
    const peptides = await prisma.peptide.findMany({
      orderBy: { name: "asc" }
    });
    return mergePeptideData(peptides);
  } catch {
    return mergePeptideData([]);
  }
});

export const loadPeptideBySlug = cache(async (slug: string) => {
  const peptides = await loadPeptides();
  return peptides.find((entry) => entry.slug === slug) ?? null;
});

export function buildComparisonSlug(leftSlug: string, rightSlug: string) {
  return `${leftSlug}-vs-${rightSlug}`;
}

export function getComparisonIndex(peptides: any[]) {
  return compareSuggestions
    .map(([leftSlug, rightSlug]) => {
      const left = peptides.find((entry) => entry.slug === leftSlug);
      const right = peptides.find((entry) => entry.slug === rightSlug);

      if (!left || !right) {
        return null;
      }

      return {
        slug: buildComparisonSlug(left.slug, right.slug),
        left,
        right,
        title: `${left.name} vs ${right.name}`,
        description: `Compare ${left.name} and ${right.name} across mechanism, dosing patterns, research focus, and current development context.`,
        href: `/peptide-comparisons/${buildComparisonSlug(left.slug, right.slug)}`
      };
    })
    .filter(Boolean);
}

export function findComparisonBySlug(peptides: any[], slug: string) {
  return getComparisonIndex(peptides).find((entry) => entry.slug === slug) ?? null;
}

export function findRelatedPeptides(peptides: any[], peptide: any, limit = 3) {
  return peptides
    .filter((entry) => entry.slug !== peptide.slug)
    .map((entry) => {
      let score = 0;

      if (entry.category === peptide.category) {
        score += 4;
      }

      if ((entry.kind || "") === (peptide.kind || "")) {
        score += 1;
      }

      const sharedKeywords = (entry.keywords || []).filter((keyword: string) =>
        (peptide.keywords || []).includes(keyword)
      );
      score += sharedKeywords.length;

      if (
        safeText(entry.mechanismOfAction).toLowerCase().includes(safeText(peptide.name).toLowerCase()) ||
        safeText(peptide.mechanismOfAction).toLowerCase().includes(safeText(entry.name).toLowerCase())
      ) {
        score += 1;
      }

      return { entry, score };
    })
    .sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name))
    .slice(0, limit)
    .map((item) => item.entry);
}

export function findStacksForPeptide(peptide: any) {
  const name = safeText(peptide.name).toLowerCase();
  return peptideStacks.filter((stack) =>
    stack.peptides.some((stackPeptide) => safeText(stackPeptide).toLowerCase() === name)
  );
}

export function getEvidenceLevel(peptide: any) {
  if (safeText(peptide.evidenceLevel)) {
    return peptide.evidenceLevel;
  }

  const referenceCount = peptide.references?.length ?? 0;

  if (referenceCount >= 3) {
    return "Moderate";
  }

  if (referenceCount >= 1) {
    return "Early";
  }

  return "Limited";
}

export function getLastReviewedDate(peptide: any) {
  if (safeText(peptide.reviewDate)) {
    const parsedReviewDate = Date.parse(peptide.reviewDate);

    if (!Number.isNaN(parsedReviewDate)) {
      return new Date(parsedReviewDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }

    return peptide.reviewDate;
  }

  const label = safeText(peptide.updatedLabel);
  const parsed = Date.parse(label);

  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  return "Mar 14, 2026";
}

export function getPrimaryCitation(peptide: any) {
  return peptide.references?.[0] ?? null;
}

export function buildHomeViewModel(peptides: any[]) {
  return {
    comparisonIndex: getComparisonIndex(peptides),
    stackIndex: peptideStacks,
    evidenceBySlug: Object.fromEntries(peptides.map((peptide) => [peptide.slug, getEvidenceLevel(peptide)])),
    reviewedBySlug: Object.fromEntries(peptides.map((peptide) => [peptide.slug, getLastReviewedDate(peptide)])),
    relatedBySlug: Object.fromEntries(peptides.map((peptide) => [peptide.slug, findRelatedPeptides(peptides, peptide)]))
  };
}
