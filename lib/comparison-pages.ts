export const comparisonPageDefinitions = [
  {
    slug: "bpc-157-vs-tb-500",
    title: "BPC-157 vs TB-500",
    leftSlug: "bpc-157",
    rightSlug: "tb-500",
    overview:
      "BPC-157 and TB-500 are often discussed together in recovery-oriented peptide research, but they are usually framed around different strengths: BPC-157 is commonly positioned around localized healing and gut-related signaling, while TB-500 is more often discussed in broader tissue remodeling and migration-related contexts.",
    sections: [
      {
        heading: "Mechanism Differences",
        body:
          "BPC-157 is typically described through angiogenic, cytoprotective, and tendon or ligament healing discussions, while TB-500 is commonly linked to actin regulation, cell migration, and broader repair signaling. In practice, researchers often compare them as localized repair support versus more system-wide remodeling potential."
      },
      {
        heading: "Research Use Cases",
        body:
          "BPC-157 is more often researched in tendon, ligament, gut, and site-specific recovery conversations. TB-500 is commonly evaluated in soft tissue, mobility, and connective tissue studies where systemic distribution and repair signaling are the focus."
      },
      {
        heading: "How Researchers Compare Them",
        body:
          "A practical comparison usually comes down to scope and emphasis. Researchers looking at more targeted recovery models often start with BPC-157, while TB-500 is frequently discussed when the question involves broader repair support, tissue movement, or combination recovery stacks."
      }
    ]
  },
  {
    slug: "cjc-1295-vs-ipamorelin",
    title: "CJC-1295 vs Ipamorelin",
    leftSlug: "cjc-1295",
    rightSlug: "ipamorelin",
    overview:
      "CJC-1295 and Ipamorelin are commonly compared in growth hormone research because they are often used together but act through different signaling routes. CJC-1295 is generally framed around GHRH activity, while Ipamorelin is discussed as a ghrelin receptor agonist with a more selective secretagogue profile.",
    sections: [
      {
        heading: "Mechanism Differences",
        body:
          "CJC-1295 is typically positioned as a growth hormone releasing hormone analog intended to amplify or prolong GHRH signaling. Ipamorelin is usually described through ghrelin receptor activity and pulsatile GH release. Their comparison matters because the research question is often whether GHRH-style stimulation, ghrelin-style stimulation, or their pairing is more relevant."
      },
      {
        heading: "Pulse vs Support Role",
        body:
          "Researchers usually frame Ipamorelin as a cleaner GH secretagogue in pulse-oriented protocols, while CJC-1295 is discussed in terms of supporting or extending GHRH-driven signaling. That is why the pair often appears in stack discussions rather than as strict substitutes."
      },
      {
        heading: "When the Comparison Matters",
        body:
          "The comparison becomes most useful when a protocol is trying to choose between simplicity, receptor pathway specificity, and stack design. A single-agent protocol may emphasize Ipamorelin's selectivity, while combination work often uses CJC-1295 to create a broader growth hormone signaling framework."
      }
    ]
  },
  {
    slug: "semaglutide-vs-tirzepatide",
    title: "Semaglutide vs Tirzepatide",
    leftSlug: "semaglutide",
    rightSlug: "tirzepatide",
    overview:
      "Semaglutide and Tirzepatide are high-interest metabolic research peptides, but they are not direct equivalents. Semaglutide is generally framed as a GLP-1 receptor agonist, while Tirzepatide is discussed as a dual GIP and GLP-1 receptor agonist with a broader incretin-signaling profile.",
    sections: [
      {
        heading: "Mechanism Differences",
        body:
          "Semaglutide research usually centers on GLP-1 signaling, appetite regulation, gastric emptying, and glycemic control. Tirzepatide introduces a dual-agonist discussion by pairing GLP-1 effects with GIP receptor activity. That distinction makes Tirzepatide comparisons particularly relevant in metabolic and body-composition research."
      },
      {
        heading: "Research Framing",
        body:
          "Semaglutide is often treated as the clearer single-pathway benchmark in GLP-1 work, while Tirzepatide is framed as a broader incretin comparison point. Researchers commonly use this comparison to evaluate whether a more complex agonist profile changes appetite, glucose, or weight-related outcomes."
      },
      {
        heading: "Why This Comparison Gets Attention",
        body:
          "This is one of the highest-intent comparison topics because it sits at the intersection of metabolic signaling, practical dose planning, and current clinical relevance. Users generally want to understand whether the distinction is simply stronger effect size or a genuinely different signaling profile."
      }
    ]
  }
];

export function getComparisonPageDefinition(slug: string) {
  return comparisonPageDefinitions.find((entry) => entry.slug === slug) ?? null;
}
