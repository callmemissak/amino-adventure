import Link from "next/link";
import UtilityPage from "@/components/peptabase/UtilityPage";
import { Glp1DoseCalculator, ReconstitutionCalculator } from "@/components/peptabase/Calculators";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Peptide Calculator Hub | PeptaBase",
  description:
    "Use the PeptaBase calculator hub for peptide reconstitution and GLP-1 planning tools built for research workflow and inventory prep.",
  path: "/calculator"
});

const links = [
  { href: "/", label: "Back to database" },
  { href: "/reconstitution-calculator", label: "Reconstitution calculator" },
  { href: "/glp-1-dose-calculator", label: "GLP-1 dose planner" }
];

export default function CalculatorPage() {
  return (
    <UtilityPage
      eyebrow="Calculator Hub"
      title="Research calculators for reconstitution and planning."
      description="These tools support peptide research workflows, solution planning, and inventory preparation without interrupting the core database experience."
      links={links}
    >
      <div className="pb-tool-grid">
        <ReconstitutionCalculator />
        <Glp1DoseCalculator />
      </div>
      <div className="pb-card-grid">
        <div className="pb-card">
          <h2 className="pb-card-title">Use calculators alongside the database.</h2>
          <p className="pb-body">Peptide entries link back to the most relevant utility routes so the calculators remain integrated research tools, not detached widgets.</p>
          <Link href="/" className="pb-button-secondary">Open peptide database</Link>
        </div>
        <div className="pb-card">
          <h2 className="pb-card-title">Workflow support</h2>
          <p className="pb-body">This calculator area can support saved protocols, tracked inventory, and account-level research workflows as the platform expands.</p>
          <Link href="/dashboard" className="pb-button-secondary">Open dashboard</Link>
        </div>
      </div>
    </UtilityPage>
  );
}
