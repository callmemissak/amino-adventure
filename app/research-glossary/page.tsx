import UtilityPage from "@/components/peptabase/UtilityPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Peptide Research Glossary | PeptaBase",
  description:
    "Understand common peptide research terms such as half-life, reconstitution, development stage, mechanism of action, and evidence level in a clean research glossary.",
  path: "/research-glossary"
});

const glossary = [
  ["Mechanism of action", "A concise explanation of how a peptide is thought to interact with receptors, pathways, or biological processes in research."],
  ["Half-life", "An estimate of how long a substance remains measurable before half of the amount is cleared or degraded under the studied conditions."],
  ["Development stage", "The current point in the research lifecycle, such as preclinical, clinical, approved, or research-only."],
  ["Evidence level", "An editorial shorthand used in PeptaBase to indicate whether visible citations are limited, early, or more developed."],
  ["Reconstitution", "The process of mixing a lyophilized peptide with a liquid such as BAC water to create a usable research solution."],
  ["PubMed", "A searchable index of biomedical literature used here for direct study links and research discovery."],
  ["FDA status", "A label describing whether a peptide has an approved indication, remains investigational, or is research-only."]
];

export default function ResearchGlossaryPage() {
  return (
    <UtilityPage
      eyebrow="Glossary"
      title="Research glossary for peptide readers"
      description="This glossary supports search intent, improves readability for newer users, and gives peptide entries cleaner definitions to link back into."
      links={[
        { href: "/", label: "Back to database" },
        { href: "/peptide-comparisons", label: "Peptide comparisons" },
        { href: "/reconstitution-calculator", label: "Reconstitution calculator" }
      ]}
    >
      <div className="pb-card-grid">
        {glossary.map(([term, explanation]) => (
          <div key={term} className="pb-card">
            <h2 className="pb-card-title">{term}</h2>
            <p className="pb-body">{explanation}</p>
          </div>
        ))}
      </div>
    </UtilityPage>
  );
}
