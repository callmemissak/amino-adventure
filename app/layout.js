import "./globals.css";
import ServiceWorkerRegistration from "./ServiceWorkerRegistration";
import StructuredData from "@/components/seo/StructuredData";
import { organizationStructuredData, websiteStructuredData } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "PeptaBase | Peptide and Bioregulator Research Database",
  description:
    "Search peptides, review scientific research, run peptide calculators, and manage inventory in one research-focused platform.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PeptaBase"
  },
  formatDetection: {
    telephone: false
  },
  other: {
    "mobile-web-app-capable": "yes"
  },
  openGraph: {
    title: "PeptaBase | Research Platform",
    description:
      "Unified peptide and bioregulator research platform with structured entries, calculators, and dashboard tooling.",
    url: "https://peptabase.com",
    siteName: "PeptaBase",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "PeptaBase research platform"
      }
    ],
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "PeptaBase",
    description:
      "Peptide and bioregulator research database, calculator toolkit, and inventory dashboard.",
    images: ["/og-image.svg"]
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  viewportFit: "cover",
  themeColor: "#F8FAFC"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F8FAFC" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.svg" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152.svg" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192.svg" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PeptaBase" />
        <meta name="apple-touch-startup-image" content="/icons/icon-512.svg" />
        <meta name="msapplication-TileColor" content="#F8FAFC" />
        <meta name="msapplication-TileImage" content="/icons/icon-144.svg" />
      </head>
      <body>
        <StructuredData data={[organizationStructuredData(), websiteStructuredData()]} />
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
