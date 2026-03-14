import UtilityPage from "@/components/peptabase/UtilityPage";
import { peptideStacks } from "@/lib/peptabase-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Peptide Stacks | PeptaBase",
  description:
    "Review peptide stack templates such as fat loss, recovery, and GH pulse combinations with cleaner context and internal links into the research database.",
  path: "/peptide-stacks"
});

export default function PeptideStacksPage() {
  return (
    <UtilityPage
      eyebrow="Stacks"
      title="Peptide stack templates"
      description="These stack pages create stronger internal pathways between common peptide pairings, comparison routes, and the main database while staying firmly educational."
      links={[
        { href: "/", label: "Back to database" },
        { href: "/peptide-comparisons", label: "Peptide comparisons" },
        { href: "/calculator", label: "Calculator hub" }
      ]}
    >
      <div className="pb-panel">
        {peptideStacks.map((stack) => (
          <div key={stack.name} className="pb-stack-row">
            <div>
              <strong>{stack.name}</strong>
              <div className="pb-subtle">{stack.peptides.join(" + ")}</div>
            </div>
            <div className="pb-subtle">{stack.focus}</div>
            <div className="pb-subtle">{stack.note}</div>
          </div>
        ))}
      </div>
    </UtilityPage>
  );
}
