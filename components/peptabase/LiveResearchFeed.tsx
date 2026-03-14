"use client";

import { useEffect, useMemo, useState } from "react";

const PUBMED_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

type Article = {
  pmid: string;
  title: string;
  journal: string;
  year: string;
  authors: string;
  url: string;
};

async function fetchPubMedFeed(query: string, maxResults: number): Promise<Article[]> {
  const searchRes = await fetch(
    `${PUBMED_BASE}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&sort=pub+date&retmax=${maxResults}&retmode=json`,
    { cache: "no-store" }
  );
  const searchData = await searchRes.json();
  const ids = searchData.esearchresult?.idlist || [];

  if (!ids.length) {
    return [];
  }

  const summaryRes = await fetch(
    `${PUBMED_BASE}/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json`,
    { cache: "no-store" }
  );
  const summaryData = await summaryRes.json();

  return ids
    .map((id: string) => summaryData.result?.[id])
    .filter(Boolean)
    .map((item: any) => ({
      pmid: item.uid,
      title: item.title,
      journal: item.fulljournalname || item.source || "PubMed",
      year: item.pubdate ? String(item.pubdate).slice(0, 4) : "",
      authors: Array.isArray(item.authors) ? item.authors.slice(0, 3).map((author: { name: string }) => author.name).join(", ") : "",
      url: `https://pubmed.ncbi.nlm.nih.gov/${item.uid}/`
    }));
}

type FeedProps = {
  peptideName?: string;
  compact?: boolean;
};

export default function LiveResearchFeed({ peptideName = "", compact = false }: FeedProps) {
  const feedOptions = useMemo(() => {
    return peptideName
      ? [peptideName, `${peptideName} peptide`, `${peptideName} mechanism`]
      : ["peptide research", "bioregulator peptide", "semaglutide tirzepatide peptide"];
  }, [peptideName]);

  const [query, setQuery] = useState(feedOptions[0]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setQuery(feedOptions[0]);
  }, [feedOptions]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const items = await fetchPubMedFeed(query, compact ? 5 : 8);
        if (!cancelled) {
          setArticles(items);
        }
      } catch {
        if (!cancelled) {
          setError("Live feed unavailable right now.");
          setArticles([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [compact, query]);

  return (
    <div className="pb-tool">
      <div className="pb-section-head" style={{ marginBottom: 12 }}>
        <div>
          <div className="pb-eyebrow">Live Feed</div>
          <h3 className="pb-card-title">{peptideName ? `${peptideName} PubMed studies` : "Live PubMed feed"}</h3>
        </div>
      </div>
      <p className="pb-form-help">
        Real-time PubMed results pulled directly from the NCBI E-utilities API.
      </p>
      <div className="pb-tab-row">
        {feedOptions.map((option) => (
          <button
            key={option}
            className={`pb-tab-button ${query === option ? "active" : ""}`}
            type="button"
            onClick={() => setQuery(option)}
          >
            {option}
          </button>
        ))}
      </div>
      {loading ? <div className="pb-empty">Loading live PubMed feed...</div> : null}
      {error ? <div className="pb-warning-box">{error}</div> : null}
      {!loading && !error ? (
        <div className="pb-reference-list">
          {articles.map((article) => (
            <a key={article.pmid} href={article.url} target="_blank" rel="noopener noreferrer" className="pb-reference-item">
              <strong>{article.title}</strong>
              <div className="pb-subtle">
                PMID {article.pmid}
                {article.authors ? ` | ${article.authors}` : ""}
              </div>
              <div className="pb-subtle">
                {article.journal}
                {article.year ? ` | ${article.year}` : ""}
              </div>
            </a>
          ))}
          {articles.length === 0 ? <div className="pb-empty">No live results returned for this filter.</div> : null}
        </div>
      ) : null}
    </div>
  );
}
