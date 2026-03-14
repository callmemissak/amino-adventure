import Auth from "@/app/Auth";
import UserDashboard from "@/app/UserDashboard";

export const metadata = {
  title: "PeptaBase Dashboard",
  description: "Saved peptides, inventory, injection logs, and personal research tools."
};

export default function DashboardPage() {
  return (
    <div className="pb-shell">
      <div className="pb-warning-banner">⚠ FOR EDUCATIONAL &amp; RESEARCH PURPOSES ONLY — NOT FOR HUMAN CONSUMPTION — NOT MEDICAL ADVICE</div>
      <header className="pb-header">
        <div className="pb-header-inner">
          <a href="/" className="pb-brand">
            <span className="pb-brand-mark">Personal peptide workspace</span>
            <span className="pb-brand-name">PeptaBase</span>
          </a>
        </div>
      </header>
      <main className="pb-main">
        <section className="pb-section">
          <div className="pb-section-head">
            <div>
              <div className="pb-eyebrow">User Dashboard</div>
              <h1 className="pb-detail-title">Inventory, Logs, and Saved Research</h1>
              <p className="pb-section-copy">
                Supabase-backed authentication, inventory, injection logging, saved peptides, and developer note submissions are scaffolded here for the next phase.
              </p>
            </div>
          </div>
          <div className="pb-dashboard-grid">
            <div className="pb-form-card">
              <Auth />
            </div>
            <div className="pb-form-card">
              <div className="pb-link-list">
                <div className="pb-fact-row"><strong>Saved peptides:</strong> ready for library and bookmark storage</div>
                <div className="pb-fact-row"><strong>Inventory:</strong> vial strength, quantity, reconstitution notes, date added</div>
                <div className="pb-fact-row"><strong>Injection logs:</strong> peptide, dose, unit, site, date, and notes</div>
                <div className="pb-fact-row"><strong>Developer notes:</strong> research insights, corrections, and observations</div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <UserDashboard />
          </div>
        </section>
      </main>
    </div>
  );
}
