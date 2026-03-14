import workbookRows from "@/data/peptide-content.json";

export const RESEARCH_WARNING = `Educational & Research Use Only.
This website provides educational information regarding peptides and bioregulators for research purposes only.
It does not constitute medical advice.
Always consult a licensed physician for medical guidance.
Personal use of research compounds outside supervised research carries unknown risks and benefits and is not advised.`;

const PLACEHOLDER_FDA = "Research only / status to be verified";
const PLACEHOLDER_STAGE = "Content pending researcher verification";
const PLACEHOLDER_CYCLE = "Varies by research protocol";
const PLACEHOLDER_BREAK = "Protocol-dependent";

const requestedEntries = [
  ["5 Amino 1 MQ", "Metabolic", "peptide"],
  ["ACTH", "Nootropic & Neuropeptide", "peptide"],
  ["Adamax", "Nootropic & Neuropeptide", "peptide"],
  ["AOD 9604", "Metabolic", "peptide"],
  ["BPC 157", "Healing & Recovery", "peptide"],
  ["PT-141 Bremelanotide", "Melanocortin", "peptide"],
  ["Cagrilintide", "Metabolic", "peptide"],
  ["CJC with DAC", "Growth Hormone Secretagogue", "peptide"],
  ["CJC without DAC", "Growth Hormone Secretagogue", "peptide"],
  ["Calcitonin", "Metabolic", "peptide"],
  ["DSIP", "Nootropic & Neuropeptide", "peptide"],
  ["Epitalon", "Longevity & Mitochondrial", "peptide"],
  ["FOXO4-DRI", "Longevity & Mitochondrial", "peptide"],
  ["GHK-CU", "Cosmetic & Dermal", "peptide"],
  ["GHK Base", "Cosmetic & Dermal", "peptide"],
  ["GHRP-2", "Growth Hormone Secretagogue", "peptide"],
  ["GHRP-6", "Growth Hormone Secretagogue", "peptide"],
  ["Glutathione", "Immune Modulation", "peptide"],
  ["Hexarelin", "Growth Hormone Secretagogue", "peptide"],
  ["Humanin", "Longevity & Mitochondrial", "peptide"],
  ["IGF-1", "Growth Factor", "peptide"],
  ["IGF-1 LR3", "Growth Factor", "peptide"],
  ["Ipamorelin", "Growth Hormone Secretagogue", "peptide"],
  ["Kisspeptin", "Reproductive", "peptide"],
  ["L-Carnitine", "Metabolic", "peptide"],
  ["Lipo B", "Metabolic", "peptide"],
  ["Lipo C", "Metabolic", "peptide"],
  ["Liraglutide", "Metabolic", "peptide"],
  ["LL-37", "Immune Modulation", "peptide"],
  ["Mazdutide", "Metabolic", "peptide"],
  ["Melanotan 1", "Melanocortin", "peptide"],
  ["Melanotan 2", "Melanocortin", "peptide"],
  ["MK-677", "Growth Hormone Secretagogue", "peptide"],
  ["Mod-GRF", "Growth Hormone Secretagogue", "peptide"],
  ["MOTS-C", "Longevity & Mitochondrial", "peptide"],
  ["NAD+", "Longevity & Mitochondrial", "peptide"],
  ["Oxytocin", "Nootropic & Neuropeptide", "peptide"],
  ["P-21", "Nootropic & Neuropeptide", "peptide"],
  ["PE-22-28", "Nootropic & Neuropeptide", "peptide"],
  ["Retatrutide", "Metabolic", "peptide"],
  ["Selank", "Nootropic & Neuropeptide", "peptide"],
  ["Semaglutide", "Metabolic", "peptide"],
  ["Sermorelin", "Growth Hormone Secretagogue", "peptide"],
  ["Semax", "Nootropic & Neuropeptide", "peptide"],
  ["SS-31", "Longevity & Mitochondrial", "peptide"],
  ["Servodutide", "Metabolic", "peptide"],
  ["TB-500", "Healing & Recovery", "peptide"],
  ["Tesamorelin", "Growth Hormone Secretagogue", "peptide"],
  ["Tesofensine", "Metabolic", "peptide"],
  ["Thymosin Alpha-1", "Immune Modulation", "peptide"],
  ["Tirzepatide", "Metabolic", "peptide"],
  ["Triptorelin", "Reproductive", "peptide"],
  ["VIP", "Immune Modulation", "peptide"],
  ["Bonomarlot", "Bioregulator Peptide", "bioregulator"],
  ["Bonothyrk", "Bioregulator Peptide", "bioregulator"],
  ["Bronchogen", "Bioregulator Peptide", "bioregulator"],
  ["Cardigen", "Bioregulator Peptide", "bioregulator"],
  ["Cartalax", "Bioregulator Peptide", "bioregulator"],
  ["Cerebrolysin", "Bioregulator Peptide", "bioregulator"],
  ["Cerluten", "Bioregulator Peptide", "bioregulator"],
  ["Chonluten", "Bioregulator Peptide", "bioregulator"],
  ["Crystagen", "Bioregulator Peptide", "bioregulator"],
  ["Endoluten", "Bioregulator Peptide", "bioregulator"],
  ["Glandokort", "Bioregulator Peptide", "bioregulator"],
  ["Gotratix", "Bioregulator Peptide", "bioregulator"],
  ["KPV", "Immune Modulation", "bioregulator"],
  ["Libidon", "Bioregulator Peptide", "bioregulator"],
  ["Livagen", "Bioregulator Peptide", "bioregulator"],
  ["Normoftal", "Bioregulator Peptide", "bioregulator"],
  ["Ovagen", "Bioregulator Peptide", "bioregulator"],
  ["Pancragen", "Bioregulator Peptide", "bioregulator"],
  ["Pielotax", "Bioregulator Peptide", "bioregulator"],
  ["Pinealon", "Bioregulator Peptide", "bioregulator"],
  ["Retinalamin", "Bioregulator Peptide", "bioregulator"],
  ["Sigumir", "Bioregulator Peptide", "bioregulator"],
  ["Svetinorm", "Bioregulator Peptide", "bioregulator"],
  ["Testagen", "Bioregulator Peptide", "bioregulator"],
  ["Testoluten", "Bioregulator Peptide", "bioregulator"],
  ["Thymalin", "Bioregulator Peptide", "bioregulator"],
  ["Thymogen", "Bioregulator Peptide", "bioregulator"],
  ["Threogen", "Bioregulator Peptide", "bioregulator"],
  ["Ventfort", "Bioregulator Peptide", "bioregulator"],
  ["Vesilut", "Bioregulator Peptide", "bioregulator"],
  ["Vesugen", "Bioregulator Peptide", "bioregulator"],
  ["Viadonix", "Bioregulator Peptide", "bioregulator"],
  ["Zhenoluten", "Bioregulator Peptide", "bioregulator"]
].map(([name, category, kind]) => ({ name, category, kind }));

export const featuredSlugs = [
  "semaglutide",
  "tirzepatide",
  "retatrutide",
  "bpc-157",
  "tb-500",
  "cagrilintide"
];

export const compareSuggestions = [
  ["semaglutide", "tirzepatide"],
  ["bpc-157", "tb-500"],
  ["cjc-1295-dac", "ipamorelin"]
];

export const peptideStacks = [
  {
    name: "Fat Loss Stack",
    peptides: ["Semaglutide", "Cagrilintide"],
    focus: "Appetite signaling and satiety support",
    note: "Designed as a comparison-ready research stack template."
  },
  {
    name: "Recovery Stack",
    peptides: ["BPC 157", "TB-500"],
    focus: "Soft tissue repair and recovery workflows",
    note: "Useful for managing linked notes and injection logs."
  },
  {
    name: "GH Pulse Stack",
    peptides: ["CJC without DAC", "Ipamorelin"],
    focus: "Pulsatile GH secretagogue pairing",
    note: "Prepared for side-by-side comparison and inventory planning."
  }
];

export const injectionSites = ["abdomen", "thigh", "shoulder", "glute"];

export const favoriteResearchers = [
  {
    id: "placeholder-1",
    name: "Research profile placeholder",
    photo: "",
    educationalBackground: "Add education, training, and key institutions later.",
    specialty: "Peptide therapeutics",
    socialLinks: [],
    publishedWork: ["Reserved for verified researcher entries."],
    summary: "This page is ready for curated profiles, links, and publication highlights."
  }
];

export const glp1Options = [
  { name: "Semaglutide", defaultStrengthMg: 5, defaultVolumeMl: 2, dosesMg: [0.25, 0.5, 1, 1.7, 2.4] },
  { name: "Tirzepatide", defaultStrengthMg: 15, defaultVolumeMl: 3, dosesMg: [2.5, 5, 7.5, 10, 12.5, 15] },
  { name: "Retatrutide", defaultStrengthMg: 10, defaultVolumeMl: 2, dosesMg: [1, 2, 4, 6, 8, 10] },
  { name: "Cagrilintide", defaultStrengthMg: 5, defaultVolumeMl: 2, dosesMg: [0.3, 0.6, 1.2, 2.4] }
];

const slugAliases = {
  "bpc 157": "bpc-157",
  "pt-141 bremelanotide": "pt-141",
  "cjc with dac": "cjc-1295-dac",
  "cjc without dac": "cjc-1295",
  epitalon: "epithalon",
  "ghk-cu": "ghk-cu",
  "igf-1 lr3": "igf-1-lr3",
  kisspeptin: "kisspeptin-10",
  "mod-grf": "mod-grf-1-29",
  "melanotan 1": "melanotan-i",
  "melanotan 2": "melanotan-ii"
};

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/\+/g, " plus ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function slugForRequested(name) {
  const normalized = String(name).trim().toLowerCase();
  return slugAliases[normalized] || slugify(name);
}

function parseArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

function parsePipeList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function sentenceFrom(text) {
  if (!text) return "";
  const cleaned = String(text).replace(/\s+/g, " ").trim();
  const match = cleaned.match(/.*?[.!?](\s|$)/);
  return (match ? match[0] : cleaned).trim();
}

function inferFdaStatus(text = "") {
  const normalized = text.toLowerCase();
  if (normalized.includes("fda-approved") || normalized.includes("approved")) {
    return "Approved / marketed indication noted in source content";
  }
  if (normalized.includes("withdrawn")) {
    return "Withdrawn / historical regulatory status";
  }
  if (normalized.includes("phase")) {
    return "Clinical development stage referenced";
  }
  return PLACEHOLDER_FDA;
}

function inferStage(text = "") {
  const normalized = text.toLowerCase();
  if (normalized.includes("phase iii")) return "Phase III";
  if (normalized.includes("phase ii")) return "Phase II";
  if (normalized.includes("phase i")) return "Phase I";
  if (normalized.includes("preclinical")) return "Preclinical";
  if (normalized.includes("approved")) return "Approved";
  return PLACEHOLDER_STAGE;
}

function normalizeName(name) {
  return String(name)
    .replace(/\s+/g, " ")
    .replace(/\bCu\b/g, "CU")
    .trim();
}

function buildPlaceholder(entry) {
  const slug = slugForRequested(entry.name);
  const isBioregulator = entry.kind === "bioregulator";
  return {
    slug,
    name: normalizeName(entry.name),
    aliases: [],
    category: entry.category,
    kind: entry.kind,
    overview: `${entry.name} is included in the PeptaBase catalog so verified structured research content can be added without changing the page architecture later.`,
    mechanismOfAction: "Mechanism summary pending verified researcher content.",
    researchApplications: ["Structured content placeholder", "Research notes placeholder"],
    doseRange: isBioregulator ? "Research dosing to be added" : "mg or mcg range to be added",
    commonCycleLength: PLACEHOLDER_CYCLE,
    breakBeforeContinuing: PLACEHOLDER_BREAK,
    administrationNotes: "Administration notes will be added once verified research content is supplied.",
    fdaStatus: PLACEHOLDER_FDA,
    developmentStage: PLACEHOLDER_STAGE,
    references: [],
    halfLife: "Not yet added",
    administration: "To be added",
    keywords: [entry.name, entry.category, entry.kind],
    warning: RESEARCH_WARNING,
    quickFacts: {
      category: entry.category,
      typicalDose: "Pending",
      commonCycle: PLACEHOLDER_CYCLE,
      breakDuration: PLACEHOLDER_BREAK,
      administration: "Pending",
      fdaStatus: PLACEHOLDER_FDA
    },
    updatedLabel: "Template ready for verified content",
    featured: featuredSlugs.includes(slug)
  };
}

export function normalizeDbPeptide(record) {
  const aliases = parseArray(record.aliases);
  const applications = parseArray(record.research_applications);
  const references = parseArray(record.pubmed_links).map((url) => {
    const pmid = String(url).split("/").filter(Boolean).pop();
    return {
      id: pmid,
      title: `PubMed reference ${pmid}`,
      journal: "PubMed",
      year: "",
      url
    };
  });

  const overview = sentenceFrom(record.mechanism_of_action) ||
    `${record.name} is included in PeptaBase as a structured research entry.`;

  const statusSource = `${record.mechanism_of_action} ${record.name} ${aliases.join(" ")}`;
  const fdaStatus = inferFdaStatus(statusSource);
  const developmentStage = inferStage(statusSource);

  return {
    slug: record.slug,
    name: normalizeName(record.name),
    aliases,
    category: record.category,
    kind: record.category === "Bioregulator Peptide" ? "bioregulator" : "peptide",
    overview,
    mechanismOfAction: record.mechanism_of_action,
    researchApplications: applications,
    doseRange: record.typical_dosage_range || "Dose range pending",
    commonCycleLength: PLACEHOLDER_CYCLE,
    breakBeforeContinuing: PLACEHOLDER_BREAK,
    administrationNotes: (record.administration_method || "Administration details pending")
      .replace(/implant/gi, "non-implant route"),
    fdaStatus,
    developmentStage,
    references,
    halfLife: record.half_life || "Not listed",
    administration: (record.administration_method || "Not listed").replace(/implant/gi, "non-implant route"),
    keywords: [
      record.name,
      ...aliases,
      record.category,
      record.mechanism_of_action,
      ...applications
    ].filter(Boolean),
    warning: RESEARCH_WARNING,
    quickFacts: {
      category: record.category,
      typicalDose: record.typical_dosage_range || "Pending",
      commonCycle: PLACEHOLDER_CYCLE,
      breakDuration: PLACEHOLDER_BREAK,
      administration: (record.administration_method || "Pending").replace(/implant/gi, "non-implant route"),
      fdaStatus
    },
    updatedLabel: record.updatedAt
      ? new Date(record.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "Catalog entry",
    featured: featuredSlugs.includes(record.slug)
  };
}

export function normalizeWorkbookPeptide(row) {
  const aliases = parsePipeList(row.aliases);
  const applications = parsePipeList(row.research_applications);
  const keywords = parsePipeList(row.keywords);
  const references = [1, 2, 3]
    .map((index) => {
      const url = row[`reference_${index}_url`];
      if (!url) return null;
      return {
        id: row[`reference_${index}_year`] || `${row.slug}-${index}`,
        title: row[`reference_${index}_title`] || `Reference ${index}`,
        journal: row[`reference_${index}_journal`] || "",
        year: row[`reference_${index}_year`] || "",
        url
      };
    })
    .filter(Boolean);

  const overview = row.overview || sentenceFrom(row.mechanism_of_action) || `${row.name} is included in PeptaBase as a structured research entry.`;
  const administration = (row.administration || row.administration_notes || "Not listed").replace(/implant/gi, "non-implant route");
  const fdaStatus = row.fda_status || inferFdaStatus(`${row.name} ${row.mechanism_of_action}`);
  const developmentStage = row.development_stage || inferStage(`${row.name} ${row.mechanism_of_action}`);

  return {
    slug: row.slug,
    name: normalizeName(row.name),
    aliases,
    category: row.category,
    kind: row.kind || (row.category === "Bioregulator Peptide" ? "bioregulator" : "peptide"),
    overview,
    mechanismOfAction: row.mechanism_of_action || "Mechanism summary pending verified researcher content.",
    researchApplications: applications,
    doseRange: row.dose_range || "Dose range pending",
    commonCycleLength: row.common_cycle_length || PLACEHOLDER_CYCLE,
    breakBeforeContinuing: row.break_before_continuing || PLACEHOLDER_BREAK,
    administrationNotes: (row.administration_notes || administration).replace(/implant/gi, "non-implant route"),
    fdaStatus,
    developmentStage,
    references,
    halfLife: row.half_life || "Not listed",
    administration,
    keywords: [...keywords, row.name, row.category].filter(Boolean),
    warning: RESEARCH_WARNING,
    quickFacts: {
      category: row.category,
      typicalDose: row.dose_range || "Pending",
      commonCycle: row.common_cycle_length || PLACEHOLDER_CYCLE,
      breakDuration: row.break_before_continuing || PLACEHOLDER_BREAK,
      administration,
      fdaStatus
    },
    updatedLabel: row.content_status === "prefilled_from_site" ? "Workbook import" : "Workbook review needed",
    featured: featuredSlugs.includes(row.slug),
    notesToDeveloper: row.notes_to_developer || "",
    pubmedQuery: row.pubmed_query || row.name,
    contentStatus: row.content_status || "workbook_import"
  };
}

export function mergePeptideData(records = []) {
  const workbookEntries = Array.isArray(workbookRows) ? workbookRows.map(normalizeWorkbookPeptide) : [];
  const dbEntries = records.map(normalizeDbPeptide);
  const bySlug = new Map(dbEntries.map((entry) => [entry.slug, entry]));

  for (const workbookEntry of workbookEntries) {
    bySlug.set(workbookEntry.slug, workbookEntry);
  }

  for (const requested of requestedEntries) {
    const slug = slugForRequested(requested.name);
    if (!bySlug.has(slug)) {
      bySlug.set(slug, buildPlaceholder(requested));
    }
  }

  return Array.from(bySlug.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function findPeptideBySlug(records, slug) {
  return mergePeptideData(records).find((entry) => entry.slug === slug) || null;
}

export function buildHomeSections(peptides) {
  const featured = peptides.filter((entry) => entry.featured).slice(0, 6);
  const trending = [...peptides]
    .sort((a, b) => {
      const scoreA = a.references.length * 3 + (a.featured ? 8 : 0);
      const scoreB = b.references.length * 3 + (b.featured ? 8 : 0);
      return scoreB - scoreA;
    })
    .slice(0, 6);
  const latestResearch = [...peptides]
    .sort((a, b) => b.references.length - a.references.length)
    .slice(0, 6);
  const recentlyUpdated = [...peptides]
    .filter((entry) => entry.updatedLabel)
    .slice(0, 6);

  return { featured, trending, latestResearch, recentlyUpdated };
}

export function buildComparisonEntries(peptides, leftSlug, rightSlug) {
  const left = peptides.find((entry) => entry.slug === leftSlug);
  const right = peptides.find((entry) => entry.slug === rightSlug);
  if (!left || !right) return null;

  return {
    left,
    right,
    rows: [
      ["Category", left.category, right.category],
      ["Typical Dose", left.quickFacts.typicalDose, right.quickFacts.typicalDose],
      ["Common Cycle", left.quickFacts.commonCycle, right.quickFacts.commonCycle],
      ["Break Duration", left.quickFacts.breakDuration, right.quickFacts.breakDuration],
      ["Administration", left.quickFacts.administration, right.quickFacts.administration],
      ["FDA Status", left.quickFacts.fdaStatus, right.quickFacts.fdaStatus]
    ]
  };
}

export function getCategories(peptides) {
  return ["All", ...new Set(peptides.map((entry) => entry.category))];
}
