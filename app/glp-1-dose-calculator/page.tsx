import UtilityPage from "@/components/peptabase/UtilityPage";
import { Glp1DoseCalculator } from "@/components/peptabase/Calculators";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "GLP-1 Dose Planner | PeptaBase",
  description:
    "Plan weekly GLP-1 research material requirements for semaglutide, tirzepatide, retatrutide, and cagrilintide with a clean dose planning calculator.",
  path: "/glp-1-dose-calculator"
});

export default function Glp1DoseCalculatorPage() {
  return (
    <UtilityPage
      eyebrow="GLP-1 Planner"
      title="GLP-1 dose planning calculator"
      description="Estimate total planned research material for common GLP-1 peptides over a cycle. This page focuses on research planning and inventory requirements."
      links={[
        { href: "/", label: "Back to database" },
        { href: "/calculator", label: "Calculator hub" },
        { href: "/reconstitution-calculator", label: "Reconstitution calculator" }
      ]}
    >
      <div className="pb-tool-grid">
        <Glp1DoseCalculator />
      </div>
      <div className="pb-card-grid">
        <div className="pb-card">
          <h2 className="pb-card-title">Purpose-built for planning</h2>
          <p className="pb-body">The tool estimates total cycle material and approximate vial needs without modeling in-body concentration or medical outcomes.</p>
        </div>
        <div className="pb-card">
          <h2 className="pb-card-title">Useful linked entries</h2>
          <p className="pb-body">Use this alongside database entries for Semaglutide, Tirzepatide, Retatrutide, and Cagrilintide to move between research reading and practical planning.</p>
        </div>
      </div>
    </UtilityPage>
  );
}
