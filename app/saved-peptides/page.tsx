import UtilityPage from "@/components/peptabase/UtilityPage";
import SavedPeptidesView from "@/components/peptabase/SavedPeptidesView";
import { buildPageMetadata } from "@/lib/seo";
import { loadPeptides } from "@/lib/peptide-server";

export const metadata = buildPageMetadata({
  title: "Saved Peptides | PeptaBase",
  description:
    "View your bookmarked peptides in one place and return to saved research entries inside the PeptaBase database.",
  path: "/saved-peptides"
});

export default async function SavedPeptidesPage() {
  const peptides = await loadPeptides();

  return (
    <UtilityPage
      eyebrow="Saved Library"
      title="Saved peptides"
      description="Your bookmarked peptides are stored locally for now, giving you a personal shortlist of entries to revisit quickly."
      links={[
        { href: "/", label: "Back to database" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/calculator", label: "Calculator hub" }
      ]}
    >
      <SavedPeptidesView peptides={peptides} />
    </UtilityPage>
  );
}
