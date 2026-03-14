export const categoryPageDefinitions = [
  {
    slug: "healing",
    title: "Healing Peptides",
    shortTitle: "Healing",
    matchCategories: ["Healing & Recovery"],
    overview:
      "Healing peptides are commonly researched for tissue recovery, angiogenesis, tendon or soft tissue signaling, and repair-oriented pathways. This category groups regenerative entries used in recovery-focused research discussions.",
    relatedResearchLinks: [
      { href: "/peptide-comparisons/bpc-157-vs-tb-500", label: "BPC-157 vs TB-500" },
      { href: "/peptide-stacks", label: "Recovery stack templates" },
      { href: "/reconstitution-calculator", label: "Reconstitution calculator" }
    ]
  },
  {
    slug: "glp-1",
    title: "GLP-1 and Metabolic Peptides",
    shortTitle: "GLP-1",
    matchCategories: ["Metabolic"],
    overview:
      "GLP-1 and metabolic peptides are often researched for satiety signaling, glucose regulation, adiposity, and multi-agonist metabolic pathways. This page groups the highest-interest metabolic entries in the database.",
    relatedResearchLinks: [
      { href: "/glp-1-dose-calculator", label: "GLP-1 dose planner" },
      { href: "/peptide-comparisons/semaglutide-vs-tirzepatide", label: "Semaglutide vs Tirzepatide" },
      { href: "/peptide-stacks", label: "Fat loss stack templates" }
    ]
  },
  {
    slug: "gh-secretagogues",
    title: "GH Secretagogues and Growth Hormone Peptides",
    shortTitle: "GH Secretagogues",
    matchCategories: ["Growth Hormone Secretagogue", "Growth Factor"],
    overview:
      "This category covers peptides and adjacent compounds studied for growth hormone pulsatility, IGF signaling, anabolic signaling, and recovery-supporting endocrine pathways.",
    relatedResearchLinks: [
      { href: "/peptide-comparisons/cjc-1295-dac-vs-ipamorelin", label: "CJC-1295 vs Ipamorelin" },
      { href: "/peptide-stacks", label: "GH pulse stack templates" },
      { href: "/research-glossary", label: "Research glossary" }
    ]
  },
  {
    slug: "neuropeptides",
    title: "Neuropeptides and Nootropic Peptides",
    shortTitle: "Neuropeptides",
    matchCategories: ["Nootropic & Neuropeptide"],
    overview:
      "Neuropeptides in this database are grouped around cognitive signaling, stress response, sleep, pituitary signaling, and broader neurobiology research use cases.",
    relatedResearchLinks: [
      { href: "/research-glossary", label: "Mechanism and half-life glossary" },
      { href: "/calculator", label: "Calculator hub" },
      { href: "/", label: "Search the full database" }
    ]
  },
  {
    slug: "mitochondrial",
    title: "Mitochondrial and Longevity Peptides",
    shortTitle: "Mitochondrial",
    matchCategories: ["Longevity & Mitochondrial"],
    overview:
      "Mitochondrial and longevity peptides are typically studied for cellular energy handling, mitochondrial stress response, cytoprotection, and age-related signaling pathways.",
    relatedResearchLinks: [
      { href: "/research-glossary", label: "Mitochondrial research glossary" },
      { href: "/calculator", label: "Calculator hub" },
      { href: "/", label: "Search related entries" }
    ]
  },
  {
    slug: "bioregulators",
    title: "Bioregulator Peptides",
    shortTitle: "Bioregulators",
    matchCategories: ["Bioregulator Peptide"],
    overview:
      "Bioregulator peptides are grouped here for research into organ-specific signaling, peptide bioregulation, and broader Khavinson-style short peptide literature.",
    relatedResearchLinks: [
      { href: "/research-glossary", label: "Bioregulator glossary" },
      { href: "/calculator", label: "Calculator hub" },
      { href: "/", label: "Search all bioregulators" }
    ]
  }
];

export function getCategoryPage(slug: string) {
  return categoryPageDefinitions.find((entry) => entry.slug === slug) ?? null;
}

export function getPeptidesForCategoryPage(peptides: any[], slug: string) {
  const config = getCategoryPage(slug);
  if (!config) {
    return [];
  }

  return peptides.filter((peptide) => config.matchCategories.includes(peptide.category));
}
