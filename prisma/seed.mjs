import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const peptides = [
  {
    slug: "bpc-157",
    name: "BPC-157",
    aliases: JSON.stringify(["Body Protection Compound 157", "Bepecin"]),
    category: "Healing & Recovery",
    mechanism_of_action:
      "Synthetic pentadecapeptide derived from gastric juice protective protein. Promotes angiogenesis, modulates nitric oxide system, upregulates growth factor receptors, and accelerates tendon-to-bone healing via FAK-paxillin pathway activation.",
    research_applications: JSON.stringify([
      "Tissue repair",
      "Tendon & ligament healing",
      "GI mucosal protection",
      "Angiogenesis",
      "Neuroprotection",
    ]),
    typical_dosage_range: "200–500 mcg/day",
    half_life: "4–6 hours",
    administration_method: "Subcutaneous injection, oral",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/25455829/",
      "https://pubmed.ncbi.nlm.nih.gov/23257215/",
      "https://pubmed.ncbi.nlm.nih.gov/30714175/",
    ]),
  },
  {
    slug: "tb-500",
    name: "TB-500",
    aliases: JSON.stringify(["Thymosin Beta-4 Fragment", "Tβ4"]),
    category: "Healing & Recovery",
    mechanism_of_action:
      "Synthetic fragment of thymosin beta-4. Promotes actin polymerization and cell migration, upregulates Akt signaling, modulates inflammatory cytokines, and supports endothelial cell differentiation for wound repair.",
    research_applications: JSON.stringify([
      "Wound healing",
      "Anti-inflammatory",
      "Muscle repair",
      "Cardiac recovery",
      "Hair regrowth",
    ]),
    typical_dosage_range: "2–2.5 mg twice weekly",
    half_life: "~3 days",
    administration_method: "Subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/20962281/",
      "https://pubmed.ncbi.nlm.nih.gov/16423273/",
      "https://pubmed.ncbi.nlm.nih.gov/23013254/",
    ]),
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    aliases: JSON.stringify([
      "Copper Peptide",
      "Glycyl-L-Histidyl-L-Lysine Copper",
    ]),
    category: "Cosmetic & Dermal",
    mechanism_of_action:
      "Naturally occurring copper complex found in plasma. Stimulates collagen and glycosaminoglycan synthesis, activates metalloproteinases for tissue remodeling, modulates antioxidant gene expression, and promotes hair follicle cycling.",
    research_applications: JSON.stringify([
      "Collagen synthesis stimulation",
      "Wound healing",
      "Anti-inflammatory",
      "Hair follicle cycling",
      "Skin remodeling",
    ]),
    typical_dosage_range: "Topical 0.1–1% concentration",
    half_life: "Topical kinetics undefined",
    administration_method: "Topical, subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/25893361/",
      "https://pubmed.ncbi.nlm.nih.gov/22781186/",
      "https://pubmed.ncbi.nlm.nih.gov/30936239/",
    ]),
  },
  {
    slug: "cjc-1295",
    name: "CJC-1295",
    aliases: JSON.stringify(["CJC-1295 without DAC", "Mod GRF(1-29)"]),
    category: "Growth Hormone Secretagogue",
    mechanism_of_action:
      "Synthetic GHRH analogue (modified GRF 1-29) that binds GHRH receptors on anterior pituitary somatotrophs. Stimulates pulsatile GH release and elevates IGF-1 levels without disrupting natural GH secretion patterns.",
    research_applications: JSON.stringify([
      "GH stimulation",
      "IGF-1 elevation",
      "Fat loss research",
      "Muscle preservation",
      "Anti-aging",
    ]),
    typical_dosage_range: "100–300 mcg per injection, 1–3x daily",
    half_life: "~30 minutes",
    administration_method: "Subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/16352683/",
      "https://pubmed.ncbi.nlm.nih.gov/29063869/",
    ]),
  },
  {
    slug: "cjc-1295-dac",
    name: "CJC-1295 DAC",
    aliases: JSON.stringify(["CJC-1295 with Drug Affinity Complex"]),
    category: "Growth Hormone Secretagogue",
    mechanism_of_action:
      "Long-acting GHRH analogue with a Drug Affinity Complex (DAC) that covalently binds serum albumin after injection, dramatically extending half-life. Produces sustained GH and IGF-1 elevation over days rather than hours.",
    research_applications: JSON.stringify([
      "Sustained GH elevation",
      "IGF-1 research",
      "Body composition",
      "Long-acting GHRH studies",
    ]),
    typical_dosage_range: "1–2 mg per week",
    half_life: "6–8 days",
    administration_method: "Subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/16352683/",
      "https://pubmed.ncbi.nlm.nih.gov/18375496/",
    ]),
  },
  {
    slug: "mod-grf-1-29",
    name: "Mod GRF 1-29",
    aliases: JSON.stringify(["Modified GRF(1-29)", "Tetrasubstituted GRF(1-29)"]),
    category: "Growth Hormone Secretagogue",
    mechanism_of_action:
      "Tetrasubstituted analogue of GHRH(1-29) with four amino acid substitutions (positions 2, 8, 15, 27) to resist enzymatic degradation. Selectively stimulates pulsatile GH release from somatotrophs.",
    research_applications: JSON.stringify([
      "Pulsatile GH release",
      "Anti-aging research",
      "Body composition",
      "Synergy with GHRPs",
    ]),
    typical_dosage_range: "100–300 mcg per injection",
    half_life: "~30 minutes",
    administration_method: "Subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/16352683/",
      "https://pubmed.ncbi.nlm.nih.gov/29063869/",
    ]),
  },
  {
    slug: "sermorelin",
    name: "Sermorelin",
    aliases: JSON.stringify(["GRF(1-29)NH2", "Geref"]),
    category: "Growth Hormone Secretagogue",
    mechanism_of_action:
      "Synthetic analogue of the first 29 amino acids of GHRH. Binds GHRH receptors to stimulate physiological pulsatile GH release. Previously FDA-approved for pediatric GH deficiency diagnosis.",
    research_applications: JSON.stringify([
      "GH deficiency assessment",
      "Anti-aging",
      "Sleep improvement",
      "Body composition",
    ]),
    typical_dosage_range: "200–500 mcg before bed",
    half_life: "10–20 minutes",
    administration_method: "Subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/9467534/",
      "https://pubmed.ncbi.nlm.nih.gov/10352397/",
    ]),
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    aliases: JSON.stringify(["Egrifta", "TH9507"]),
    category: "Growth Hormone Secretagogue",
    mechanism_of_action:
      "Synthetic GHRH analogue with a trans-3-hexenoic acid modification. FDA-approved for HIV-associated lipodystrophy. Stimulates pulsatile GH release and reduces visceral adipose tissue.",
    research_applications: JSON.stringify([
      "HIV lipodystrophy",
      "Visceral fat reduction",
      "Cognitive function",
      "NAFLD/NASH research",
    ]),
    typical_dosage_range: "2 mg/day",
    half_life: "26–38 minutes",
    administration_method: "Subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/20580779/",
      "https://pubmed.ncbi.nlm.nih.gov/25329435/",
    ]),
  },
  {
    slug: "ipamorelin",
    name: "Ipamorelin",
    aliases: JSON.stringify(["Ipamorelin Acetate", "NNC 26-0161"]),
    category: "Growth Hormone Secretagogue",
    mechanism_of_action:
      "Selective pentapeptide ghrelin receptor (GHS-R1a) agonist. Produces clean GH release without significantly elevating cortisol, prolactin, or ACTH, making it the most selective GHRP studied.",
    research_applications: JSON.stringify([
      "Selective GH release",
      "Body composition",
      "Sleep improvement",
      "Recovery",
      "Bone density",
    ]),
    typical_dosage_range: "200–300 mcg per injection, 2–3x daily",
    half_life: "~2 hours",
    administration_method: "Subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/9849822/",
      "https://pubmed.ncbi.nlm.nih.gov/10702872/",
      "https://pubmed.ncbi.nlm.nih.gov/15563729/",
    ]),
  },
  {
    slug: "ghrp-2",
    name: "GHRP-2",
    aliases: JSON.stringify(["Growth Hormone Releasing Peptide-2", "Pralmorelin"]),
    category: "Growth Hormone Secretagogue",
    mechanism_of_action:
      "Synthetic hexapeptide ghrelin mimetic that activates GHS-R1a receptors. Produces robust GH release, mildly elevates cortisol and prolactin. Stronger GH response than GHRP-6 with less appetite stimulation.",
    research_applications: JSON.stringify([
      "GH secretion research",
      "Appetite studies",
      "Body composition",
      "GH deficiency diagnosis",
    ]),
    typical_dosage_range: "100–300 mcg per injection, 2–3x daily",
    half_life: "~1.5 hours",
    administration_method: "Subcutaneous injection, intranasal",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/9467534/",
      "https://pubmed.ncbi.nlm.nih.gov/9694925/",
    ]),
  },
  {
    slug: "ghrp-6",
    name: "GHRP-6",
    aliases: JSON.stringify(["Growth Hormone Releasing Peptide-6", "SKF-110679"]),
    category: "Growth Hormone Secretagogue",
    mechanism_of_action:
      "First-generation synthetic hexapeptide ghrelin mimetic. Activates GHS-R1a with strong GH-releasing effects. Notable for significant ghrelin-mediated appetite stimulation and gastric motility effects.",
    research_applications: JSON.stringify([
      "GH release",
      "Appetite stimulation",
      "Cytoprotection",
      "Gastric motility",
    ]),
    typical_dosage_range: "100–300 mcg per injection, 2–3x daily",
    half_life: "~2 hours",
    administration_method: "Subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/9694925/",
      "https://pubmed.ncbi.nlm.nih.gov/10352397/",
    ]),
  },
  {
    slug: "hexarelin",
    name: "Hexarelin",
    aliases: JSON.stringify(["Examorelin", "HEX"]),
    category: "Growth Hormone Secretagogue",
    mechanism_of_action:
      "Potent synthetic hexapeptide GHS-R1a agonist. Produces the strongest GH release among GHRPs but also elevates cortisol and prolactin. Notable for cardiac-protective properties via CD36 receptor activation independent of GH.",
    research_applications: JSON.stringify([
      "GH release (potent)",
      "Cardiac protection",
      "Body composition",
      "CD36 receptor studies",
    ]),
    typical_dosage_range: "100–200 mcg per injection, 2–3x daily",
    half_life: "~70 minutes",
    administration_method: "Subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/9694925/",
      "https://pubmed.ncbi.nlm.nih.gov/15563729/",
    ]),
  },
  {
    slug: "semaglutide",
    name: "Semaglutide",
    aliases: JSON.stringify(["Ozempic", "Wegovy", "Rybelsus"]),
    category: "Metabolic",
    mechanism_of_action:
      "GLP-1 receptor agonist with C-18 fatty diacid modification for albumin binding. Enhances insulin secretion, suppresses glucagon, delays gastric emptying, and acts on hypothalamic appetite centers. FDA-approved for T2D and obesity.",
    research_applications: JSON.stringify([
      "Type 2 diabetes management",
      "Obesity treatment",
      "Cardiovascular risk reduction",
      "Appetite regulation",
      "NASH research",
    ]),
    typical_dosage_range: "0.25–2.4 mg/week",
    half_life: "~7 days",
    administration_method: "Subcutaneous injection, oral",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/34170647/",
      "https://pubmed.ncbi.nlm.nih.gov/33053668/",
      "https://pubmed.ncbi.nlm.nih.gov/36720461/",
    ]),
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide",
    aliases: JSON.stringify(["Mounjaro", "Zepbound", "LY3298176"]),
    category: "Metabolic",
    mechanism_of_action:
      "Dual GIP and GLP-1 receptor agonist (twincretin). Activates both incretin pathways for synergistic insulin secretion, glucagon suppression, and appetite reduction. Superior weight loss versus GLP-1 mono-agonists in clinical trials.",
    research_applications: JSON.stringify([
      "Dual incretin agonism",
      "Type 2 diabetes",
      "Obesity",
      "Metabolic syndrome",
      "Heart failure",
    ]),
    typical_dosage_range: "2.5–15 mg/week",
    half_life: "~5 days",
    administration_method: "Subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/35658024/",
      "https://pubmed.ncbi.nlm.nih.gov/34170641/",
    ]),
  },
  {
    slug: "retatrutide",
    name: "Retatrutide",
    aliases: JSON.stringify(["LY3437943", "Triple G Agonist"]),
    category: "Metabolic",
    mechanism_of_action:
      "Triple agonist targeting GIP, GLP-1, and glucagon receptors simultaneously. The glucagon component adds thermogenic and lipolytic effects beyond dual incretins, producing the highest weight loss seen in clinical trials to date.",
    research_applications: JSON.stringify([
      "Triple receptor agonism",
      "Obesity research",
      "Type 2 diabetes",
      "NASH/MASH",
      "Metabolic research",
    ]),
    typical_dosage_range: "1–12 mg/week (clinical trial doses)",
    half_life: "~6 days",
    administration_method: "Subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/37351564/",
      "https://pubmed.ncbi.nlm.nih.gov/37385277/",
    ]),
  },
  {
    slug: "aod-9604",
    name: "AOD-9604",
    aliases: JSON.stringify(["Anti-Obesity Drug 9604", "hGH Fragment 176-191"]),
    category: "Metabolic",
    mechanism_of_action:
      "Modified fragment of hGH (amino acids 176-191) that retains lipolytic activity without the diabetogenic or growth-promoting effects of full-length GH. Stimulates lipolysis and inhibits lipogenesis via beta-3 adrenergic pathways.",
    research_applications: JSON.stringify([
      "Fat metabolism",
      "Anti-obesity research",
      "Cartilage repair",
      "Osteoarthritis",
    ]),
    typical_dosage_range: "250–500 mcg/day",
    half_life: "~30 minutes",
    administration_method: "Subcutaneous injection, oral",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/11713213/",
      "https://pubmed.ncbi.nlm.nih.gov/12220527/",
    ]),
  },
  {
    slug: "mots-c",
    name: "MOTS-C",
    aliases: JSON.stringify(["Mitochondrial Open Reading Frame of the 12S rRNA-c"]),
    category: "Longevity & Mitochondrial",
    mechanism_of_action:
      "Mitochondrial-derived peptide encoded by 12S rRNA. Activates AMPK, regulates AICAR and folate-methionine cycling, enhances glucose uptake in skeletal muscle, and improves metabolic homeostasis under stress conditions.",
    research_applications: JSON.stringify([
      "Metabolic regulation",
      "Exercise mimetic",
      "Insulin sensitivity",
      "Aging research",
      "Mitochondrial function",
    ]),
    typical_dosage_range: "5–10 mg/week",
    half_life: "~4 hours (estimated)",
    administration_method: "Subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/25738459/",
      "https://pubmed.ncbi.nlm.nih.gov/30595451/",
    ]),
  },
  {
    slug: "humanin",
    name: "Humanin",
    aliases: JSON.stringify(["HN", "HNG (S14G-Humanin)"]),
    category: "Longevity & Mitochondrial",
    mechanism_of_action:
      "Mitochondrial-derived peptide encoded by 16S rRNA. Binds FPRL1/2 and BAX, activates STAT3 and PI3K/Akt survival pathways. Inhibits apoptosis by blocking Bax translocation to mitochondria. Neuroprotective against amyloid-beta toxicity.",
    research_applications: JSON.stringify([
      "Neuroprotection",
      "Alzheimer's research",
      "Anti-apoptotic",
      "Cardiovascular protection",
      "Aging biomarker",
    ]),
    typical_dosage_range: "Research-grade dosing varies",
    half_life: "Minutes (native); hours (S14G analogue)",
    administration_method: "Subcutaneous injection, intranasal",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/11600885/",
      "https://pubmed.ncbi.nlm.nih.gov/27150903/",
    ]),
  },
  {
    slug: "ss-31",
    name: "SS-31",
    aliases: JSON.stringify(["Elamipretide", "Bendavia", "MTP-131"]),
    category: "Longevity & Mitochondrial",
    mechanism_of_action:
      "Cell-permeable tetrapeptide (D-Arg-Dmt-Lys-Phe-NH2) that targets cardiolipin in the inner mitochondrial membrane. Stabilizes cristae structure, optimizes electron transport chain efficiency, and reduces mitochondrial ROS production.",
    research_applications: JSON.stringify([
      "Mitochondrial dysfunction",
      "Heart failure",
      "Barth syndrome",
      "Age-related diseases",
      "Ischemia-reperfusion injury",
    ]),
    typical_dosage_range: "0.25–4 mg/kg (clinical trial dosing)",
    half_life: "~4 hours",
    administration_method: "Subcutaneous injection, intravenous",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/15044680/",
      "https://pubmed.ncbi.nlm.nih.gov/25182745/",
    ]),
  },
  {
    slug: "epithalon",
    name: "Epithalon",
    aliases: JSON.stringify(["Epitalon", "Epithalamin Tetrapeptide", "Ala-Glu-Asp-Gly"]),
    category: "Longevity & Mitochondrial",
    mechanism_of_action:
      "Synthetic tetrapeptide analogue of epithalamin from the pineal gland. Activates telomerase in somatic cells, regulates melatonin synthesis, normalizes circadian rhythms, and modulates hypothalamic-pituitary-adrenal axis function.",
    research_applications: JSON.stringify([
      "Telomere lengthening",
      "Pineal regulation",
      "Anti-aging",
      "Sleep normalization",
      "Melatonin regulation",
    ]),
    typical_dosage_range: "5–10 mg/day for 10–20 days",
    half_life: "~30 minutes",
    administration_method: "Subcutaneous injection, intravenous",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/12374906/",
      "https://pubmed.ncbi.nlm.nih.gov/15354753/",
      "https://pubmed.ncbi.nlm.nih.gov/32759312/",
    ]),
  },
  {
    slug: "selank",
    name: "Selank",
    aliases: JSON.stringify(["TP-7", "Thr-Lys-Pro-Arg-Pro-Gly-Pro"]),
    category: "Nootropic & Neuropeptide",
    mechanism_of_action:
      "Synthetic heptapeptide analogue of tuftsin with added Pro-Gly-Pro sequence for enzymatic stability. Modulates GABA-A receptor allosteric sites, increases BDNF and enkephalin expression, and regulates IL-6 balance.",
    research_applications: JSON.stringify([
      "Anxiolytic research",
      "Cognitive enhancement",
      "Immune modulation",
      "Nootropic",
      "Stress adaptation",
    ]),
    typical_dosage_range: "250–500 mcg/day intranasal",
    half_life: "Minutes (plasma); extended CNS activity",
    administration_method: "Intranasal",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/18577356/",
      "https://pubmed.ncbi.nlm.nih.gov/19149816/",
    ]),
  },
  {
    slug: "semax",
    name: "Semax",
    aliases: JSON.stringify(["ACTH(4-7)-Pro-Gly-Pro", "Semax Heptapeptide"]),
    category: "Nootropic & Neuropeptide",
    mechanism_of_action:
      "Synthetic heptapeptide derived from ACTH(4-7) with Pro-Gly-Pro tail. Upregulates BDNF and TrkB signaling, modulates dopaminergic and serotonergic systems, enhances NGF expression, and provides neuroprotection via anti-inflammatory pathways.",
    research_applications: JSON.stringify([
      "BDNF upregulation",
      "Cognitive enhancement",
      "Neuroprotection",
      "Stroke recovery",
      "Optic nerve atrophy",
    ]),
    typical_dosage_range: "200–900 mcg/day intranasal",
    half_life: "Minutes (plasma); ~24h CNS activity",
    administration_method: "Intranasal",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/11830992/",
      "https://pubmed.ncbi.nlm.nih.gov/21870994/",
    ]),
  },
  {
    slug: "dihexa",
    name: "Dihexa",
    aliases: JSON.stringify(["N-hexanoyl-Tyr-Ile-(6)-aminohexanoic amide"]),
    category: "Nootropic & Neuropeptide",
    mechanism_of_action:
      "Angiotensin IV analogue that binds hepatocyte growth factor (HGF) receptor (c-Met) with extremely high potency. Promotes synaptogenesis and spine formation via HGF/c-Met signaling, claimed to be 10^7 times more potent than BDNF in vitro.",
    research_applications: JSON.stringify([
      "Synaptogenesis",
      "Cognitive enhancement",
      "Alzheimer's research",
      "HGF/c-Met pathway",
      "Memory formation",
    ]),
    typical_dosage_range: "Research-stage; 10–40 mg oral (anecdotal)",
    half_life: "Not fully characterized",
    administration_method: "Oral, subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/23543812/",
      "https://pubmed.ncbi.nlm.nih.gov/25242636/",
    ]),
  },
  {
    slug: "p21",
    name: "P21",
    aliases: JSON.stringify(["P021", "Ac-DGGLAG-NH2-CNTF-derived"]),
    category: "Nootropic & Neuropeptide",
    mechanism_of_action:
      "Small CNTF (ciliary neurotrophic factor)-derived peptide that inhibits leukemia inhibitory factor (LIF) signaling while enhancing BDNF/TrkB pathway. Promotes neurogenesis in hippocampal dentate gyrus and reduces tau hyperphosphorylation.",
    research_applications: JSON.stringify([
      "Neurogenesis",
      "Alzheimer's research",
      "Tau pathology",
      "Cognitive decline",
      "BDNF modulation",
    ]),
    typical_dosage_range: "Research-grade; varies by study",
    half_life: "Not fully characterized",
    administration_method: "Subcutaneous injection, oral (in animal studies)",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/24239656/",
      "https://pubmed.ncbi.nlm.nih.gov/26005850/",
    ]),
  },
  {
    slug: "noopept",
    name: "Noopept",
    aliases: JSON.stringify(["GVS-111", "N-Phenylacetyl-L-prolylglycine ethyl ester"]),
    category: "Nootropic & Neuropeptide",
    mechanism_of_action:
      "Dipeptide nootropic that modulates AMPA and NMDA glutamate receptors, increases NGF and BDNF in hippocampus and cortex, enhances alpha/beta1 EEG activity, and provides neuroprotection through antioxidant and anti-inflammatory mechanisms.",
    research_applications: JSON.stringify([
      "Cognitive enhancement",
      "Neuroprotection",
      "Memory consolidation",
      "NGF/BDNF upregulation",
      "Anxiolytic effects",
    ]),
    typical_dosage_range: "10–30 mg/day",
    half_life: "~5 minutes (active metabolite cycloprolylglycine longer)",
    administration_method: "Oral, sublingual, intranasal",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/19240853/",
      "https://pubmed.ncbi.nlm.nih.gov/18611398/",
    ]),
  },
  {
    slug: "thymosin-alpha-1",
    name: "Thymosin Alpha-1",
    aliases: JSON.stringify(["Tα1", "Zadaxin", "Thymalfasin"]),
    category: "Immune Modulation",
    mechanism_of_action:
      "28-amino acid thymic peptide that activates dendritic cell maturation via TLR9, promotes T-cell differentiation (Th1 polarization), enhances NK cell cytotoxicity, and modulates inflammatory cytokine balance. Approved in multiple countries for hepatitis B/C.",
    research_applications: JSON.stringify([
      "Immune modulation",
      "Hepatitis B/C",
      "Cancer immunotherapy adjunct",
      "Vaccine enhancement",
      "Sepsis management",
    ]),
    typical_dosage_range: "1.6 mg twice weekly",
    half_life: "~2 hours",
    administration_method: "Subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/17408879/",
      "https://pubmed.ncbi.nlm.nih.gov/24656636/",
    ]),
  },
  {
    slug: "thymogen",
    name: "Thymogen",
    aliases: JSON.stringify(["EW Dipeptide", "Glu-Trp"]),
    category: "Bioregulator Peptide",
    mechanism_of_action:
      "Synthetic dipeptide (Glu-Trp) that mimics thymic peptide activity. Modulates T-lymphocyte differentiation and maturation, normalizes immune cell ratios, and supports thymic function. Part of Khavinson's bioregulatory peptide research.",
    research_applications: JSON.stringify([
      "Immune regulation",
      "Thymus support",
      "T-cell maturation",
      "Immunodeficiency research",
    ]),
    typical_dosage_range: "1–10 mg intranasally or injection",
    half_life: "Short (dipeptide)",
    administration_method: "Intranasal, intramuscular injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/16388688/",
      "https://pubmed.ncbi.nlm.nih.gov/22601587/",
    ]),
  },
  {
    slug: "vilon",
    name: "Vilon",
    aliases: JSON.stringify(["KE Dipeptide", "Lys-Glu"]),
    category: "Bioregulator Peptide",
    mechanism_of_action:
      "Synthetic dipeptide (Lys-Glu) derived from thymic bioregulators. Modulates gene expression related to immune function and cell proliferation, promotes T-lymphocyte differentiation, and supports thymic peptide balance in aging.",
    research_applications: JSON.stringify([
      "Immune regulation",
      "Anti-aging",
      "Gene expression modulation",
      "Thymic function",
    ]),
    typical_dosage_range: "10–20 mcg/day",
    half_life: "Short (dipeptide)",
    administration_method: "Oral, sublingual",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/16388688/",
      "https://pubmed.ncbi.nlm.nih.gov/14993984/",
    ]),
  },
  {
    slug: "pinealon",
    name: "Pinealon",
    aliases: JSON.stringify(["EDR Tripeptide", "Glu-Asp-Arg"]),
    category: "Bioregulator Peptide",
    mechanism_of_action:
      "Synthetic tripeptide bioregulator targeting CNS and pineal function. Penetrates cell membranes, interacts with DNA regulatory regions, modulates gene expression for neuroprotection, and regulates melatonin synthesis pathways.",
    research_applications: JSON.stringify([
      "CNS bioregulation",
      "Neuroprotection",
      "Pineal gland function",
      "Circadian rhythm support",
      "Cognitive aging",
    ]),
    typical_dosage_range: "10–20 mcg/day",
    half_life: "Short (tripeptide)",
    administration_method: "Oral, sublingual",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/22601587/",
      "https://pubmed.ncbi.nlm.nih.gov/16388688/",
    ]),
  },
  {
    slug: "vesugen",
    name: "Vesugen",
    aliases: JSON.stringify(["KED Tripeptide", "Lys-Glu-Asp"]),
    category: "Bioregulator Peptide",
    mechanism_of_action:
      "Synthetic tripeptide bioregulator targeting vascular endothelium. Modulates gene expression related to vascular wall integrity, endothelial function, and angiogenesis. Part of Khavinson's organ-specific peptide bioregulation model.",
    research_applications: JSON.stringify([
      "Vascular health",
      "Endothelial function",
      "Cardiovascular aging",
      "Microcirculation",
    ]),
    typical_dosage_range: "10–20 mcg/day",
    half_life: "Short (tripeptide)",
    administration_method: "Oral, sublingual",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/22601587/",
      "https://pubmed.ncbi.nlm.nih.gov/16388688/",
    ]),
  },
  {
    slug: "cartalax",
    name: "Cartalax",
    aliases: JSON.stringify(["AED Tripeptide", "Ala-Glu-Asp"]),
    category: "Bioregulator Peptide",
    mechanism_of_action:
      "Synthetic tripeptide bioregulator targeting cartilage and musculoskeletal tissue. Modulates chondrocyte gene expression, supports cartilage matrix synthesis, and regulates musculoskeletal aging processes.",
    research_applications: JSON.stringify([
      "Cartilage bioregulation",
      "Musculoskeletal aging",
      "Joint health",
      "Chondrocyte function",
    ]),
    typical_dosage_range: "10–20 mcg/day",
    half_life: "Short (tripeptide)",
    administration_method: "Oral, sublingual",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/22601587/",
      "https://pubmed.ncbi.nlm.nih.gov/16388688/",
    ]),
  },
  {
    slug: "bronchogen",
    name: "Bronchogen",
    aliases: JSON.stringify(["AED Tripeptide (bronchial)", "Ala-Glu-Asp (respiratory)"]),
    category: "Bioregulator Peptide",
    mechanism_of_action:
      "Synthetic tripeptide bioregulator targeting bronchial and pulmonary tissue. Normalizes gene expression in bronchial epithelial cells, modulates respiratory mucosal immunity, and supports lung tissue repair mechanisms.",
    research_applications: JSON.stringify([
      "Respiratory bioregulation",
      "Bronchial function",
      "Lung aging",
      "Mucosal immunity",
    ]),
    typical_dosage_range: "10–20 mcg/day",
    half_life: "Short (tripeptide)",
    administration_method: "Oral, sublingual",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/22601587/",
      "https://pubmed.ncbi.nlm.nih.gov/16388688/",
    ]),
  },
  {
    slug: "livagen",
    name: "Livagen",
    aliases: JSON.stringify(["AEDR Tetrapeptide", "Ala-Glu-Asp-Arg (hepatic)"]),
    category: "Bioregulator Peptide",
    mechanism_of_action:
      "Synthetic tetrapeptide bioregulator targeting hepatic tissue. Decondenses heterochromatin in hepatocyte nuclei, activating previously silenced genes. Modulates liver-specific gene expression and supports hepatic regeneration.",
    research_applications: JSON.stringify([
      "Liver bioregulation",
      "Chromatin remodeling",
      "Hepatocyte gene activation",
      "Hepatic aging",
    ]),
    typical_dosage_range: "10–20 mcg/day",
    half_life: "Short (tetrapeptide)",
    administration_method: "Oral, sublingual",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/14993984/",
      "https://pubmed.ncbi.nlm.nih.gov/16388688/",
    ]),
  },
  {
    slug: "endoluten",
    name: "Endoluten",
    aliases: JSON.stringify(["Pineal Gland Peptide Complex"]),
    category: "Bioregulator Peptide",
    mechanism_of_action:
      "Complex peptide bioregulator derived from pineal gland tissue. Supports melatonin synthesis, modulates neuroendocrine function, regulates circadian rhythms, and influences telomerase activity in pinealocytes.",
    research_applications: JSON.stringify([
      "Pineal gland function",
      "Melatonin regulation",
      "Circadian rhythm",
      "Neuroendocrine aging",
      "Telomere maintenance",
    ]),
    typical_dosage_range: "1–2 capsules/day (complex preparation)",
    half_life: "Variable (complex)",
    administration_method: "Oral",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/22601587/",
      "https://pubmed.ncbi.nlm.nih.gov/32759312/",
    ]),
  },
  {
    slug: "testagen",
    name: "Testagen",
    aliases: JSON.stringify(["Testicular Peptide Bioregulator"]),
    category: "Bioregulator Peptide",
    mechanism_of_action:
      "Peptide bioregulator derived from testicular tissue extracts. Modulates Leydig cell gene expression, supports testosterone synthesis pathways, and normalizes hypothalamic-pituitary-gonadal axis function in aging models.",
    research_applications: JSON.stringify([
      "Testicular function",
      "Testosterone regulation",
      "Male reproductive aging",
      "HPG axis modulation",
    ]),
    typical_dosage_range: "1–2 capsules/day (complex preparation)",
    half_life: "Variable (complex)",
    administration_method: "Oral",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/22601587/",
      "https://pubmed.ncbi.nlm.nih.gov/16388688/",
    ]),
  },
  {
    slug: "prostatilen",
    name: "Prostatilen",
    aliases: JSON.stringify(["Prostate Peptide Bioregulator", "Vitaprost"]),
    category: "Bioregulator Peptide",
    mechanism_of_action:
      "Peptide complex extracted from bovine prostate gland. Reduces prostatic inflammation, normalizes prostate epithelial cell function, improves microcirculation, and modulates local immune responses. Approved in Russia for prostatitis/BPH.",
    research_applications: JSON.stringify([
      "Prostatitis treatment",
      "BPH research",
      "Prostatic inflammation",
      "Urological function",
    ]),
    typical_dosage_range: "30–50 mg suppository or 5–10 mg injection",
    half_life: "Variable (complex)",
    administration_method: "Rectal suppository, intramuscular injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/16388688/",
      "https://pubmed.ncbi.nlm.nih.gov/22601587/",
    ]),
  },
  {
    slug: "cortagen",
    name: "Cortagen",
    aliases: JSON.stringify(["Brain Cortex Peptide Bioregulator"]),
    category: "Bioregulator Peptide",
    mechanism_of_action:
      "Peptide bioregulator derived from cerebral cortex tissue. Normalizes cortical neuron gene expression, supports synaptic plasticity, modulates neurotransmitter balance, and provides neuroprotection during aging and neurodegeneration.",
    research_applications: JSON.stringify([
      "Cortical function",
      "Neuroprotection",
      "Cognitive aging",
      "Neurodegenerative diseases",
    ]),
    typical_dosage_range: "1–2 capsules/day (complex preparation)",
    half_life: "Variable (complex)",
    administration_method: "Oral",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/22601587/",
      "https://pubmed.ncbi.nlm.nih.gov/16388688/",
    ]),
  },
  {
    slug: "ovagen",
    name: "Ovagen",
    aliases: JSON.stringify(["Liver Peptide Bioregulator", "EDP Tripeptide"]),
    category: "Bioregulator Peptide",
    mechanism_of_action:
      "Synthetic tripeptide bioregulator targeting hepatic and GI tissue. Normalizes liver cell gene expression, supports hepatobiliary function, modulates lipid metabolism pathways, and promotes GI mucosal integrity.",
    research_applications: JSON.stringify([
      "Liver function",
      "GI health",
      "Hepatobiliary regulation",
      "Lipid metabolism",
    ]),
    typical_dosage_range: "10–20 mcg/day",
    half_life: "Short (tripeptide)",
    administration_method: "Oral, sublingual",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/22601587/",
      "https://pubmed.ncbi.nlm.nih.gov/16388688/",
    ]),
  },
  {
    slug: "retinalamin",
    name: "Retinalamin",
    aliases: JSON.stringify(["Retinal Peptide Bioregulator"]),
    category: "Bioregulator Peptide",
    mechanism_of_action:
      "Peptide complex derived from retinal tissue. Normalizes retinal pigment epithelium function, supports photoreceptor cell metabolism, modulates retinal microcirculation, and provides neuroprotection for optic nerve structures.",
    research_applications: JSON.stringify([
      "Retinal degeneration",
      "Diabetic retinopathy",
      "Optic nerve support",
      "Age-related macular degeneration",
    ]),
    typical_dosage_range: "5 mg/day injection for 10 days",
    half_life: "Variable (complex)",
    administration_method: "Parabulbar or intramuscular injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/22601587/",
      "https://pubmed.ncbi.nlm.nih.gov/16388688/",
    ]),
  },
  {
    slug: "pancragen",
    name: "Pancragen",
    aliases: JSON.stringify(["Pancreatic Peptide Bioregulator"]),
    category: "Bioregulator Peptide",
    mechanism_of_action:
      "Peptide bioregulator targeting pancreatic tissue. Normalizes beta-cell gene expression, supports insulin synthesis and secretion pathways, modulates pancreatic enzyme production, and promotes islet cell function during metabolic stress.",
    research_applications: JSON.stringify([
      "Pancreatic function",
      "Beta-cell support",
      "Insulin regulation",
      "Metabolic aging",
    ]),
    typical_dosage_range: "1–2 capsules/day (complex preparation)",
    half_life: "Variable (complex)",
    administration_method: "Oral",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/22601587/",
      "https://pubmed.ncbi.nlm.nih.gov/16388688/",
    ]),
  },
  {
    slug: "renagen",
    name: "Renagen",
    aliases: JSON.stringify(["Kidney Peptide Bioregulator"]),
    category: "Bioregulator Peptide",
    mechanism_of_action:
      "Peptide bioregulator targeting renal tissue. Normalizes nephron cell gene expression, supports glomerular filtration efficiency, modulates renal tubular transport mechanisms, and promotes kidney tissue repair during aging.",
    research_applications: JSON.stringify([
      "Renal function",
      "Kidney aging",
      "Nephroprotection",
      "Glomerular health",
    ]),
    typical_dosage_range: "1–2 capsules/day (complex preparation)",
    half_life: "Variable (complex)",
    administration_method: "Oral",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/22601587/",
      "https://pubmed.ncbi.nlm.nih.gov/16388688/",
    ]),
  },
  {
    slug: "sigumir",
    name: "Sigumir",
    aliases: JSON.stringify(["Cartilage & Bone Peptide Bioregulator"]),
    category: "Bioregulator Peptide",
    mechanism_of_action:
      "Peptide bioregulator derived from cartilage and bone tissue. Normalizes chondrocyte and osteoblast gene expression, supports proteoglycan synthesis, modulates calcium metabolism, and promotes joint and skeletal tissue maintenance.",
    research_applications: JSON.stringify([
      "Osteoarthritis",
      "Cartilage repair",
      "Bone health",
      "Joint function",
      "Musculoskeletal aging",
    ]),
    typical_dosage_range: "1–2 capsules/day (complex preparation)",
    half_life: "Variable (complex)",
    administration_method: "Oral",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/22601587/",
      "https://pubmed.ncbi.nlm.nih.gov/16388688/",
    ]),
  },
  {
    slug: "melanotan-i",
    name: "Melanotan I",
    aliases: JSON.stringify(["Afamelanotide", "NDP-α-MSH", "Scenesse"]),
    category: "Melanocortin",
    mechanism_of_action:
      "Synthetic linear analogue of α-MSH that selectively activates MC1R on melanocytes. Stimulates eumelanin synthesis via cAMP/PKA/MITF pathway. FDA-approved (as afamelanotide) for erythropoietic protoporphyria (EPP) photoprotection.",
    research_applications: JSON.stringify([
      "Photoprotection",
      "Erythropoietic protoporphyria",
      "Melanogenesis",
      "Skin pigmentation",
      "Vitiligo research",
    ]),
    typical_dosage_range: "16 mg subcutaneous implant (Scenesse)",
    half_life: "~30 minutes",
    administration_method: "Subcutaneous implant, subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/25060553/",
      "https://pubmed.ncbi.nlm.nih.gov/28493306/",
    ]),
  },
  {
    slug: "melanotan-ii",
    name: "Melanotan II",
    aliases: JSON.stringify(["MT-II", "MT-2"]),
    category: "Melanocortin",
    mechanism_of_action:
      "Non-selective cyclic melanocortin agonist activating MC1R, MC3R, MC4R, and MC5R. Induces skin tanning (MC1R), sexual arousal (MC4R), appetite suppression (MC4R), and potential lipolytic effects (MC3R). Precursor compound for PT-141.",
    research_applications: JSON.stringify([
      "Melanogenesis",
      "Sexual dysfunction",
      "Appetite research",
      "Tanning/photoprotection",
    ]),
    typical_dosage_range: "0.25–1 mg per injection",
    half_life: "~1 hour",
    administration_method: "Subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/10837297/",
      "https://pubmed.ncbi.nlm.nih.gov/15668152/",
    ]),
  },
  {
    slug: "pt-141",
    name: "PT-141",
    aliases: JSON.stringify(["Bremelanotide", "Vyleesi"]),
    category: "Melanocortin",
    mechanism_of_action:
      "Selective MC4R agonist derived from Melanotan II metabolite. Activates hypothalamic melanocortin circuits for sexual arousal independent of vascular mechanisms. FDA-approved for hypoactive sexual desire disorder (HSDD) in premenopausal women.",
    research_applications: JSON.stringify([
      "Hypoactive sexual desire disorder",
      "Sexual arousal mechanisms",
      "MC4R pathway",
      "CNS-mediated sexual function",
    ]),
    typical_dosage_range: "1.75 mg per event",
    half_life: "~2.7 hours",
    administration_method: "Subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/16422843/",
      "https://pubmed.ncbi.nlm.nih.gov/31141204/",
    ]),
  },
  {
    slug: "kisspeptin-10",
    name: "Kisspeptin-10",
    aliases: JSON.stringify(["KP-10", "Metastin 45-54"]),
    category: "Reproductive",
    mechanism_of_action:
      "C-terminal decapeptide of kisspeptin that activates KISS1R (GPR54) on GnRH neurons. Master regulator of the HPG axis; triggers pulsatile GnRH release which stimulates LH and FSH secretion from the anterior pituitary.",
    research_applications: JSON.stringify([
      "Reproductive endocrinology",
      "GnRH regulation",
      "Puberty research",
      "Fertility treatment",
      "LH/FSH stimulation",
    ]),
    typical_dosage_range: "0.3–10 nmol/kg IV infusion (clinical research)",
    half_life: "~28 minutes",
    administration_method: "Intravenous infusion, subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/20133451/",
      "https://pubmed.ncbi.nlm.nih.gov/25518009/",
    ]),
  },
  {
    slug: "gonadorelin",
    name: "Gonadorelin",
    aliases: JSON.stringify(["GnRH", "LHRH", "Factrel", "Lutrelef"]),
    category: "Reproductive",
    mechanism_of_action:
      "Synthetic decapeptide identical to endogenous GnRH. Pulsatile administration stimulates LH/FSH release from gonadotrophs; continuous administration causes receptor downregulation and gonadal suppression. Used diagnostically and therapeutically.",
    research_applications: JSON.stringify([
      "GnRH stimulation testing",
      "Hypogonadism diagnosis",
      "Fertility treatment",
      "Hypothalamic amenorrhea",
      "HPG axis assessment",
    ]),
    typical_dosage_range: "100 mcg IV/SC (diagnostic); pulsatile dosing for therapy",
    half_life: "2–4 minutes",
    administration_method: "Intravenous, subcutaneous injection, pulsatile pump",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/6130068/",
      "https://pubmed.ncbi.nlm.nih.gov/7023824/",
    ]),
  },
  {
    slug: "ara-290",
    name: "ARA-290",
    aliases: JSON.stringify(["Cibinetide", "Erythropoietin-derived peptide"]),
    category: "Immune Modulation",
    mechanism_of_action:
      "Engineered 11-amino acid peptide derived from helix B of erythropoietin. Selectively activates the innate repair receptor (EPOR/βcR heterodimer) without erythropoietic activity. Anti-inflammatory, tissue-protective, and promotes Schwann cell-mediated nerve repair.",
    research_applications: JSON.stringify([
      "Neuropathic pain",
      "Small fiber neuropathy",
      "Sarcoidosis",
      "Tissue protection",
      "Innate repair receptor",
    ]),
    typical_dosage_range: "4 mg IV or SC (clinical trials)",
    half_life: "~11 minutes",
    administration_method: "Intravenous, subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/22871599/",
      "https://pubmed.ncbi.nlm.nih.gov/26503055/",
    ]),
  },
  {
    slug: "ll-37",
    name: "LL-37",
    aliases: JSON.stringify(["Cathelicidin", "hCAP18 C-terminal peptide"]),
    category: "Immune Modulation",
    mechanism_of_action:
      "Human cathelicidin antimicrobial peptide (37 aa, Leu-Leu N-terminus). Forms amphipathic alpha-helix that disrupts microbial membranes. Also modulates TLR signaling, promotes angiogenesis, recruits immune cells via FPR2, and aids wound healing.",
    research_applications: JSON.stringify([
      "Antimicrobial activity",
      "Wound healing",
      "Immune modulation",
      "Biofilm disruption",
      "Cancer research",
    ]),
    typical_dosage_range: "Research-grade; no standard clinical dosing",
    half_life: "~30 minutes (plasma)",
    administration_method: "Topical, subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/24259261/",
      "https://pubmed.ncbi.nlm.nih.gov/23434654/",
    ]),
  },
  {
    slug: "peg-mgf",
    name: "PEG-MGF",
    aliases: JSON.stringify(["PEGylated Mechano Growth Factor"]),
    category: "Growth Factor",
    mechanism_of_action:
      "PEGylated form of MGF (IGF-1Ec splice variant) with extended half-life from polyethylene glycol conjugation. Activates satellite cell proliferation in damaged skeletal muscle, promotes muscle stem cell activation, and supports myoblast fusion for fiber repair.",
    research_applications: JSON.stringify([
      "Muscle repair",
      "Satellite cell activation",
      "Skeletal muscle regeneration",
      "Exercise recovery",
    ]),
    typical_dosage_range: "200–400 mcg, 2–3x weekly",
    half_life: "Several hours (extended by PEGylation)",
    administration_method: "Intramuscular or subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/15249150/",
      "https://pubmed.ncbi.nlm.nih.gov/16407210/",
    ]),
  },
  {
    slug: "mgf",
    name: "MGF",
    aliases: JSON.stringify(["Mechano Growth Factor", "IGF-1Ec"]),
    category: "Growth Factor",
    mechanism_of_action:
      "Splice variant of IGF-1 (IGF-1Ec in humans) produced by mechanically damaged muscle tissue. Activates muscle satellite cells (stem cells), promotes proliferation without premature differentiation, and initiates the muscle repair cascade.",
    research_applications: JSON.stringify([
      "Muscle damage response",
      "Satellite cell proliferation",
      "Tissue repair",
      "IGF-1 splicing research",
    ]),
    typical_dosage_range: "200–400 mcg locally",
    half_life: "~5–7 minutes (native)",
    administration_method: "Intramuscular injection (local)",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/15249150/",
      "https://pubmed.ncbi.nlm.nih.gov/12927378/",
    ]),
  },
  {
    slug: "follistatin-344",
    name: "Follistatin-344",
    aliases: JSON.stringify(["FS-344", "Follistatin"]),
    category: "Growth Factor",
    mechanism_of_action:
      "Autocrine glycoprotein that binds and neutralizes activin and myostatin (GDF-8) with high affinity. Removes the endogenous brake on muscle growth, allowing increased satellite cell proliferation and myofiber hypertrophy. Also modulates FSH levels.",
    research_applications: JSON.stringify([
      "Myostatin inhibition",
      "Muscle hypertrophy",
      "Muscular dystrophy",
      "Activin signaling",
      "Gene therapy research",
    ]),
    typical_dosage_range: "100–300 mcg/day (research dosing)",
    half_life: "Variable; rapid clearance (native protein)",
    administration_method: "Subcutaneous injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/17609436/",
      "https://pubmed.ncbi.nlm.nih.gov/21209025/",
    ]),
  },
  {
    slug: "igf-1-lr3",
    name: "IGF-1 LR3",
    aliases: JSON.stringify(["Long Arg3 IGF-1", "Long R3 IGF-1"]),
    category: "Growth Factor",
    mechanism_of_action:
      "Modified IGF-1 with Arg substitution at position 3 and 13-aa N-terminal extension. Has dramatically reduced IGFBP binding (~100x less), resulting in much higher free/active IGF-1 levels. Activates IGF-1R/PI3K/Akt and MAPK/ERK pathways for cell growth.",
    research_applications: JSON.stringify([
      "Cell proliferation",
      "Muscle hypertrophy",
      "Hyperplasia research",
      "IGFBP interaction studies",
      "Tissue engineering",
    ]),
    typical_dosage_range: "20–100 mcg/day",
    half_life: "~20–30 hours",
    administration_method: "Subcutaneous or intramuscular injection",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/7682608/",
      "https://pubmed.ncbi.nlm.nih.gov/16407210/",
    ]),
  },
  {
    slug: "igf-1-des",
    name: "IGF-1 DES",
    aliases: JSON.stringify(["Des(1-3) IGF-1", "Truncated IGF-1"]),
    category: "Growth Factor",
    mechanism_of_action:
      "Truncated IGF-1 variant lacking the first 3 N-terminal amino acids (Gly-Pro-Glu). This truncation eliminates most IGFBP binding, creating a highly potent, rapidly acting form approximately 10x more potent than native IGF-1 at the receptor level.",
    research_applications: JSON.stringify([
      "Potent IGF-1R activation",
      "Cell culture applications",
      "Local tissue growth",
      "IGFBP-independent signaling",
    ]),
    typical_dosage_range: "50–150 mcg locally, pre/post workout",
    half_life: "~20–30 minutes",
    administration_method: "Subcutaneous or intramuscular injection (local)",
    pubmed_links: JSON.stringify([
      "https://pubmed.ncbi.nlm.nih.gov/7682608/",
      "https://pubmed.ncbi.nlm.nih.gov/8290948/",
    ]),
  },
];

async function main() {
  console.log("Seeding peptide database...");

  for (const peptide of peptides) {
    await prisma.peptide.upsert({
      where: { slug: peptide.slug },
      update: peptide,
      create: peptide,
    });
    console.log(`  Seeded: ${peptide.name}`);
  }

  console.log(`\nDone! Seeded ${peptides.length} peptides.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
