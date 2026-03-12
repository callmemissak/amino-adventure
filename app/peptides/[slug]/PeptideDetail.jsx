"use client";
import Link from "next/link";

const categoryColors = {
  "Healing & Recovery": "#34d399",
  "Growth Hormone Secretagogue": "#818cf8",
  Metabolic: "#fb923c",
  "Longevity & Mitochondrial": "#f472b6",
  "Nootropic & Neuropeptide": "#22d3ee",
  "Cosmetic & Dermal": "#a78bfa",
  Melanocortin: "#fbbf24",
  Reproductive: "#f87171",
  "Immune Modulation": "#4ade80",
  "Growth Factor": "#60a5fa",
  "Bioregulator Peptide": "#c084fc",
};

export default function PeptideDetail({ peptide }) {
  const color = categoryColors[peptide.category] || "#818cf8";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#08080f",
        color: "#e2ddd5",
        fontFamily: "'Lato', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Disclaimer */}
      <div
        style={{
          background: "linear-gradient(135deg, #92400e, #b45309)",
          padding: "10px 24px",
          textAlign: "center",
          fontSize: "12px",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.5px",
        }}
      >
        FOR RESEARCH &amp; EDUCATIONAL PURPOSES ONLY — NOT MEDICAL ADVICE
      </div>

      {/* Header */}
      <header
        style={{
          padding: "16px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "#e2ddd5",
            fontFamily: "'Playfair Display', serif",
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          Peptide Atlas
        </Link>
        <Link
          href="/"
          style={{
            color: color,
            textDecoration: "none",
            fontSize: "14px",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          ← Back to Database
        </Link>
      </header>

      {/* Main content */}
      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "48px 24px 96px",
          animation: "fadeIn 0.6s ease-out",
        }}
      >
        {/* Category badge */}
        <div
          style={{
            display: "inline-block",
            background: `${color}18`,
            border: `1px solid ${color}40`,
            color: color,
            padding: "4px 14px",
            borderRadius: "999px",
            fontSize: "12px",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 500,
            marginBottom: "16px",
            letterSpacing: "0.5px",
          }}
        >
          {peptide.category}
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "48px",
            fontWeight: 700,
            margin: "0 0 8px",
            lineHeight: 1.1,
          }}
        >
          {peptide.name}
        </h1>

        {/* Aliases */}
        {peptide.aliases.length > 0 && (
          <p
            style={{
              color: "rgba(226,221,213,0.5)",
              fontSize: "15px",
              margin: "0 0 40px",
              fontStyle: "italic",
            }}
          >
            Also known as: {peptide.aliases.join(", ")}
          </p>
        )}

        {/* Stats grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          {[
            { label: "Half-Life", value: peptide.half_life },
            { label: "Typical Dosage", value: peptide.typical_dosage_range },
            { label: "Administration", value: peptide.administration_method },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "rgba(226,221,213,0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "8px",
                }}
              >
                {stat.label}
              </div>
              <div style={{ fontSize: "16px", fontWeight: 600 }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Mechanism of Action */}
        <section style={{ marginBottom: "40px" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "24px",
              fontWeight: 600,
              marginBottom: "16px",
              color: color,
            }}
          >
            Mechanism of Action
          </h2>
          <p
            style={{
              lineHeight: 1.8,
              color: "rgba(226,221,213,0.8)",
              fontSize: "15px",
            }}
          >
            {peptide.mechanism_of_action}
          </p>
        </section>

        {/* Research Applications */}
        <section style={{ marginBottom: "40px" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "24px",
              fontWeight: 600,
              marginBottom: "16px",
              color: color,
            }}
          >
            Research Applications
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {peptide.research_applications.map((app) => (
              <span
                key={app}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {app}
              </span>
            ))}
          </div>
        </section>

        {/* PubMed References */}
        {peptide.pubmed_links.length > 0 && (
          <section style={{ marginBottom: "40px" }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "24px",
                fontWeight: 600,
                marginBottom: "16px",
                color: color,
              }}
            >
              PubMed References
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {peptide.pubmed_links.map((link) => {
                const pmid = link.split("/").filter(Boolean).pop();
                return (
                  <a
                    key={link}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "rgba(52,211,153,0.08)",
                      border: "1px solid rgba(52,211,153,0.2)",
                      borderRadius: "8px",
                      padding: "10px 16px",
                      color: "#34d399",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontFamily: "'JetBrains Mono', monospace",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "rgba(52,211,153,0.15)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "rgba(52,211,153,0.08)";
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>PMID {pmid}</span>
                    <span style={{ color: "rgba(226,221,213,0.4)" }}>↗</span>
                  </a>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "24px 40px",
          textAlign: "center",
          fontSize: "12px",
          fontFamily: "'JetBrains Mono', monospace",
          color: "rgba(226,221,213,0.3)",
        }}
      >
        PEPTIDE ATLAS — FOR RESEARCH USE ONLY
      </footer>
    </div>
  );
}
