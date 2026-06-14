// app/layout.tsx (simplified)
import type { Metadata } from "next";
import { Montserrat, Jost, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import GoogleAnalytics from "@/components/SEO/GoogleAnalytics";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap"
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap"
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap"
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.associatte.com";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

// WebSite structured data — enables the Google sitelinks search box and
// reinforces the canonical site name in search results.
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Associatte PropTech",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/properties?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Associatte PropTech | Buy Verified Properties in Pune, Mumbai & KDMC",
    template: "%s | Associatte PropTech",
  },
  description:
    "Find verified RERA-registered 1, 2, 3 & 4 BHK flats and projects across Pune, Mumbai and KDMC. Expert guidance, transparent pricing and free consultation with Associatte PropTech.",
  keywords: [
    "Associatte PropTech",
    "properties in Pune",
    "properties in Mumbai",
    "flats in KDMC",
    "RERA registered projects",
    "buy property Maharashtra",
  ],
  authors: [{ name: "Associatte PropTech Pvt Ltd" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: "/" },
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
  openGraph: {
    type: "website",
    siteName: "Associatte PropTech",
    title: "Associatte PropTech | Verified Properties in Pune, Mumbai & KDMC",
    description:
      "Find verified RERA-registered homes across Pune, Mumbai and KDMC with expert guidance and free consultation.",
    locale: "en_IN",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Associatte PropTech | Verified Properties in Pune, Mumbai & KDMC",
    description:
      "Find verified RERA-registered homes across Pune, Mumbai and KDMC with expert guidance and free consultation.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta name="theme-color" content="#005E60" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${montserrat.variable} ${jost.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientLayout>{children}</ClientLayout>
        {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
      </body>
    </html>
  );
}