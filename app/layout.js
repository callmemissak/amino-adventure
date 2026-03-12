import ServiceWorkerRegistration from "./ServiceWorkerRegistration";
import InstallPrompt from "./InstallPrompt";

export const metadata = {
  title: "Peptide Atlas — Citation-Backed Peptide Research Database",
  description:
    "Structured pharmacokinetic data, regulatory status, and peer-reviewed PubMed citations for research peptides.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Peptide Atlas",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  openGraph: {
    title: "Peptide Atlas — Research Database",
    description:
      "Independent peptide research database with citation-backed pharmacokinetic data and PubMed references.",
    url: "https://peptide-atlas.vercel.app",
    siteName: "Peptide Atlas",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Peptide Atlas — Research Database",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peptide Atlas",
    description:
      "Citation-backed peptide research database with PubMed references.",
    images: ["/og-image.svg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  viewportFit: "cover",
  themeColor: "#08080f",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* PWA & Mobile Optimization */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#08080f" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.svg" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/icon-152.svg"
        />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/icons/icon-192.svg"
        />

        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

        {/* Apple-specific PWA tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Peptide Atlas" />

        {/* Apple Splash Screen */}
        <meta name="apple-touch-startup-image" content="/icons/icon-512.svg" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#08080f" />
        <meta name="msapplication-TileImage" content="/icons/icon-144.svg" />

        {/* Mobile text and touch optimization */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; scroll-behavior: smooth; }
              body {
                margin: 0; padding: 0;
                -webkit-tap-highlight-color: transparent;
                -webkit-touch-callout: none;
                overscroll-behavior-y: none;
              }
              /* Safe area insets for notched phones */
              body {
                padding-top: env(safe-area-inset-top);
                padding-bottom: env(safe-area-inset-bottom);
                padding-left: env(safe-area-inset-left);
                padding-right: env(safe-area-inset-right);
              }
              /* Prevent overscroll bounce in standalone mode */
              @media (display-mode: standalone) {
                body { overscroll-behavior: none; }
              }
            `,
          }}
        />
      </head>
      <body>
        {children}
        <ServiceWorkerRegistration />
        <InstallPrompt />
      </body>
    </html>
  );
}
