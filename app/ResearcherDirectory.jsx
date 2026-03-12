"use client";

import { useState, useEffect } from "react";

export default function ResearcherDirectory() {
  const [researchers, setResearchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterSpecialty, setFilterSpecialty] = useState("All");

  // Fetch researchers from database on mount
  useEffect(() => {
    const fetchResearchers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/researchers");
        if (!response.ok) throw new Error("Failed to fetch researchers");
        const data = await response.json();
        setResearchers(data);
      } catch (err) {
        console.error("Error fetching researchers:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResearchers();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "40px", color: "#e2ddd5", textAlign: "center" }}>
        <p>Loading researchers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", color: "#ef4444", textAlign: "center" }}>
        <p>Error loading researchers: {error}</p>
      </div>
    );
  }

  const specialties = [
    "All",
    ...new Set(researchers.map((r) => r.specialty)),
  ];

  const filtered =
    filterSpecialty === "All"
      ? researchers
      : researchers.filter((r) => r.specialty === filterSpecialty);

  const iconButtonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "rgba(52, 211, 153, 0.1)",
    border: "1px solid rgba(52, 211, 153, 0.3)",
    color: "#34d399",
    cursor: "pointer",
    transition: "all 0.2s",
    marginRight: "8px",
    textDecoration: "none",
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 400,
          fontSize: 34,
          marginBottom: 6,
          color: "#e2ddd5",
        }}
      >
        Favorite Researchers
      </h2>
      <p
        style={{
          color: "rgba(226, 221, 213, 0.55)",
          fontSize: 15,
          marginBottom: 28,
          lineHeight: 1.6,
        }}
      >
        Key figures and institutions advancing peptide research. This directory
        is curated for reference purposes only and does not constitute an
        endorsement.
      </p>

      {/* Filter by Specialty */}
      <div style={{ marginBottom: 24 }}>
        <p
          style={{
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            color: "rgba(226, 221, 213, 0.5)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 10,
          }}
        >
          Filter by Specialty:
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setFilterSpecialty(spec)}
              style={{
                padding: "6px 14px",
                background:
                  filterSpecialty === spec ? "#34d399" : "transparent",
                color: filterSpecialty === spec ? "#08080f" : "#e2ddd5",
                border: `1px solid ${
                  filterSpecialty === spec
                    ? "#34d399"
                    : "rgba(226, 221, 213, 0.2)"
                }`,
                borderRadius: 20,
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: "500",
                letterSpacing: "0.06em",
                transition: "all 0.2s",
              }}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Researchers Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: 16,
        }}
      >
        {filtered.map((researcher) => (
          <div
            key={researcher.id}
            style={{
              padding: 20,
              background: "#0a0a10",
              border: "1px solid rgba(52, 211, 153, 0.2)",
              borderRadius: 8,
              transition: "all 0.3s",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(52, 211, 153, 0.5)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(52, 211, 153, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                "rgba(52, 211, 153, 0.2)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {/* Name & Title */}
            <h3
              style={{
                margin: "0 0 4px 0",
                fontSize: 16,
                fontWeight: 600,
                color: "#e2ddd5",
              }}
            >
              {researcher.name}
            </h3>
            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: 13,
                color: "#34d399",
                fontWeight: 500,
              }}
            >
              {researcher.specialty}
            </p>
            <p
              style={{
                margin: "0 0 12px 0",
                fontSize: 12,
                color: "rgba(226, 221, 213, 0.6)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {researcher.institution}
            </p>

            {/* Expertise Tags */}
            {researcher.expertise && Array.isArray(researcher.expertise) && researcher.expertise.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                  }}
                >
                  {researcher.expertise.map((exp, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: "4px 10px",
                        background: "rgba(52, 211, 153, 0.08)",
                        border: "1px solid rgba(52, 211, 153, 0.2)",
                        color: "#34d399",
                        borderRadius: 3,
                        fontSize: 10,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: "500",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {researcher.notes && (
              <p
                style={{
                  margin: "12px 0",
                  fontSize: 12,
                  color: "rgba(226, 221, 213, 0.5)",
                  lineHeight: 1.5,
                  fontStyle: "italic",
                }}
              >
                {researcher.notes}
              </p>
            )}

            {/* Social Links */}
            <div
              style={{
                marginTop: 14,
                paddingTop: 14,
                borderTop: "1px solid rgba(226, 221, 213, 0.1)",
                display: "flex",
                gap: 4,
              }}
            >
              {researcher.pubmed_url && (
                <a
                  href={researcher.pubmed_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="PubMed Profile"
                  style={iconButtonStyle}
                >
                  📚
                </a>
              )}
              {researcher.twitter_url && (
                <a
                  href={researcher.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Twitter"
                  style={iconButtonStyle}
                >
                  𝕏
                </a>
              )}
              {researcher.linkedin_url && (
                <a
                  href={researcher.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                  style={iconButtonStyle}
                >
                  💼
                </a>
              )}
              {researcher.website_url && (
                <a
                  href={researcher.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Website"
                  style={iconButtonStyle}
                >
                  🌐
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div
        style={{
          marginTop: 40,
          padding: "16px 20px",
          background: "rgba(139, 92, 246, 0.05)",
          border: "1px solid rgba(139, 92, 246, 0.15)",
          borderRadius: 6,
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            color: "rgba(226, 221, 213, 0.4)",
            margin: 0,
            letterSpacing: "0.03em",
          }}
        >
          ⚠️ COMPLIANCE NOTE: This directory is for educational purposes only.
          Inclusion does not imply endorsement. All researchers listed have
          published peer-reviewed work. Social links are public-facing official
          accounts only.
        </p>
      </div>
    </div>
  );
}
