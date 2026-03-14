import Link from "next/link";
import { favoriteResearchers } from "@/lib/peptabase-data";

export default function ResearchersPage() {
  return (
    <div className="pb-shell">
      <div className="pb-warning-banner">⚠ FOR EDUCATIONAL &amp; RESEARCH PURPOSES ONLY — NOT FOR HUMAN CONSUMPTION — NOT MEDICAL ADVICE</div>
      <header className="pb-header">
        <div className="pb-header-inner">
          <Link href="/" className="pb-brand">
            <span className="pb-brand-mark">Curated research hub</span>
            <span className="pb-brand-name">PeptaBase</span>
          </Link>
          <nav className="pb-nav">
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
        </div>
      </header>
      <main className="pb-main">
        <section className="pb-section">
          <div className="pb-section-head">
            <div>
              <div className="pb-eyebrow">Favorite Researchers</div>
              <h1 className="pb-detail-title">Favorite Researchers</h1>
              <p className="pb-section-copy">
                This page is structured for curated profiles with photos, educational background, specialties, social links, and published work. Verified content can be added later without redesigning the page.
              </p>
            </div>
          </div>
          <div className="pb-card-grid">
            {favoriteResearchers.map((researcher) => (
              <article key={researcher.id} className="pb-card">
                <span className="pb-chip">{researcher.specialty}</span>
                <h2 className="pb-card-title">{researcher.name}</h2>
                <p className="pb-body">{researcher.summary}</p>
                <div className="pb-link-list">
                  <div className="pb-fact-row"><strong>Educational background:</strong> {researcher.educationalBackground}</div>
                  <div className="pb-fact-row"><strong>Published work:</strong> {researcher.publishedWork.join(", ")}</div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
