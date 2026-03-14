import UtilityPage from "@/components/peptabase/UtilityPage";
import { ReconstitutionCalculator } from "@/components/peptabase/Calculators";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Peptide Reconstitution Calculator | PeptaBase",
  description:
    "Calculate peptide reconstitution concentration, volume per dose, and syringe units with a research-focused peptide reconstitution calculator.",
  path: "/reconstitution-calculator"
});

export default function ReconstitutionCalculatorPage() {
  return (
    <UtilityPage
      eyebrow="Reconstitution"
      title="Peptide reconstitution calculator"
      description="Use vial strength, BAC water volume, and desired dose inputs to plan reconstitution and syringe unit estimates inside a clean research workflow."
      links={[
        { href: "/", label: "Back to database" },
        { href: "/calculator", label: "Calculator hub" },
        { href: "/glp-1-dose-calculator", label: "GLP-1 dose planner" }
      ]}
    >
      <div className="pb-tool-grid">
        <ReconstitutionCalculator />
      </div>
      <div className="pb-card-grid">
        <div className="pb-card">
          <h2 className="pb-card-title">What this tool helps with</h2>
          <p className="pb-body">Use it to estimate concentration per ml, the volume needed for a target dose, and the corresponding insulin syringe units for research prep.</p>
        </div>
        <div className="pb-card">
          <h2 className="pb-card-title">How it connects to the database</h2>
          <p className="pb-body">Accordion entries can link here directly so users move from peptide research into a practical calculator without leaving the research environment.</p>
        </div>
      </div>
    </UtilityPage>
  );
}
