export const siteConfig = {
  name: "PeptaBase",
  shortName: "PeptaBase",
  description:
    "Scientific peptide and bioregulator research database with calculators, comparisons, stacks, and research workflow tools.",
  url: "https://peptabase.com",
  ogImage: "/og-image.svg",
  xHandle: "@peptabase"
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
