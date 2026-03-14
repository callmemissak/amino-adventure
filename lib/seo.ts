import { absoluteUrl, siteConfig } from "@/lib/site-config";

function text(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function limit(value: string, size: number) {
  if (value.length <= size) {
    return value;
  }

  return `${value.slice(0, size - 1).trimEnd()}...`;
}

export function buildPageMetadata({
  title,
  description,
  path,
  image = siteConfig.ogImage
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}) {
  const canonical = absoluteUrl(path);

  return {
    title,
    description: limit(description, 160),
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description: limit(description, 200),
      url: canonical,
      siteName: siteConfig.name,
      images: [
        {
          url: absoluteUrl(image),
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      locale: "en_US",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: limit(description, 200),
      images: [absoluteUrl(image)]
    }
  };
}

export function buildPeptideDescription(peptide: any) {
  const aliases = (peptide.aliases || []).slice(0, 2).join(", ");
  const mechanism = text(peptide.mechanismOfAction, "mechanism and research context");
  const lead = aliases ? `${peptide.name} (${aliases})` : peptide.name;
  return limit(
    `${lead} research database entry covering ${mechanism}, research applications, dose range, half-life, FDA status, development stage, and direct PubMed studies.`,
    160
  );
}

export function buildPeptideMetadata(peptide: any) {
  const description = buildPeptideDescription(peptide);
  return buildPageMetadata({
    title: `${peptide.name} Research Database Entry | ${siteConfig.name}`,
    description,
    path: `/peptides/${peptide.slug}`
  });
}

export function websiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function organizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/favicon.svg"),
    sameAs: []
  };
}

export function breadcrumbStructuredData(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function peptideStructuredData(peptide: any) {
  const primaryCitation = peptide.references?.[0];
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: peptide.name,
    description: buildPeptideDescription(peptide),
    url: absoluteUrl(`/peptides/${peptide.slug}`),
    termCode: peptide.slug,
    inDefinedTermSet: absoluteUrl("/"),
    alternateName: peptide.aliases || [],
    additionalProperty: [
      { "@type": "PropertyValue", name: "Category", value: text(peptide.category, "Research peptide") },
      { "@type": "PropertyValue", name: "Mechanism of action", value: text(peptide.mechanismOfAction, "Research context pending") },
      { "@type": "PropertyValue", name: "Development stage", value: text(peptide.developmentStage, "Pending") },
      { "@type": "PropertyValue", name: "FDA status", value: text(peptide.fdaStatus, "Pending") }
    ],
    subjectOf: primaryCitation?.url
      ? {
          "@type": "ScholarlyArticle",
          name: primaryCitation.title || primaryCitation.url,
          url: primaryCitation.url,
          isPartOf: primaryCitation.journal || "PubMed"
        }
      : undefined
  };
}
